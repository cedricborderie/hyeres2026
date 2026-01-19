"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BarChart3, Users, Vote, TrendingUp } from "lucide-react";
import { getAllProposals, categories, getCategoryById } from "@/lib/data";
import { getAllVoteResults, ProposalVoteCount } from "@/app/actions/results";

export default function ResultatsPage() {
  const [results, setResults] = useState<{
    totalVoters: number;
    totalVotes: number;
    proposalVotes: ProposalVoteCount[];
  }>({
    totalVoters: 0,
    totalVotes: 0,
    proposalVotes: [],
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("habitat");

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      try {
        const data = await getAllVoteResults();
        setResults(data);
      } catch (error) {
        console.error("Error fetching results:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  const allProposals = getAllProposals();
  const activeCategory = getCategoryById(activeTab);
  const categoryProposals = allProposals.filter(
    (p) => p.categoryId === activeTab
  );

  // Create a map of proposal votes for quick lookup
  const voteMap = new Map(
    results.proposalVotes.map((pv) => [pv.proposalId, pv.voteCount])
  );

  // Get proposals with their vote counts, sorted by vote count descending
  const proposalsWithVotes = categoryProposals
    .map((proposal) => ({
      ...proposal,
      voteCount: voteMap.get(proposal.id) || 0,
    }))
    .sort((a, b) => b.voteCount - a.voteCount);

  const maxVotes = proposalsWithVotes.length > 0 
    ? Math.max(...proposalsWithVotes.map((p) => p.voteCount))
    : 0;

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-primary-50">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8 text-center">
          Résultats
        </h1>

        {/* Statistics Cards */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Chargement des résultats...</p>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-3 gap-6 mb-12 max-w-5xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-lg border-2 border-primary-200 p-6 shadow-md text-center"
              >
                <Users className="w-10 h-10 text-primary-600 mx-auto mb-3" />
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {results.totalVoters}
                </div>
                <p className="text-gray-600">
                  {results.totalVoters === 1 ? "votant" : "votants"}
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-lg border-2 border-primary-200 p-6 shadow-md text-center"
              >
                <Vote className="w-10 h-10 text-primary-600 mx-auto mb-3" />
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {results.totalVotes}
                </div>
                <p className="text-gray-600">
                  {results.totalVotes === 1 ? "vote" : "votes"} au total
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-lg border-2 border-primary-200 p-6 shadow-md text-center"
              >
                <TrendingUp className="w-10 h-10 text-primary-600 mx-auto mb-3" />
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {allProposals.length}
                </div>
                <p className="text-gray-600">propositions</p>
              </motion.div>
            </div>

            {/* Tabs */}
            <div className="flex flex-wrap justify-center gap-1 mb-12 border-b border-gray-200">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveTab(category.id)}
                  className={`relative px-6 py-4 font-medium transition-all duration-200 ${
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

            {/* Results by Category */}
            {activeTab === "agriculture" ? (
              <div className="max-w-2xl mx-auto">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-lg border-2 border-ocre-300 p-8 text-center shadow-md"
                >
                  <div className="text-6xl mb-4">🌾</div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Bientôt disponible
                  </h2>
                  <p className="text-gray-600">
                    Les résultats pour l'agriculture seront disponibles lorsque
                    les propositions seront publiées.
                  </p>
                </motion.div>
              </div>
            ) : (
              <div className="max-w-4xl mx-auto space-y-4">
                {proposalsWithVotes.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-lg border-2 border-gray-200 p-8 text-center shadow-md"
                  >
                    <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-lg text-gray-600">
                      Aucun vote pour cette catégorie pour le moment.
                    </p>
                  </motion.div>
                ) : (
                  proposalsWithVotes.map((proposal, index) => {
                    const percentage =
                      maxVotes > 0 ? (proposal.voteCount / maxVotes) * 100 : 0;

                    return (
                      <motion.div
                        key={proposal.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="bg-white rounded-lg border-2 border-gray-200 p-6 shadow-md"
                      >
                        <div className="flex items-start justify-between gap-4 mb-4">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                              {proposal.title}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {proposal.summary}
                            </p>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <div className="text-2xl font-bold text-primary-600">
                              {proposal.voteCount}
                            </div>
                            <p className="text-xs text-gray-500">
                              {proposal.voteCount === 1 ? "vote" : "votes"}
                            </p>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${percentage}%` }}
                            transition={{ duration: 0.8, delay: index * 0.05 }}
                            className="h-full bg-gradient-to-r from-primary-500 to-primary-600 rounded-full"
                          />
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
