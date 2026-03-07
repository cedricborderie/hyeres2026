"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Building2, Bike, Sprout } from "lucide-react";
import { getCategoryColorClasses } from "@/lib/utils";
import { engagementPodiums, getPodiumByThemeId } from "@/lib/engagement-data";
import { getNotationByThemeId } from "@/lib/notation-data";
import PodiumCard from "@/components/PodiumCard";
import NotationTable from "@/components/NotationTable";

const themeIds = ["habitat", "mobilites", "agriculture"] as const;
const categoryIcons: Record<string, typeof Building2> = {
  habitat: Building2,
  mobilites: Bike,
  agriculture: Sprout,
};

export default function EngagementPage() {
  const [activeTab, setActiveTab] = useState<"habitat" | "mobilites" | "agriculture">("habitat");
  const podium = getPodiumByThemeId(activeTab);
  const colors = getCategoryColorClasses(activeTab);

  if (!podium) {
    return (
      <main className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-12">
          <p className="text-gray-600">Thématique introuvable.</p>
        </div>
      </main>
    );
  }

  const gridOrder: ("2nd" | "1st" | "3rd")[] = ["2nd", "1st", "3rd"];

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 md:py-12 max-w-full">
        <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-2 text-center">
          Évaluation des engagements des candidats
        </h1>
        <p className="text-base text-gray-600 text-center mb-10 max-w-2xl mx-auto">
          Découvrez le classement des listes candidates selon leur alignement avec nos recommandations par thématique.
        </p>

        {/* Onglets */}
        <div className="flex flex-wrap justify-center gap-1 mb-10 border-b border-gray-200">
          {themeIds.map((themeId) => {
            const isActive = activeTab === themeId;
            const themeColors = getCategoryColorClasses(themeId);
            const Icon = categoryIcons[themeId];
            const themeTitle =
              engagementPodiums.find((p) => p.id === themeId)?.title ?? themeId;
            return (
              <button
                key={themeId}
                onClick={() => setActiveTab(themeId)}
                className="relative flex items-center gap-2 px-6 py-4 text-lg font-medium transition-all duration-200 [&_svg]:shrink-0"
                style={{
                  color: isActive ? themeColors.text : "rgb(107, 114, 128)",
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
                <Icon className="w-5 h-5 text-current" aria-hidden />
                {themeTitle}
                {isActive && (
                  <motion.div
                    layoutId="engagementActiveTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5"
                    style={{ backgroundColor: themeColors.underline }}
                    initial={false}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Titre du podium */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-center mb-7"
        >
          <h2 className="text-xl font-normal text-gray-900 leading-snug">
            Podium de l&apos;engagement —{" "}
            <span style={{ color: colors.text }}>{podium.title}</span>
          </h2>
        </motion.div>

        {/* Grille podium : 2e gauche, 1er centre, 3e droite. items-end = bas des 3 blocs alignés ; hauteurs 424/384/344 = 40px d'écart entre les hauts. */}
        <motion.div
          key={`podium-${activeTab}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-3.5 items-end max-w-[880px] mx-auto mb-8 min-h-[500px] md:min-h-[520px]"
          style={{ contain: "layout" }}
        >
          {podium.candidates.map((candidate, index) => (
            <PodiumCard
              key={`${activeTab}-${candidate.rank}-${candidate.listName}`}
              candidate={candidate}
              accentColor={colors.text}
              gridOrder={gridOrder[index]}
            />
          ))}
        </motion.div>

        {/* Tableau de notation de la rubrique active uniquement */}
        <div className="mt-12 max-w-[880px] mx-auto">
          {(() => {
            const notation = getNotationByThemeId(activeTab);
            const themeColors = getCategoryColorClasses(activeTab);
            if (!notation) return null;
            return (
              <NotationTable
                key={activeTab}
                theme={notation}
                accentColor={themeColors.text}
              />
            );
          })()}
        </div>

        {/* Onglets en bas */}
        <div className="flex flex-wrap justify-center gap-1 mt-12 pt-8 border-t border-gray-200">
          {themeIds.map((themeId) => {
            const isActive = activeTab === themeId;
            const themeColors = getCategoryColorClasses(themeId);
            const Icon = categoryIcons[themeId];
            const themeTitle =
              engagementPodiums.find((p) => p.id === themeId)?.title ?? themeId;
            return (
              <button
                key={themeId}
                onClick={() => {
                  setActiveTab(themeId);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="relative flex items-center gap-2 px-6 py-4 text-lg font-medium transition-all duration-200 [&_svg]:shrink-0"
                style={{
                  color: isActive ? themeColors.text : "rgb(107, 114, 128)",
                }}
              >
                <Icon className="w-5 h-5 text-current" aria-hidden />
                {themeTitle}
                {isActive && (
                  <motion.div
                    layoutId="engagementActiveTabBottom"
                    className="absolute top-0 left-0 right-0 h-0.5"
                    style={{ backgroundColor: themeColors.underline }}
                    initial={false}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </main>
  );
}
