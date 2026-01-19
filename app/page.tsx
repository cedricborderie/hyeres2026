"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import LiveStats from "@/components/LiveStats";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-primary-50">
      {/* Hero Section - Full Width Background */}
      <div className="bg-gradient-to-b from-white to-gray-50 py-12 md:py-20" style={{ backgroundImage: 'none', background: 'unset', backgroundColor: 'unset', boxShadow: '0px 4px 12px 0px rgba(0, 0, 0, 0.15)' }}>
        <div className="container mx-auto px-4" style={{ backgroundImage: 'none', background: 'unset', backgroundColor: 'unset' }}>
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Flag - Mobile First (above text), Desktop Second (right column) */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex justify-center md:justify-start order-1 md:order-2"
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

          {/* Left: Text */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="text-left order-2 md:order-1"
          >
            <h1 className="text-xl font-semibold text-gray-900 mb-4 leading-7">
              Reprenons la parole pour les municipales !
            </h1>
            <p className="text-base font-medium text-gray-700 leading-[25px] mb-6">
              Nos associations s'unissent pour proposer une plateforme citoyenne non partisane. Faites entendre votre voix auprès des futurs élus. Découvrez et votez pour nos recommandations concrètes autour de trois priorités : urbanisme durable, mobilités douces et agriculture locale. Engageons ensemble les futurs élus pour un territoire harmonieux.
            </p>
            
            <p className="text-lg font-semibold text-primary-600 mb-6">
              Votre voix compte : donnez votre avis sur nos propositions !
            </p>

            {/* CTA and Stats */}
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-12">
              <div className="w-full md:w-auto">
                <LiveStats />
              </div>
              <Link
                href="/propositions"
                className="inline-flex items-center gap-2 bg-primary-600 text-white px-8 py-4 rounded-lg text-base font-semibold hover:bg-primary-700 transition-colors shadow-lg hover:shadow-xl w-full md:w-auto justify-center"
              >
                Commencer à voter
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </motion.div>
          </div>
        </div>
      </div>

      {/* Main Content Section */}
      <div className="container mx-auto px-4 py-12 md:py-20">
        <div className="max-w-7xl mx-auto space-y-12">
          {/* Section 1: Pour un Hyères Désirable - Full Width */}
          <section className="max-w-4xl">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 text-left">
              Pour un Hyères Désirable : La Plateforme Citoyenne
            </h2>
            <p className="text-base font-medium text-gray-700 leading-relaxed mb-8 text-left">
              Parce que l'avenir de notre territoire se joue dès aujourd'hui.
            </p>
            <p className="text-base font-medium text-gray-700 leading-6 mb-6 text-left">
              Nous associations citoyennes implantées à Hyères depuis de nombreuses années, fortes de nos adhérents et de l'engagement que suscitent nos actions, avons décidé de nous unir pour proposer une vision d'avenir à notre commune.
            </p>
            <p className="text-base text-gray-700 leading-6 font-medium text-left">
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
              <p className="text-base font-medium text-gray-700 leading-6 mb-6">
                Les élections municipales sont un moment clé où se choisit la direction qui impactera notre quotidien pour les années à venir. Notre initiative, non partisane, vise à ce que les citoyens se réapproprient ce débat. Nous souhaitons :
              </p>
              <ul className="space-y-4 text-base text-gray-700">
                <li className="flex items-start">
                  <span className="text-primary-600 mr-3 font-bold">•</span>
                  <span className="font-medium"><strong>Proposer</strong> des solutions concrètes autour de trois piliers majeurs : un urbanisme inclusif, respectueux du patrimoine naturel et bâti, des mobilités douces et une agriculture locale nourricière pour tous.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-600 mr-3 font-bold">•</span>
                  <span className="font-medium"><strong>Engager</strong> les candidats en leur présentant ces programmes et en obtenant des engagements précis sur leur mise en œuvre.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-600 mr-3 font-bold">•</span>
                  <span className="font-medium"><strong>Éclairer</strong> le vote de chacun en analysant les programmes des candidats à la lumière de leurs engagements envers ces mesures.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-600 mr-3 font-bold">•</span>
                  <span><strong>Responsabiliser</strong> les futurs élus en suivant la tenue de leurs promesses tout au long du mandat.</span>
                </li>
              </ul>
            </section>

            {/* Right Column: Nos 3 Champs d'Expertise */}
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Nos 3 Champs d'Expertise
              </h2>
              <div className="space-y-6">
                <div className="bg-white rounded-lg p-6 shadow-md border-l-4 border-primary-600">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Urbanisme et Habitat
                  </h3>
                  <p className="text-gray-700 leading-6 font-medium">
                    Réviser le Plan Local d'Urbanisme (PLU) pour protéger notre littoral et nos espaces naturels, tout en favorisant un habitat mixte et accessible à tous.
                  </p>
                </div>
                <div className="bg-white rounded-lg p-6 shadow-md border-l-4 border-primary-600">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Vélo et Mobilités
                  </h3>
                  <p className="text-gray-700 leading-6 font-medium">
                    Placer le vélo au cœur de la mission municipale, apaiser nos rues pour la sécurité de tous et connecter efficacement le territoire.
                  </p>
                </div>
                <div className="bg-white rounded-lg p-6 shadow-md border-l-4 border-primary-600">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Agriculture Saine
                  </h3>
                  <p className="text-gray-700 leading-relaxed font-medium">
                    Promouvoir une agriculture locale et nourricière (propositions portées par l'Écolieu du Plan du Pont).
                  </p>
                </div>
              </div>
            </section>
          </div>

          {/* Section: Votre Voix Compte - Full Width */}
          <section className="bg-primary-50 rounded-lg p-8 md:p-12 text-center max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-6">
              Votre Voix Compte
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-8">
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
