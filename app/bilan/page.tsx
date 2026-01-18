"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Share2, Facebook, MessageCircle } from "lucide-react";
import { getAllProposals } from "@/lib/data";
import { getVotedProposals } from "@/lib/utils";
import Link from "next/link";

export default function BilanPage() {
  const [votedProposalIds, setVotedProposalIds] = useState<Set<string>>(
    new Set()
  );

  useEffect(() => {
    setVotedProposalIds(getVotedProposals());
  }, []);

  const allProposals = getAllProposals();
  const votedProposals = allProposals.filter((p) =>
    votedProposalIds.has(p.id)
  );

  const shareMessage = `J'ai voté pour ${votedProposals.length} proposition${
    votedProposals.length > 1 ? "s" : ""
  } sur la plateforme Plateforme Citoyenne Hyèroise ! 🗳️\n\nRejoignez-moi pour faire entendre votre voix : https://plateforme-citoyenne-hyeroise.fr`;

  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(
    shareMessage
  )}`;

  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
    "https://plateforme-citoyenne-hyeroise.fr"
  )}`;

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-green-50">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8 text-center">
            Votre Bilan
          </h1>

          {votedProposals.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg border-2 border-gray-200 p-8 text-center shadow-md"
            >
              <p className="text-lg text-gray-600 mb-6">
                Vous n'avez pas encore voté pour des propositions.
              </p>
              <Link
                href="/propositions"
                className="inline-block bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
              >
                Découvrir les propositions
              </Link>
            </motion.div>
          ) : (
            <>
              {/* Summary */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-green-100 border-2 border-green-300 rounded-lg p-6 mb-8 text-center"
              >
                <div className="text-4xl font-bold text-green-700 mb-2">
                  {votedProposals.length}
                </div>
                <p className="text-green-800">
                  {votedProposals.length === 1
                    ? "proposition soutenue"
                    : "propositions soutenues"}
                </p>
              </motion.div>

              {/* Voted Proposals List */}
              <div className="space-y-4 mb-8">
                {votedProposals.map((proposal, index) => (
                  <motion.div
                    key={proposal.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-lg border-2 border-green-200 p-6 shadow-md"
                  >
                    <div className="flex items-start gap-4">
                      <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {proposal.title}
                        </h3>
                        <p className="text-gray-600 text-sm">
                          {proposal.summary}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Share Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-lg border-2 border-primary-200 p-8 text-center shadow-md"
              >
                <Share2 className="w-12 h-12 text-primary-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Partagez votre engagement
                </h2>
                <p className="text-gray-600 mb-6">
                  Aidez à faire connaître la plateforme autour de vous pour
                  amplifier l'impact citoyen.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 bg-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors"
                  >
                    <MessageCircle className="w-5 h-5" />
                    Partager sur WhatsApp
                  </a>

                  <a
                    href={facebookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                  >
                    <Facebook className="w-5 h-5" />
                    Partager sur Facebook
                  </a>
                </div>
              </motion.div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
