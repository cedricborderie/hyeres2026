"use client";

import { useState, useEffect, useTransition } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { CheckCircle2, ExternalLink } from "lucide-react";
import { Proposal } from "@/lib/data";
import { submitVote, hasVotedForProposal } from "@/app/actions/vote";

type ProposalCardProps = {
  proposal: Proposal;
  onVote?: (proposalId: string) => void;
};

export default function ProposalCard({ proposal, onVote }: ProposalCardProps) {
  const [voted, setVoted] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Check vote status on component mount
  useEffect(() => {
    hasVotedForProposal(proposal.id).then((hasVoted) => {
      setVoted(hasVoted);
    });
  }, [proposal.id]);

  const handleVote = () => {
    // Don't allow voting if already voted or pending
    if (voted || isPending) {
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
            <button
              onClick={() => setShowDialog(true)}
              className="flex-1 px-4 py-2 text-sm font-medium text-primary-600 border border-primary-300 rounded-md hover:bg-primary-50 transition-colors"
            >
              En savoir plus
            </button>

            <button
              onClick={handleVote}
              disabled={isPending}
              className={`flex-1 px-4 py-2 text-sm font-semibold rounded-md transition-colors flex items-center justify-center gap-2 ${
                voted
                  ? "bg-green-500 text-white hover:bg-green-600"
                  : "bg-primary-600 text-white hover:bg-primary-700"
              } ${isPending ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {isPending ? (
                "En cours..."
              ) : voted ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  Soutenu
                </>
              ) : (
                "Je soutiens"
              )}
            </button>
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
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setShowDialog(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-xl"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
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
              {!voted && (
                <button
                  onClick={() => {
                    handleVote();
                    setShowDialog(false);
                  }}
                  disabled={isPending}
                  className={`flex-1 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors ${
                    isPending ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {isPending ? "En cours..." : "Je soutiens"}
                </button>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
}
