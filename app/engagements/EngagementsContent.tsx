"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { Building2, Bike, Sprout, Megaphone, Facebook, MessageCircle, Linkedin, FileText, ArrowRight } from "lucide-react";
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

type ThemeId = (typeof themeIds)[number];

export default function EngagementsContent({
  initialTheme = "habitat",
}: {
  initialTheme?: ThemeId;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState<ThemeId>(initialTheme);
  const [mounted, setMounted] = useState(false);

  // Synchroniser l'onglet actif avec l'URL (ex. /engagements/agriculture)
  useEffect(() => {
    setMounted(true);
  }, []);
  useEffect(() => {
    const segment = pathname?.split("/").pop();
    if (segment && themeIds.includes(segment as ThemeId)) {
      setActiveTab(segment as ThemeId);
    }
  }, [pathname]);

  const podium = getPodiumByThemeId(activeTab);
  const colors = getCategoryColorClasses(activeTab);

  const shareUrl = mounted && typeof window !== "undefined" ? window.location.origin + pathname : "";
  const shareMessage = shareUrl
    ? `Découvre l'évaluation des candidats sur le podium ${podium?.title ?? "Engagements"} : ${shareUrl}`
    : "";
  const whatsappUrl = shareUrl ? `https://wa.me/?text=${encodeURIComponent(shareMessage)}` : "";
  const facebookUrl = shareUrl ? `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}` : "";
  const linkedinUrl = shareUrl ? `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}` : "";

  const handleTabChange = (themeId: ThemeId) => {
    setActiveTab(themeId);
    router.push(`/engagements/${themeId}`, { scroll: false });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!podium) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-12">
          <p className="text-gray-600">Thématique introuvable.</p>
        </div>
      </div>
    );
  }

  const gridOrder: ("2nd" | "1st" | "3rd")[] = ["2nd", "1st", "3rd"];

  return (
    <div className="min-h-screen bg-gray-50">
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
                onClick={() => handleTabChange(themeId)}
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

        {/* Grille podium */}
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

        {/* Tableau de notation */}
        <div className="max-w-[880px] mx-auto">
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

        {/* Consultez notre méthodologie */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="max-w-[880px] mx-auto mt-10"
        >
          <div className="bg-white rounded-lg border-2 border-gray-200 p-6 text-center shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Consultez notre méthodologie
            </h2>
            <p className="text-gray-600 text-sm mb-4 max-w-xl mx-auto">
              Découvrez comment nous avons évalué les engagements des candidats et la grille de lecture utilisée.
            </p>
            <Link
              href="/methodologie"
              className="inline-flex items-center justify-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-lg text-base font-semibold hover:bg-primary-700 transition-colors"
            >
              <FileText className="w-5 h-5" aria-hidden />
              Consulter la méthodologie
            </Link>
          </div>
        </motion.div>

        {/* Bloc de partage */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-[880px] mx-auto mt-12"
        >
          <div className="bg-white rounded-lg border-2 border-primary-500 p-8 text-center shadow-md">
            <Megaphone className="w-12 h-12 text-primary-600 mx-auto mb-4" aria-hidden />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Partagez le podium {podium.title}
            </h2>
            <p className="text-gray-600 mb-6">
              Partagez l&apos;évaluation des candidats pour amplifier l&apos;impact citoyen.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {whatsappUrl && (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-[#25D366] text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
                >
                  <MessageCircle className="w-5 h-5" aria-hidden />
                  Partager sur WhatsApp
                </a>
              )}
              {facebookUrl && (
                <a
                  href={facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  <Facebook className="w-5 h-5" aria-hidden />
                  Partager sur Facebook
                </a>
              )}
              {linkedinUrl && (
                <a
                  href={linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-[#0A66C2] text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
                >
                  <Linkedin className="w-5 h-5" aria-hidden />
                  Partager sur LinkedIn
                </a>
              )}
            </div>
          </div>
        </motion.div>

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
                onClick={() => handleTabChange(themeId)}
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

        {/* Dossier de presse — même design que "Votre Opinion Compte" sur la home */}
        <section className="bg-[#FFE175] rounded-[28px] p-8 md:p-12 text-center max-w-4xl mx-auto mt-12">
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-6">
            Consultez l&apos;intégralité de l&apos;étude dans le dossier de presse
          </h2>
          <p className="text-lg text-gray-700 leading-[20px] mb-8">
            Téléchargez le dossier de presse pour découvrir la présentation complète des résultats de l&apos;évaluation des engagements des candidats.
          </p>
          <a
            href="/dossier-presse-resultats-plateforme-citoyenne.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-primary-600 text-white px-8 py-4 rounded-lg text-base font-semibold hover:bg-primary-700 transition-colors shadow-lg hover:shadow-xl"
          >
            Télécharger le dossier de presse
            <ArrowRight className="w-5 h-5" aria-hidden />
          </a>
        </section>
      </div>
    </div>
  );
}
