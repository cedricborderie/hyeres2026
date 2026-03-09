import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "La Méthodologie | Plateforme Citoyenne Hyèroise",
  description:
    "Comment nous avons évalué les engagements des candidats : approche comparative, nuancier d'engagement et restitution thématique.",
};

export default function MethodologiePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 md:py-12 max-w-3xl">
        <Link
          href="/engagements/habitat"
          className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 text-sm font-medium mb-8"
        >
          ← Retour aux engagements
        </Link>

        <header className="mb-14">
          <span className="block text-[11px] uppercase tracking-[0.2em] text-primary-600 mb-3">
            Notre démarche
          </span>
          <h1 className="text-3xl md:text-4xl font-normal text-gray-900 leading-tight mb-5">
            La Méthodologie
          </h1>
          <p className="text-base text-gray-500 leading-relaxed max-w-[620px] border-l-4 border-primary-500 pl-4">
            Afin de garantir une neutralité absolue, l&apos;évaluation ne s&apos;est pas limitée aux
            seules déclarations d&apos;intention. Elle repose sur le croisement systématique de deux
            sources : les questionnaires thématiques retournés par les candidats et l&apos;analyse
            approfondie de leurs programmes officiels.
          </p>
        </header>

        <hr className="border-t border-gray-200 mb-12" />

        <section className="mb-14">
          <div className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-primary-600 text-white text-sm font-medium mb-3">
            1
          </div>
          <h2 className="text-lg font-normal text-gray-900 leading-snug mb-4">
            Une approche comparative, multi-critères et rigoureuse
          </h2>
          <p className="text-[15px] text-gray-700 leading-relaxed mb-3">
            Pour la liste conduite par le Maire sortant, M. Giran, n&apos;ayant pas renvoyé de
            questionnaire complété, l&apos;analyse a été effectuée sur la base des éléments
            programmatiques transmis par courrier écrit, complétés par une étude exhaustive de son
            programme de campagne.
          </p>
          <p className="text-[15px] text-gray-700 leading-relaxed">
            Pour l&apos;ensemble des autres candidats, la lecture de leurs programmes a également
            servi à affiner et confirmer les positions exprimées dans leurs réponses directes.
          </p>
        </section>

        <section className="mb-14">
          <div className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-primary-600 text-white text-sm font-medium mb-3">
            2
          </div>
          <h2 className="text-lg font-normal text-gray-900 leading-snug mb-4">
            Le &quot;nuancier d&apos;engagement&quot; : de l&apos;intention à l&apos;opérationnalité
          </h2>
          <p className="text-[15px] text-gray-700 leading-relaxed mb-5">
            Chaque mesure a fait l&apos;objet d&apos;une notation précise selon une échelle de
            concordance. Cette méthode permet de dépasser le simple clivage &quot;pour ou
            contre&quot; afin de mesurer la maturité de chaque proposition.
          </p>

          <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-2.5">
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-md bg-gray-300 shrink-0 mt-0.5" aria-hidden />
              <p className="text-[13.5px] text-gray-700 leading-snug">
                <strong className="font-normal text-gray-900">Pas de réponse</strong> — Le candidat
                n&apos;a pas communiqué de position sur ce sujet.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-md bg-[#d64f82] shrink-0 mt-0.5" aria-hidden />
              <p className="text-[13.5px] text-gray-700 leading-snug">
                <strong className="font-normal text-gray-900">Négative</strong> — La mesure est
                rejetée ou absente des priorités.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-md bg-[#2dd4bf] shrink-0 mt-0.5" aria-hidden />
              <p className="text-[13.5px] text-gray-700 leading-snug">
                <strong className="font-normal text-gray-900">Ne se positionne pas</strong> — La
                liste ne souhaite pas s&apos;exprimer sur ce sujet.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-md bg-[#14b8a6] shrink-0 mt-0.5" aria-hidden />
              <p className="text-[13.5px] text-gray-700 leading-snug">
                <strong className="font-normal text-gray-900">Partielle</strong> — L&apos;intention
                est partagée mais le périmètre reste restreint.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-md bg-[#0d7070] shrink-0 mt-0.5" aria-hidden />
              <p className="text-[13.5px] text-gray-700 leading-snug">
                <strong className="font-normal text-gray-900">Engagée</strong> — La liste valide la
                mesure et l&apos;intègre à son socle programmatique.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-md bg-[#1a3a6b] shrink-0 mt-0.5" aria-hidden />
              <p className="text-[13.5px] text-gray-700 leading-snug">
                <strong className="font-normal text-gray-900">Très engagée</strong> — La mesure est
                pleinement appropriée, avec des modalités de mise en œuvre et de faisabilité déjà
                identifiées.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-14">
          <div className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-primary-600 text-white text-sm font-medium mb-3">
            3
          </div>
          <h2 className="text-lg font-normal text-gray-900 leading-snug mb-4">
            Une lecture synthétique, un podium thématique
          </h2>
          <p className="text-[15px] text-gray-700 leading-relaxed mb-5">
            Les résultats sont restitués sous trois formes complémentaires pour offrir une lecture
            claire et transparente de cette analyse complexe.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <span className="text-2xl block mb-2" aria-hidden>🏆</span>
              <h3 className="text-sm font-normal text-gray-900 mb-2 leading-snug">
                Le Podium par thématique
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Une mise en lumière des listes les plus abouties sur les enjeux de
                l&apos;agriculture, de l&apos;habitat et des mobilités.
              </p>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <span className="text-2xl block mb-2" aria-hidden>📊</span>
              <h3 className="text-sm font-normal text-gray-900 mb-2 leading-snug">
                Le Tableau synthétique
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Un état des lieux détaillé du positionnement de chaque candidat sur les 56 mesures
                proposées.
              </p>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <span className="text-2xl block mb-2" aria-hidden>📋</span>
              <h3 className="text-sm font-normal text-gray-900 mb-2 leading-snug">
                Les Fiches individuelles
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Une synthèse par candidat évaluant la qualité, la cohérence et la crédibilité de
                ses engagements thématiques.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-14">
          <div className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-primary-600 text-white text-sm font-medium mb-3">
            4
          </div>
          <h2 className="text-lg font-normal text-gray-900 leading-snug mb-4">
            Un engagement pérenne pour le suivi de la mandature
          </h2>
          <p className="text-[15px] text-gray-700 leading-relaxed mb-5">
            L&apos;action de la Plateforme Citoyenne Hyéroise souhaite s&apos;inscrire au-delà de
            l&apos;échéance électorale. Notre regroupement a vocation à pérenniser le dialogue
            local, et à intégrer d&apos;autres acteurs associatifs dans cette démarche, pour
            continuer à se positionner comme un interlocuteur constructif tout au long du mandat
            des futurs conseillers municipaux.
          </p>

          <div className="bg-teal-50 border border-teal-200 rounded-xl p-5">
            <p className="text-sm text-teal-800 leading-relaxed">
              Nous assurerons un suivi des engagements pris, les confrontant régulièrement aux actes,
              veillant à ce que la démocratie participative reste vivante, participant à
              l&apos;intérêt général et à la transition de notre territoire.
            </p>
          </div>
        </section>

        <div className="pt-8">
          <Link
            href="/engagements/habitat"
            className="inline-flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-lg text-sm font-semibold hover:bg-primary-700 transition-colors"
          >
            ← Retour aux engagements
          </Link>
        </div>
      </div>
    </div>
  );
}
