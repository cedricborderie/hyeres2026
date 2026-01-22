"use client";

import { createContext, useContext, useState, useCallback, useEffect, useRef, ReactNode } from "react";
import { submitVote, VoteResult } from "@/app/actions/vote";
import { verifyHumanToken } from "@/app/actions/security";
import { Turnstile } from "@marsidev/react-turnstile";
import confetti from "canvas-confetti";

const HUMAN_FLAG_COOKIE = "human_flag";

interface VoteContextType {
  vote: (proposalId: string) => Promise<VoteResult>;
  optimisticVotes: Set<string>;
  votingIds: Set<string>;
  removeOptimistic: (proposalId: string) => void;
}

const VoteContext = createContext<VoteContextType | undefined>(undefined);

export const useVoteContext = () => {
  const context = useContext(VoteContext);
  if (!context) {
    throw new Error("useVoteContext must be used within VoteGatekeeper");
  }
  return context;
};

function isVerified(): boolean {
  if (typeof document === "undefined") return false;
  return document.cookie.includes(`${HUMAN_FLAG_COOKIE}=`);
}

interface VoteGatekeeperProps {
  children: ReactNode;
}

export default function VoteGatekeeper({ children }: VoteGatekeeperProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingProposalId, setPendingProposalId] = useState<string | null>(null);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [optimisticVotes, setOptimisticVotes] = useState<Set<string>>(new Set());
  const [votingIds, setVotingIds] = useState<Set<string>>(new Set());
  const pendingResolveRef = useRef<((result: VoteResult) => void) | null>(null);

  const addOptimistic = useCallback((id: string) => {
    setOptimisticVotes((prev) => new Set(prev).add(id));
  }, []);

  const removeOptimistic = useCallback((id: string) => {
    setOptimisticVotes((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }, []);

  const handleVote = useCallback(async (proposalId: string): Promise<VoteResult> => {
    const verified = isVerified();

    if (!verified) {
      setPendingProposalId(proposalId);
      setIsModalOpen(true);
      return new Promise<VoteResult>((resolve) => {
        pendingResolveRef.current = resolve;
      });
    }

    addOptimistic(proposalId);
    setVotingIds((prev) => new Set(prev).add(proposalId));
    try {
      const result = await submitVote(proposalId);
      if (result.success) {
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
        removeOptimistic(proposalId);
      } else {
        removeOptimistic(proposalId);
        if (result.message) alert(result.message);
      }
      return result;
    } catch (err) {
      removeOptimistic(proposalId);
      const msg = err instanceof Error ? err.message : "Erreur lors du vote.";
      alert(msg);
      return { success: false, message: msg };
    } finally {
      setVotingIds((prev) => {
        const next = new Set(prev);
        next.delete(proposalId);
        return next;
      });
    }
  }, [addOptimistic, removeOptimistic]);

  const handleTurnstileSuccess = useCallback(async (token: string) => {
    setTurnstileToken(token);
  }, []);

  const handleVerifyAndRetry = useCallback(async () => {
    if (!turnstileToken || !pendingProposalId) return;

    setIsVerifying(true);
    const proposalIdToRetry = pendingProposalId;

    try {
      const verifyResult = await verifyHumanToken(turnstileToken);
      if (!verifyResult.success) {
        alert(verifyResult.message || "La vérification a échoué. Veuillez réessayer.");
        return;
      }

      setIsModalOpen(false);
      setTurnstileToken(null);
      setPendingProposalId(null);

      addOptimistic(proposalIdToRetry);
      setVotingIds((prev) => new Set(prev).add(proposalIdToRetry));
      try {
        const voteResult = await submitVote(proposalIdToRetry);
        if (voteResult.success) {
          confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
          removeOptimistic(proposalIdToRetry);
        } else {
          removeOptimistic(proposalIdToRetry);
          if (voteResult.message) alert(voteResult.message);
        }
        if (pendingResolveRef.current) {
          pendingResolveRef.current(voteResult);
          pendingResolveRef.current = null;
        }
      } catch (err) {
        removeOptimistic(proposalIdToRetry);
        alert("Une erreur est survenue. Veuillez réessayer.");
        if (pendingResolveRef.current) {
          pendingResolveRef.current({
            success: false,
            message: "Une erreur est survenue. Veuillez réessayer.",
          });
          pendingResolveRef.current = null;
        }
      } finally {
        setVotingIds((prev) => {
          const next = new Set(prev);
          next.delete(proposalIdToRetry);
          return next;
        });
      }
    } catch (err) {
      alert("Une erreur est survenue. Veuillez réessayer.");
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
  }, [turnstileToken, pendingProposalId, addOptimistic, removeOptimistic]);

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
    <VoteContext.Provider value={{ vote: handleVote, optimisticVotes, votingIds, removeOptimistic }}>
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
                const isProduction = typeof window !== 'undefined' && !window.location.hostname.includes('localhost');
                console.log("VoteGatekeeper - Turnstile siteKey:", siteKey ? "présente" : "manquante", {
                  siteKey: siteKey ? `${siteKey.substring(0, 10)}...` : 'undefined',
                  hostname: typeof window !== 'undefined' ? window.location.hostname : 'server',
                  isProduction
                });
                
                if (!siteKey) {
                  return (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-red-800 text-sm font-semibold mb-2">
                        Erreur : La clé Turnstile n'est pas configurée
                      </p>
                      <p className="text-red-700 text-xs mb-2">
                        Variable manquante : <code className="bg-red-100 px-1 rounded">NEXT_PUBLIC_TURNSTILE_SITE_KEY</code>
                      </p>
                      {isProduction ? (
                        <p className="text-red-600 text-xs">
                          ⚠️ En production/staging : Vérifiez que la variable est configurée dans Vercel pour l'environnement <strong>Preview</strong> et redéployez sans cache.
                        </p>
                      ) : (
                        <p className="text-red-600 text-xs">
                          En local : Ajoutez la variable dans <code>.env.local</code> et redémarrez le serveur.
                        </p>
                      )}
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
