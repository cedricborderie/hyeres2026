"use client";

import { useState, useEffect, useTransition } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { CheckCircle2, ExternalLink } from "lucide-react";
import { Proposal } from "@/lib/data";
import { submitVote, hasVotedForProposal, removeVote } from "@/app/actions/vote";

type ProposalCardProps = {
  proposal: Proposal;
  onVote?: (proposalId: string) => void;
  readOnly?: boolean;
};

export default function ProposalCard({ proposal, onVote, readOnly = false }: ProposalCardProps) {
  const [voted, setVoted] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Check vote status on component mount
  useEffect(() => {
    hasVotedForProposal(proposal.id).then((hasVoted) => {
      setVoted(hasVoted);
    });
  }, [proposal.id]);

  // Handle Escape key to close dialog
  useEffect(() => {
    if (!showDialog) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowDialog(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    // Prevent body scroll when dialog is open
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [showDialog]);

  const handleVote = () => {
    // Don't allow if pending
    if (isPending) {
      return;
    }

    // If already voted, remove the vote
    if (voted) {
      const previousVoted = voted;
      // Optimistic UI: immediately set to false
      setVoted(false);

      // Remove vote from server asynchronously
      startTransition(async () => {
        const result = await removeVote(proposal.id);

        if (!result.success) {
          // Revert optimistic UI if error
          console.error("Failed to remove vote:", result.message);
          setVoted(previousVoted);

          // Show error message
          if (result.message) {
            alert(result.message);
          }
        } else {
          // Vote was successfully removed - force UI to show as not voted
          setVoted(false);
          
          // Wait a bit for database to update, then verify
          await new Promise(resolve => setTimeout(resolve, 300));
          
          // Double-check: re-verify vote status from server (for debugging)
          const hasVoted = await hasVotedForProposal(proposal.id);
          
          if (hasVoted) {
            // This shouldn't happen - log warning
            console.warn("Vote removal reported success but hasVotedForProposal returned true:", {
              proposalId: proposal.id,
            });
            // Force to false anyway since removal was successful
            setVoted(false);
          } else {
            // Confirmed: vote is removed, ensure UI is false
            setVoted(false);
          }

          // Callback to parent
          if (onVote) {
            onVote(proposal.id);
          }
        }
      });
      return;
    }

    // Optimistic UI: immediately update UI (+1)
    const previousVoted = voted;
    setVoted(true);

    // Trigger confetti immediately for better UX
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });

    // Callback to parent (immediate)
    if (onVote) {
      onVote(proposal.id);
    }

    // Submit vote to server asynchronously
    startTransition(async () => {
      const result = await submitVote(proposal.id);

      if (!result.success) {
        // Revert optimistic UI if error (-1)
        setVoted(previousVoted);

        // Show error message
        if (result.message) {
          alert(result.message);
        }
      } else {
        // Re-verify vote status from server to ensure UI is in sync
        const hasVoted = await hasVotedForProposal(proposal.id);
        setVoted(hasVoted);
      }
    });
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`rounded-lg border-2 p-6 bg-white shadow-md hover:shadow-lg transition-shadow ${
          voted ? "border-green-500 bg-green-50" : "border-gray-200"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {proposal.title}
            </h3>
            <p className="text-gray-600 mb-4 line-clamp-3">
              {proposal.summary}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 mt-4">
            {!readOnly && (
              <button
                onClick={() => setShowDialog(true)}
                className="flex-1 px-4 py-2 text-sm font-medium text-primary-600 border border-primary-600 rounded-md hover:bg-primary-50 transition-colors"
              >
                En savoir plus
              </button>
            )}

            {readOnly ? (
              <div className="flex-1 px-4 py-2 text-sm font-semibold rounded-md bg-green-500 text-white flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                Proposition soutenue
              </div>
            ) : (
              <button
                onClick={handleVote}
                disabled={isPending}
                className={`flex-1 px-4 py-2 text-sm font-semibold rounded-md transition-colors flex items-center justify-center gap-2 ${
                  voted
                    ? "bg-green-500 text-white hover:bg-green-600"
                    : "bg-primary-600 text-white hover:bg-primary-700"
                } ${isPending ? "opacity-50 cursor-not-allowed" : ""}`}
                title={voted ? "Cliquer pour retirer votre vote" : "Cliquer pour soutenir cette proposition"}
              >
                {isPending ? (
                  "En cours..."
                ) : voted ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    Soutenue
                  </>
                ) : (
                  "Je soutiens"
                )}
              </button>
            )}
          </div>

          {proposal.external_link && (
            <a
              href={proposal.external_link}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 text-xs text-gray-500 hover:text-primary-600 flex items-center gap-1"
            >
              <ExternalLink className="w-3 h-3" />
              Lien externe
            </a>
          )}
        </div>
      </motion.div>

      {/* Dialog for "Read More" */}
      {showDialog && (
        <div
          className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center p-4"
          onClick={() => setShowDialog(false)}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              setShowDialog(false);
            }
          }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="dialog-title"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-xl"
          >
            <h2 id="dialog-title" className="text-2xl font-bold text-gray-900 mb-4">
              {proposal.title}
            </h2>
            <div className="text-gray-700 whitespace-pre-line mb-6">
              {proposal.details}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowDialog(false)}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
              >
                Fermer
              </button>
              <button
                onClick={() => {
                  setShowDialog(false);
                  // Small delay to ensure dialog closes before vote
                  setTimeout(() => {
                    handleVote();
                  }, 100);
                }}
                disabled={isPending}
                className={`flex-1 px-4 py-2 rounded-md transition-colors ${
                  voted
                    ? "bg-green-500 text-white hover:bg-green-600"
                    : "bg-primary-600 text-white hover:bg-primary-700"
                } ${isPending ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {isPending ? "En cours..." : voted ? "Retirer mon soutien" : "Je soutiens"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
}
