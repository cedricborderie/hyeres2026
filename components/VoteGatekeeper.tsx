"use client";

import { createContext, useContext, useState, useCallback, useEffect, useRef, ReactNode } from "react";
import { submitVote, VoteResult } from "@/app/actions/vote";
import { verifyHumanToken } from "@/app/actions/security";
import { Turnstile } from "@marsidev/react-turnstile";
import confetti from "canvas-confetti";

interface VoteContextType {
  vote: (proposalId: string) => Promise<VoteResult>;
}

const VoteContext = createContext<VoteContextType | undefined>(undefined);

export const useVoteContext = () => {
  const context = useContext(VoteContext);
  if (!context) {
    throw new Error("useVoteContext must be used within VoteGatekeeper");
  }
  return context;
};

interface VoteGatekeeperProps {
  children: ReactNode;
}

export default function VoteGatekeeper({ children }: VoteGatekeeperProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingProposalId, setPendingProposalId] = useState<string | null>(null);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const pendingResolveRef = useRef<((result: VoteResult) => void) | null>(null);

  // TEST: Force modal open for debugging (remove after testing)
  // Uncomment to test if modal renders at all
  // useEffect(() => {
  //   setTimeout(() => {
  //     console.log("TEST: Forcing modal open");
  //     setIsModalOpen(true);
  //     setPendingProposalId("test-proposal-id");
  //   }, 2000);
  // }, []);

  const handleVote = useCallback(async (proposalId: string): Promise<VoteResult> => {
    // Call server action
    const result: VoteResult = await submitVote(proposalId);

    console.log("VoteGatekeeper - Vote result:", result);

    if (result.error === "CAPTCHA_REQUIRED") {
      // Open modal and save proposal ID
      console.log("VoteGatekeeper - Opening CAPTCHA modal for proposal:", proposalId);
      setPendingProposalId(proposalId);
      setIsModalOpen(true);
      
      // Return a promise that will resolve when the vote is completed via Turnstile
      return new Promise<VoteResult>((resolve) => {
        pendingResolveRef.current = resolve;
      });
    }

    if (result.success) {
      // Trigger confetti for successful vote
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    } else if (result.message && result.error !== "CAPTCHA_REQUIRED") {
      // Show error message only if it's not a CAPTCHA requirement
      alert(result.message);
    }

    return result;
  }, []);

  const handleTurnstileSuccess = useCallback(async (token: string) => {
    setTurnstileToken(token);
  }, []);

  const handleVerifyAndRetry = useCallback(async () => {
    if (!turnstileToken || !pendingProposalId) {
      return;
    }

    setIsVerifying(true);

    try {
      // Verify token with server
      const verifyResult = await verifyHumanToken(turnstileToken);

      if (!verifyResult.success) {
        alert(verifyResult.message || "La vérification a échoué. Veuillez réessayer.");
        setIsVerifying(false);
        return;
      }

      // Close modal
      setIsModalOpen(false);
      setTurnstileToken(null);
      const proposalIdToRetry = pendingProposalId;
      setPendingProposalId(null);

      // Retry the vote
      const voteResult = await submitVote(proposalIdToRetry);

      if (voteResult.success) {
        // Trigger confetti
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      } else if (voteResult.message) {
        alert(voteResult.message);
      }

      // Resolve the pending promise to notify ProposalCard
      if (pendingResolveRef.current) {
        pendingResolveRef.current(voteResult);
        pendingResolveRef.current = null;
      }
    } catch (error) {
      console.error("Error verifying and retrying vote:", error);
      alert("Une erreur est survenue. Veuillez réessayer.");
      
      // Resolve with error result
      if (pendingResolveRef.current) {
        pendingResolveRef.current({
          success: false,
          message: "Une erreur est survenue. Veuillez réessayer.",
        });
        pendingResolveRef.current = null;
      }
    } finally {
      setIsVerifying(false);
    }
  }, [turnstileToken, pendingProposalId]);

  const handleCloseModal = useCallback(() => {
    if (!isVerifying) {
      setIsModalOpen(false);
      setPendingProposalId(null);
      setTurnstileToken(null);
      
      // If modal is closed without voting, resolve with cancelled result
      if (pendingResolveRef.current) {
        pendingResolveRef.current({
          success: false,
          message: "Vote annulé",
        });
        pendingResolveRef.current = null;
      }
    }
  }, [isVerifying]);

  // Debug: Log when modal opens
  useEffect(() => {
    if (isModalOpen) {
      console.log("VoteGatekeeper - Modal is now open", { 
        pendingProposalId, 
        turnstileToken,
        siteKey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ? "présente" : "manquante"
      });
      // Force a re-render to ensure modal is visible
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isModalOpen, pendingProposalId, turnstileToken]);

  return (
    <VoteContext.Provider value={{ vote: handleVote }}>
      {children}

      {/* Captcha Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4"
          onClick={handleCloseModal}
          style={{ 
            position: 'fixed', 
            top: 0, 
            left: 0, 
            right: 0, 
            bottom: 0, 
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)'
          }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <div
            className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
            style={{ 
              zIndex: 10000,
              position: 'relative',
              backgroundColor: 'white'
            }}
          >
            <h2 id="modal-title" className="text-2xl font-bold text-gray-900 mb-4">
              Vérification de sécurité
            </h2>
            <p className="text-gray-600 mb-6">
              Pour garantir l'intégrité du vote, veuillez compléter la vérification ci-dessous.
            </p>

            <div className="flex justify-center mb-6">
              {(() => {
                const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
                console.log("VoteGatekeeper - Turnstile siteKey:", siteKey ? "présente" : "manquante");
                
                if (!siteKey) {
                  return (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-red-800 text-sm">
                        Erreur : La clé Turnstile n'est pas configurée. Vérifiez NEXT_PUBLIC_TURNSTILE_SITE_KEY dans .env.local
                      </p>
                      <p className="text-red-600 text-xs mt-2">
                        Redémarrez le serveur de développement après avoir ajouté la variable.
                      </p>
                    </div>
                  );
                }
                
                return (
                  <Turnstile
                    siteKey={siteKey}
                    onSuccess={handleTurnstileSuccess}
                    onError={(error) => {
                      console.error("Turnstile error:", error);
                    }}
                    options={{
                      theme: "light",
                    }}
                  />
                );
              })()}
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleCloseModal}
                disabled={isVerifying}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Annuler
              </button>
              <button
                onClick={handleVerifyAndRetry}
                disabled={!turnstileToken || isVerifying}
                className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isVerifying ? "Vérification..." : "Vérifier et voter"}
              </button>
            </div>
          </div>
        </div>
      )}
    </VoteContext.Provider>
  );
}
