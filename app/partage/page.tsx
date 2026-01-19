"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { getAllProposals } from "@/lib/data";
import ProposalCard from "@/components/ProposalCard";

function PartageContent() {
  const searchParams = useSearchParams();
  const idsParam = searchParams.get("ids");
  
  // Parse IDs from query string
  const proposalIds = idsParam 
    ? idsParam.split(",").filter(id => id.trim() !== "")
    : [];
  
  // Get all proposals and filter by IDs
  const allProposals = getAllProposals();
  const sharedProposals = proposalIds.length > 0
    ? allProposals.filter(p => proposalIds.includes(p.id))
    : [];

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-primary-50">
      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Voici mes priorités pour l'avenir d'Hyères
          </h1>
          {sharedProposals.length > 0 && (
            <p className="text-lg text-gray-600 mb-4">
              Découvrez les propositions de la plate-forme citoyenne que je soutiens et faites entendre votre voix à votre tour !
            </p>
          )}
        </motion.div>

        {/* Proposals List */}
        {sharedProposals.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto mb-12">
            {sharedProposals.map((proposal, index) => (
              <motion.div
                key={proposal.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <ProposalCard proposal={proposal} readOnly={true} />
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg border-2 border-primary-200 p-8 text-center shadow-md max-w-2xl mx-auto"
          >
            <p className="text-gray-600 mb-6">
              Aucune proposition à afficher. Le lien de partage semble invalide.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
            >
              Retour à l'accueil
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        )}

        {/* CTA Footer - Sticky Bottom Bar */}
        {sharedProposals.length > 0 && (
          <div className="sticky bottom-0 bg-white border-t border-gray-200 shadow-lg z-40 mt-12">
            <div className="container mx-auto px-4 py-6">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4 max-w-4xl mx-auto">
                <p className="text-gray-700 font-medium text-center md:text-left">
                  Vous aussi, faites entendre votre voix pour l'avenir d'Hyères !
                </p>
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 bg-primary-600 text-white px-8 py-4 rounded-lg text-base font-semibold hover:bg-primary-700 transition-colors shadow-lg hover:shadow-xl whitespace-nowrap"
                >
                  À mon tour de voter !
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

export default function PartagePage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-gradient-to-b from-white to-primary-50">
        <div className="container mx-auto px-4 py-8 md:py-12">
          <div className="text-center">
            <p className="text-gray-600">Chargement...</p>
          </div>
        </div>
      </main>
    }>
      <PartageContent />
    </Suspense>
  );
}
