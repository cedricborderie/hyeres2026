"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { categories, getProposalsByCategory, getCategoryById } from "@/lib/data";
import ProposalCard from "@/components/ProposalCard";
import { Mail, ExternalLink } from "lucide-react";

export default function PropositionsPage() {
  const [activeTab, setActiveTab] = useState("habitat");
  const [proposals, setProposals] = useState(getProposalsByCategory("habitat"));

  useEffect(() => {
    setProposals(getProposalsByCategory(activeTab));
  }, [activeTab]);

  const handleVote = (proposalId: string) => {
    // Update local state if needed
    // In production, this will trigger a Supabase update
  };

  const activeCategory = getCategoryById(activeTab);

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8 text-center">
          Propositions
        </h1>

        {/* Tabs - En haut */}
        <div className="flex flex-wrap justify-center gap-1 mb-12 border-b border-gray-200">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveTab(category.id)}
              className={`relative px-6 py-4 text-lg font-medium transition-all duration-200 ${
                activeTab === category.id
                  ? "text-primary-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {category.title}
              {activeTab === category.id && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600"
                  initial={false}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Information Blocks for Categories */}
        {activeCategory && (
          <>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="max-w-6xl mx-auto mb-8"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
                1 - Consultez
              </h2>
              <div className="grid md:grid-cols-2 gap-6 items-center">
                <p className="text-base md:text-lg text-gray-700">
                  Consultez les recommandations détaillées des associations Hyéroises sur {activeCategory.title.toLowerCase()}.
                </p>
                {activeCategory.manifestoUrl && (
                  <div className="flex justify-start md:justify-end">
                    <a
                      href={activeCategory.manifestoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors shadow-md hover:shadow-lg"
                    >
                      Télécharger les recommandations
                      <ExternalLink className="w-5 h-5" />
                    </a>
                  </div>
                )}
              </div>
            </motion.div>
            <div className="max-w-6xl mx-auto mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
                2 - Votez
              </h2>
            </div>
          </>
        )}

        {/* Proposals Grid */}
        <div className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {proposals.map((proposal) => (
            <ProposalCard
              key={proposal.id}
              proposal={proposal}
              onVote={handleVote}
            />
          ))}
        </div>

        {/* Tabs - En bas */}
        <div className="flex flex-wrap justify-center gap-1 mt-12 pt-8 border-t border-gray-200">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => {
                setActiveTab(category.id);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`relative px-6 py-4 text-lg font-medium transition-all duration-200 ${
                activeTab === category.id
                  ? "text-primary-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {category.title}
              {activeTab === category.id && (
                <motion.div
                  layoutId="activeTabBottom"
                  className="absolute top-0 left-0 right-0 h-0.5 bg-primary-600"
                  initial={false}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>
      </div>
    </main>
  );
}
