/**
 * Données des podiums d'engagement par thématique.
 * Ordre d'affichage : 2e (gauche), 1er (centre), 3e (droite).
 */

export type PodiumPoint = {
  title: string;
  description: string;
};

export type PodiumCandidate = {
  rank: 1 | 2 | 3;
  listName: string;
  personName: string;
  percentage: number;
  points: PodiumPoint[];
};

export type PodiumTheme = {
  id: "habitat" | "mobilites" | "agriculture";
  title: string;
  /** Ordre affichage: [2e, 1er, 3e] */
  candidates: PodiumCandidate[];
};

export const engagementPodiums: PodiumTheme[] = [
  {
    id: "habitat",
    title: "Habitat & Urbanisme",
    candidates: [
      {
        rank: 2,
        listName: "Hyères Unie à Gauche",
        personName: "Caroline Moulin",
        percentage: 77,
        points: [
          { title: "Innovation foncière", description: "Bail Réel Solidaire (BRS) pour baisser les prix de 30 à 40%." },
          { title: "Régulation fiscale", description: "Taxe sur logements vacants pour loger sans artificialiser." },
          { title: "Priorité réhabilitation", description: "Rénovation des centres anciens plutôt que construction neuve." },
        ],
      },
      {
        rank: 1,
        listName: "Hyères Avenir",
        personName: "Nicolas Massuco",
        percentage: 83,
        points: [
          { title: "Expertise réglementaire", description: "Révision des documents d'urbanisme pour une meilleure maîtrise." },
          { title: "Mixité sociale", description: "Solutions pour logements vacants, saisonniers et logement social." },
          { title: "Protection du littoral", description: "Préservation des espaces sensibles et du patrimoine bâti." },
        ],
      },
      {
        rank: 3,
        listName: "Hyères Ensemble",
        personName: "Véronique Bernardini",
        percentage: 63,
        points: [
          { title: "Cadre de vie", description: "Protection de l'identité hyèroise, du paysage et du patrimoine." },
          { title: "Zéro béton littoral", description: "Opposition au bétonnage des côtes et révision du PLU." },
          { title: "Végétalisation urbaine", description: "Lutte contre les îlots de chaleur, moratoire sur le Val des Rougières." },
        ],
      },
    ],
  },
  {
    id: "mobilites",
    title: "Mobilités & Vélo",
    candidates: [
      {
        rank: 2,
        listName: "Hyères Unie à Gauche",
        personName: "Caroline Moulin",
        percentage: 89,
        points: [
          { title: "Action immédiate", description: "Aménagements de transition et projets pilotes." },
          { title: "Intelligence collective", description: "Concertation régulière avec les associations." },
          { title: "Culture vélo", description: "Politique large pour compléter les infrastructures." },
        ],
      },
      {
        rank: 1,
        listName: "Hyères Avenir",
        personName: "Nicolas Massuco",
        percentage: 92,
        points: [
          { title: "Ville cyclable", description: "Généralisation des doubles sens et pôle multimodal à la gare." },
          { title: "Culture vélo", description: "Politique large pour compléter les infrastructures." },
          { title: "Respect des dispositions", description: "Intégration systématique lors des réaménagements." },
        ],
      },
      {
        rank: 3,
        listName: "Hyères Ensemble",
        personName: "Véronique Bernardini",
        percentage: 86,
        points: [
          { title: "Maillage de la commune", description: "Itinéraires précis et très cohérents." },
          { title: "Vélos en libre service", description: "Déploiement d'une offre pour faciliter l'accès." },
          { title: "Cohérence et crédibilité", description: "lien entre déclarations et mesures." },
        ],
      },
    ],
  },
  {
    id: "agriculture",
    title: "Agriculture & Alimentation",
    candidates: [
      {
        rank: 2,
        listName: "Hyères Avenir",
        personName: "Nicolas Massuco",
        percentage: 63,
        points: [
          { title: "ZAC des Rougières", description: "Annulation du projet d'urbanisation." },
          { title: "Cantines 100% locales", description: "Engagements forts mais non chiffrés." },
          { title: "Ferme municipale", description: "Urgence de préserver les terres agricoles." },
        ],
      },
      {
        rank: 1,
        listName: "Hyères Unie à Gauche",
        personName: "Caroline Moulin",
        percentage: 67,
        points: [
          { title: "Expérimentation SSAL", description: "Sécurité Sociale de l'Alimentation pour tous." },
          { title: "Mesures au programme", description: "Bonne conscience des contraintes et difficultés." },
          { title: "Urgence alimentaire", description: "création d'une régie municipale de l'alimentation" },
        ],
      },
      {
        rank: 3,
        listName: "Hyères en Mieux",
        personName: "François Cornileau",
        percentage: 60,
        points: [
          { title: "Halle de producteurs", description: "Mise en place avec les producteurs locaux" },
          { title: "Urgence de préserver", description: "Préserver et remettre en culture les terres." },
          { title: "Vigilance sur la réalité des engagements", description: "au regard des réalisations lors du précédent mandat" },
        ],
      },
    ],
  },
];

export function getPodiumByThemeId(
  themeId: "habitat" | "mobilites" | "agriculture"
): PodiumTheme | undefined {
  return engagementPodiums.find((p) => p.id === themeId);
}
