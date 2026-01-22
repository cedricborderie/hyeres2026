"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { categories, getProposalsByCategory, getCategoryById } from "@/lib/data";
import ProposalCard from "@/components/ProposalCard";
import { ExternalLink, ArrowRight } from "lucide-react";
import { getCategoryColorClasses } from "@/lib/utils";

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
          {categories.map((category) => {
            const categoryColors = getCategoryColorClasses(category.id);
            const isActive = activeTab === category.id;
            return (
              <button
                key={category.id}
                onClick={() => setActiveTab(category.id)}
                className="relative px-6 py-4 text-lg font-medium transition-all duration-200"
                style={{
                  color: isActive ? categoryColors.text : "rgb(107, 114, 128)",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.color = "rgb(55, 65, 81)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.color = "rgb(107, 114, 128)";
                  }
                }}
              >
                {category.title}
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5"
                    style={{ backgroundColor: categoryColors.underline }}
                    initial={false}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
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
          {categories.map((category) => {
            const categoryColors = getCategoryColorClasses(category.id);
            const isActive = activeTab === category.id;
            return (
              <button
                key={category.id}
                onClick={() => {
                  setActiveTab(category.id);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="relative px-6 py-4 text-lg font-medium transition-all duration-200"
                style={{
                  color: isActive ? categoryColors.text : "rgb(107, 114, 128)",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.color = "rgb(55, 65, 81)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.color = "rgb(107, 114, 128)";
                  }
                }}
              >
                {category.title}
                {isActive && (
                  <motion.div
                    layoutId="activeTabBottom"
                    className="absolute top-0 left-0 right-0 h-0.5"
                    style={{ backgroundColor: categoryColors.underline }}
                    initial={false}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Blocs de relance : après les onglets. Rose (Habitat→Mobilités), jaune (Mobilités→Agriculture), vert (Agriculture→Habitat). */}
        {activeTab === "habitat" && (
          <section className="max-w-6xl mx-auto mt-12">
            <div
              className="rounded-[28px] p-8 md:p-12 text-center"
              style={{ backgroundColor: "#FDF2F8" }}
            >
              <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-6">
                Consultez les propositions Mobilité & Vélo
              </h2>
              <button
                type="button"
                onClick={() => {
                  setActiveTab("mobilites");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="inline-flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors shadow-md hover:shadow-lg"
              >
                Consultez les propositions Mobilité & Vélo
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </section>
        )}
        {activeTab === "mobilites" && (
          <section className="max-w-6xl mx-auto mt-12">
            <div
              className="rounded-[28px] p-8 md:p-12 text-center"
              style={{ backgroundColor: "#FEFCE8" }}
            >
              <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-6">
                Consultez les propositions Agriculture & Alimentation
              </h2>
              <button
                type="button"
                onClick={() => {
                  setActiveTab("agriculture");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="inline-flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors shadow-md hover:shadow-lg"
              >
                Consultez les propositions Agriculture & Alimentation
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </section>
        )}
        {activeTab === "agriculture" && (
          <section className="max-w-6xl mx-auto mt-12">
            <div
              className="rounded-[28px] p-8 md:p-12 text-center"
              style={{ backgroundColor: "#F0FDF4" }}
            >
              <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-6">
                Consultez les propositions Habitat & urbanisme
              </h2>
              <button
                type="button"
                onClick={() => {
                  setActiveTab("habitat");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="inline-flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors shadow-md hover:shadow-lg"
              >
                Consultez les propositions Habitat & urbanisme
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
