"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Building2, Bike, Sprout } from "lucide-react";
import { motion } from "framer-motion";
import LiveStats from "@/components/LiveStats";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero + Bande jaune : jaune remonte 30px, pied du drapeau dans le jaune ; hero fond transparent sur 30px */}
      <div className="flex flex-col bg-white relative">
        {/* Hero : fond blanc sauf 90px du bas (transparent). pb plus grand sur mobile/iPad pour que le texte ne chevauche pas le jaune */}
        <div
          className="container mx-auto px-4 pt-12 md:pt-[46px] pb-[120px] md:pb-[120px] lg:pb-8 w-full relative z-20 max-w-7xl"
          style={{
            background: "linear-gradient(to bottom, #fff 0, #fff calc(100% - 90px), transparent calc(100% - 90px))",
          }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-start mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="text-left order-2 lg:order-1 -mt-[30px] pt-[2px] lg:pt-[70px]"
            >
              <h1 className="text-xl font-semibold text-gray-900 mb-4 leading-7">
                Reprenons la parole pour les municipales !
              </h1>
              <p className="text-base font-medium text-gray-700 leading-[20px]">
                Nos associations s'unissent pour proposer une plateforme citoyenne non partisane.
                <br />
                <br />
                Faites entendre votre voix auprès des futurs élus. Découvrez et votez pour nos recommandations concrètes autour de trois axes : <span className="font-bold" style={{ color: "#14B8A6" }}>urbanisme durable</span>, <span className="font-bold" style={{ color: "#EC4899" }}>mobilités douces</span> et <span className="font-bold" style={{ color: "#EAB308" }}>agriculture locale</span>.
                <br />
                <br />
                Engageons ensemble les futurs élus pour un territoire harmonieux.
              </p>
            </motion.div>

            {/* Drapeau : -mb-[30px] = pied 30px dans le jaune ; le jaune remonte avec -mt-[30px] */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="hidden lg:flex justify-start order-1 lg:order-2 items-end self-stretch -mb-[30px] pt-[30px]"
            >
              <div className="relative w-full max-w-[200px] md:max-w-sm">
                <Image
                  src="/drapeau.svg"
                  alt="Drapeau Plateforme Citoyenne Hyèroise"
                  width={400}
                  height={300}
                  className="w-full h-auto"
                  priority
                />
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bande jaune : -mt-[90px] pour remonter (30 + 60 px) */}
        <div
          id="cta-stats"
          className="w-full bg-[#FFE175] pt-8 md:pt-10 lg:pt-12 pb-8 md:pb-10 -mt-[90px] relative z-10 scroll-mt-24"
        >
          <div className="container mx-auto px-4 max-w-7xl">
            <h2 className="text-xl md:text-2xl font-semibold text-primary-600 mb-4">
              Votre opinion compte
            </h2>
            <div className="flex flex-row flex-wrap items-center gap-4">
              <LiveStats />
              <Link
                href="/propositions"
                className="h-14 inline-flex items-center justify-center gap-2 bg-primary-600 text-white px-8 rounded-lg text-base font-semibold hover:bg-primary-700 transition-colors shadow-md hover:shadow-lg shrink-0"
              >
                Commencer à voter
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Section */}
      <div className="container mx-auto px-4 py-12 md:py-[46px]">
        <div className="max-w-7xl mx-auto space-y-12">
          {/* Section 1: Une plateforme citoyenne pour un Hyères désirable */}
          <section className="max-w-4xl">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 text-left">
              Une plateforme citoyenne pour un Hyères désirable
            </h2>
            <p className="text-base font-medium text-gray-700 leading-[20px] mt-6 mb-6 text-left">
              Parce que l'avenir de notre territoire se joue dès aujourd'hui.
            </p>
            <p className="text-base font-medium text-gray-700 leading-[20px] mb-6 text-left">
              Nous, associations citoyennes implantées à Hyères depuis de nombreuses années, fortes de nos adhérents et de l'engagement que suscitent nos actions, avons décidé de nous unir pour proposer une vision d'avenir à notre commune.
            </p>
            <p className="text-base text-gray-700 leading-[20px] font-medium text-left">
              À l'approche des prochaines élections municipales, nous avons choisi de mettre nos expertises au service du débat public à travers une plateforme de recommandations concrètes.
            </p>
          </section>

          {/* Section 2 & 3: Two Columns on Desktop */}
          <div className="grid md:grid-cols-2 gap-8 md:gap-12">
            {/* Left Column: Notre Démarche */}
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Notre Démarche
              </h2>
              <p className="text-base font-medium text-gray-700 leading-[20px] mb-6">
                Les élections municipales sont un moment clé où se choisit la direction qui impactera notre quotidien pour les années à venir. Notre initiative, non partisane, vise à ce que les citoyens se réapproprient ce débat. Nous souhaitons :
              </p>
              <ul className="space-y-4 text-base text-gray-700">
                <li className="flex items-start leading-[20px]">
                  <span className="text-primary-600 mr-3 font-bold">•</span>
                  <span className="font-medium"><span className="underline">Proposer des solutions concrètes</span> autour de trois piliers majeurs : un urbanisme concerté, respectueux du patrimoine naturel et bâti, des mobilités douces et une agriculture locale nourricière pour tous.</span>
                </li>
                <li className="flex items-start leading-[20px]">
                  <span className="text-primary-600 mr-3 font-bold">•</span>
                  <span className="font-medium"><span className="underline">Engager les candidats</span> en leur présentant ces programmes et en obtenant des engagements précis sur leur mise en œuvre.</span>
                </li>
                <li className="flex items-start leading-[20px]">
                  <span className="text-primary-600 mr-3 font-bold">•</span>
                  <span className="font-medium"><span className="underline">Éclairer le vote de chacun</span> en analysant les programmes des candidats à la lumière de leurs engagements envers ces mesures.</span>
                </li>
                <li className="flex items-start leading-[20px]">
                  <span className="text-primary-600 mr-3 font-bold">•</span>
                  <span><span className="underline">Responsabiliser les futurs élus</span> en veillant le respect de leurs promesses tout au long du mandat.</span>
                </li>
              </ul>
            </section>

            {/* Right Column: Nos 3 Champs d'Expertise */}
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Nos 3 Champs d'Expertise
              </h2>
              <div className="space-y-6">
                <div className="bg-white rounded-lg p-6 shadow-md border-l-4" style={{ borderLeftColor: '#14B8A6' }}>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <Building2 className="w-5 h-5 shrink-0" style={{ color: '#14B8A6' }} aria-hidden />
                    Urbanisme et Habitat
                  </h3>
                  <p className="text-gray-700 leading-[20px] font-medium">
                    Réviser le Plan Local d'Urbanisme (PLU) pour protéger notre littoral et nos espaces naturels, tout en favorisant un habitat mixte et accessible à tous.
                  </p>
                </div>
                <div className="bg-white rounded-lg p-6 shadow-md border-l-4" style={{ borderLeftColor: '#EC4899' }}>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <Bike className="w-5 h-5 shrink-0" style={{ color: '#EC4899' }} aria-hidden />
                    Vélo et Mobilités
                  </h3>
                  <p className="text-gray-700 leading-[20px] font-medium">
                    Placer le vélo au cœur de la mission municipale, apaiser nos rues pour la sécurité de tous et connecter efficacement le territoire.
                  </p>
                </div>
                <div className="bg-white rounded-lg p-6 shadow-md border-l-4" style={{ borderLeftColor: '#FFE175' }}>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <Sprout className="w-5 h-5 shrink-0" style={{ color: '#C4A035' }} aria-hidden />
                    Agriculture & Alimentation
                  </h3>
                  <p className="text-gray-700 leading-[20px] font-medium">
                    Sanctuariser les terres agricoles et garantir une alimentation locale et saine, des marchés jusqu'aux cantines scolaires.
                  </p>
                </div>
              </div>
            </section>
          </div>

          {/* Section: Votre Opinion Compte - Full Width */}
          <section className="bg-[#FFE175] rounded-[28px] p-8 md:p-12 text-center max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-6">
              Votre Opinion Compte
            </h2>
            <p className="text-lg text-gray-700 leading-[20px] mb-8">
              Cette plateforme est la vôtre. Nous vous invitons à consulter ces propositions et à voter pour celles qui vous semblent prioritaires. Ensemble, faisons entendre une voix citoyenne forte pour construire un développement harmonieux et durable de notre territoire.
            </p>
            <Link
              href="/propositions"
              className="inline-flex items-center gap-2 bg-primary-600 text-white px-8 py-4 rounded-lg text-base font-semibold hover:bg-primary-700 transition-colors shadow-lg hover:shadow-xl"
            >
              Découvrez nos recommandations et votez pour l'avenir de Hyères !
              <ArrowRight className="w-5 h-5" />
            </Link>
          </section>
        </div>
      </div>
    </main>
  );
}
