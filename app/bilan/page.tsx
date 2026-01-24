"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Megaphone, Facebook, MessageCircle, Linkedin } from "lucide-react";
import { getAllProposals } from "@/lib/data";
import { getVotedProposalIds } from "@/app/actions/vote";
import Link from "next/link";

export default function BilanPage() {
  const [votedProposalIds, setVotedProposalIds] = useState<Set<string>>(
    new Set()
  );
  const [loading, setLoading] = useState(true);
  const [shareUrl, setShareUrl] = useState("");

  useEffect(() => {
    const fetchVotedProposals = async () => {
      setLoading(true);
      try {
        const votedIds = await getVotedProposalIds();
        setVotedProposalIds(new Set(votedIds));
      } catch (error) {
        console.error("Error fetching voted proposals:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVotedProposals();
  }, []);

  useEffect(() => {
    // Build the smart share URL with voted proposal IDs
    if (typeof window !== "undefined" && votedProposalIds.size > 0) {
      const origin = window.location.origin;
      const ids = Array.from(votedProposalIds).join(",");
      setShareUrl(`${origin}/partage?ids=${ids}`);
    }
  }, [votedProposalIds]);

  const allProposals = getAllProposals();
  const votedProposals = allProposals.filter((p) =>
    votedProposalIds.has(p.id)
  );

  // Message de partage (WhatsApp, etc.) – sans rappel des priorités dans le texte
  const shareMessage = `Je viens de sélectionner mes priorités pour Hyères.\n\nDécouvre la liste complète ici : ${shareUrl || "https://hyeres2026.org"}`;

  const whatsappUrl = shareUrl
    ? `https://wa.me/?text=${encodeURIComponent(shareMessage)}`
    : "";

  const facebookUrl = shareUrl
    ? `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`
    : "";

  const linkedinUrl = shareUrl
    ? `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`
    : "";

  const trackShare = (reseau: "WhatsApp" | "Facebook" | "LinkedIn") => {
    if (typeof window !== "undefined" && "plausible" in window) {
      (window as { plausible?: (e: string, o?: { props?: Record<string, string | number> }) => void }).plausible?.(
        "Partage Mes Priorités",
        { props: { réseau: reseau, nb_propositions: votedProposals.length } }
      );
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-green-50">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8 text-center">
            Mes Priorités
          </h1>

          {loading ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg border-2 border-gray-200 p-8 text-center shadow-md"
            >
              <p className="text-lg text-gray-600">
                Chargement de vos votes...
              </p>
            </motion.div>
          ) : votedProposals.length === 0 ? (
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
                className="bg-white rounded-lg border-2 border-primary-500 p-8 text-center shadow-md"
              >
                <Megaphone className="w-12 h-12 text-primary-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Faites entendre votre voix !
                </h2>
                <p className="text-gray-600 mb-6">
                  Partagez <span className="font-bold underline">vos priorités</span> autour de vous pour amplifier l'impact citoyen.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  {whatsappUrl && (
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => trackShare("WhatsApp")}
                      className="inline-flex items-center justify-center gap-2 bg-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors"
                    >
                      <MessageCircle className="w-5 h-5" />
                      Partager sur WhatsApp
                    </a>
                  )}

                  {facebookUrl && (
                    <a
                      href={facebookUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => trackShare("Facebook")}
                      className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                    >
                      <Facebook className="w-5 h-5" />
                      Partager sur Facebook
                    </a>
                  )}

                  {linkedinUrl && (
                    <a
                      href={linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => trackShare("LinkedIn")}
                      className="inline-flex items-center justify-center gap-2 bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-800 transition-colors"
                    >
                      <Linkedin className="w-5 h-5" />
                      Partager sur LinkedIn
                    </a>
                  )}
                </div>
              </motion.div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
