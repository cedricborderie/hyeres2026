// lib/data.ts

export type Category = {
  id: string;
  title: string;
  description: string;
  color: string;
};

export interface Proposal {
  id: string;
  categoryId: string;
  title: string;
  summary: string; // Short text for the card
  details: string; // Full text for the modal (can include line breaks)
  external_link?: string;
}

export const categories: Category[] = [
  {
    id: "habitat",
    title: "Habitat & Urbanisme",
    description: "20 recommandations pour un développement harmonieux et durable.",
    color: "#6B9BD1", // Bleu doux - stabilité, construction (adouci)
  },
  {
    id: "mobilites",
    title: "Mobilités & Vélo",
    description: "15 propositions : Jouez la carte du vélo !",
    color: "#FFA726", // Jaune orangé - énergie, dynamisme (au lieu de rouge)
  },
  {
    id: "agriculture",
    title: "Agriculture & Alimentation",
    description: "Protéger la plaine agricole et nos agriculteurs (En construction).",
    color: "#81C784", // Vert doux - croissance, nature (adouci)
  },
];

export const proposals: Proposal[] = [
  // --- HABITAT (20 Recommandations) ---
  // --- AXE 1 : RÉVISER UN PLU TROP PERMISSIF (Points 1 à 4) ---
  {
    id: "h1",
    categoryId: "habitat",
    title: "1. Diminuer la constructibilité",
    summary: "Réduire les zones U et stopper les résidences secondaires.",
    details: "Réduire les zones constructibles (Zones U) et appliquer la loi Le Meur pour interdire toute construction supplémentaire de résidences secondaires.",
  },
  {
    id: "h2",
    categoryId: "habitat",
    title: "2. Maîtriser les densités",
    summary: "Stopper l'étalement urbain et l'habitat diffus.",
    details: "Encadrer strictement les lotissements périphériques. Rendre obligatoire une notice urbanistique opposable valorisant la mixité et les espaces communs.",
  },
  {
    id: "h3",
    categoryId: "habitat",
    title: "3. Préserver les espaces agricoles",
    summary: "Protéger les Rougières et appliquer la Loi Climat.",
    details: "Créer des zones agricoles protégées (ZAP), appliquer l'objectif Zéro Artificialisation et redonner une vocation agricole à la zone des Rougières.",
  },
  {
    id: "h4",
    categoryId: "habitat",
    title: "4. Préserver le patrimoine bâti",
    summary: "Protéger le petit patrimoine avec les habitants.",
    details: "Inventorier le patrimoine non classé et travailler avec l'Architecte des Bâtiments de France pour imposer des règles strictes aux promoteurs.",
  },

  // --- AXE 2 : PROTÉGER LE LITTORAL (Points 5 à 7) ---
  {
    id: "h5",
    categoryId: "habitat",
    title: "5. Appliquer la Loi Littoral",
    summary: "Limiter strictement les extensions en bord de mer.",
    details: "Zéro dérogation : limiter les nouvelles constructions et les extensions pour préserver la valeur paysagère et la biodiversité.",
  },
  {
    id: "h6",
    categoryId: "habitat",
    title: "6. Sauvegarder les espaces sensibles",
    summary: "Protection absolue (MGEN, Gapeau, La Badine).",
    details: "Ces sites emblématiques doivent être totalement préservés. Nous tendrons vers des densités plus faibles et des zones inconstructibles.",
  },
  {
    id: "h7",
    categoryId: "habitat",
    title: "7. Déplacer l'embarcadère",
    summary: "Désengorger la Tour Fondue vers le Port.",
    details: "Déplacer les flux vers le port d'Hyères et envisager à terme la fermeture de la route du Sel à la circulation automobile.",
  },

  // --- AXE 3 : RISQUES INONDATION (Points 8 à 11) ---
  {
    id: "h8",
    categoryId: "habitat",
    title: "8. Zéro construction en zone à risque",
    summary: "Interdiction totale, même en surélevant.",
    details: "Délimiter des zones rouges strictes où toute nouvelle construction est interdite face à l'aggravation des risques d'inondation.",
  },
  {
    id: "h9",
    categoryId: "habitat",
    title: "9. Révision du PPRI",
    summary: "Une priorité absolue du mandat.",
    details: "Mettre à jour le Plan de Prévention des Risques d'Inondation pour tenir compte de l'imperméabilisation des sols.",
  },
  {
    id: "h10",
    categoryId: "habitat",
    title: "10. Anticiper le trait de côte",
    summary: "Définir des zones d'études prospectives.",
    details: "Identifier dans le PLU les zones menacées par la montée des eaux pour geler les projets à risque.",
  },
  {
    id: "h11",
    categoryId: "habitat",
    title: "11. Projets pilotes de relocalisation",
    summary: "Une logique de solidarité face aux risques.",
    details: "Expérimenter des solutions de relocalisation ou d'adaptation pour les habitants menacés par les risques littoraux.",
  },

  // --- AXE 4 : CANICULES (Points 12 à 13) ---
  {
    id: "h12",
    categoryId: "habitat",
    title: "12. Réduire les îlots de chaleur",
    summary: "Végétalisation massive (50-150€/m²).",
    details: "Remplacer les matériaux inadaptés et créer des îlots de fraîcheur sur l'espace public.",
  },
  {
    id: "h13",
    categoryId: "habitat",
    title: "13. Rénover les bâtiments publics",
    summary: "Isolation et 'Free Cooling'.",
    details: "Investir (200-500€/m²) pour adapter écoles et mairies aux fortes chaleurs (protections solaires, surventilation).",
  },

  // --- AXE 5 : HABITAT MIXTE (Points 14 à 20) ---
  {
    id: "h14",
    categoryId: "habitat",
    title: "14. Taxe Logements Vacants (TLV)",
    summary: "Mobiliser les 2600 logements vides.",
    details: "Appliquer la TLV (17% puis 34%) pour inciter à la location et reverser les recettes à l'ANAH.",
  },
  {
    id: "h15",
    categoryId: "habitat",
    title: "15. Opération Réhabilitation",
    summary: "Aider les propriétaires (MaPrimeRénov).",
    details: "Lancer une campagne massive pour remettre les logements vacants sur le marché (Coût pour la ville : 0€).",
  },
  {
    id: "h16",
    categoryId: "habitat",
    title: "16. Réinvestir les amendes SRU",
    summary: "Acheter dans le centre-ville.",
    details: "Utiliser les 318 000€ d'amendes annuelles pour préempter et rénover des immeubles anciens.",
  },
  {
    id: "h17",
    categoryId: "habitat",
    title: "17. Hausse Taxe Résidences Secondaires",
    summary: "Passer de 12% à 20% (Zone Tendue).",
    details: "Générer 1,5M€ de recettes supplémentaires par an pour financer le logement abordable.",
  },
  {
    id: "h18",
    categoryId: "habitat",
    title: "18. Coopérative Foncière (BRS)",
    summary: "Logements abordables à vie.",
    details: "Créer un Organisme Foncier Solidaire : la ville garde le terrain, l'habitant achète les murs 30% moins cher.",
  },
  {
    id: "h19",
    categoryId: "habitat",
    title: "19. Renouvellement Val des Rougières",
    summary: "Plan ANRU sur 15 ans.",
    details: "Requalifier totalement le quartier pour améliorer la vie des habitants (Investissement : 24€/habitant/an).",
  },
  {
    id: "h20",
    categoryId: "habitat",
    title: "20. Hébergement Saisonniers & Jeunes",
    summary: "Auberges de jeunesse et Tiers-lieux.",
    details: "Créer des solutions d'hébergement dignes et hybrides pour les travailleurs et les jeunes.",
  },

  // --- MOBILITÉS (15 Propositions) ---
  // Thème 1 : Mission Municipale
  {
    id: "m1",
    categoryId: "mobilites",
    title: "1. Créer un poste de Responsable Vélo",
    summary: "Un pilotage réactif dédié à la mairie et à la métropole.",
    details: "Recrutement d'un chargé de mission pour coordonner infrastructures et communication. Création de synergies avec la métropole TPM pour fluidifier les projets. Coût estimé : 1,31 €/habitant.",
  },
  {
    id: "m2",
    categoryId: "mobilites",
    title: "2. Partager les compétences (Police & Admin)",
    summary: "Essaimer la 'Culture Vélo' dans les services.",
    details: "Former un référent à chaque échelon administratif et former 5% de la Police Municipale (6 agents) à la mobilité cycliste (Brevet FUB) pour assurer une sécurité de proximité.",
  },
  {
    id: "m3",
    categoryId: "mobilites",
    title: "3. Raccourcir les circuits de décision",
    summary: "Créer un Comité de Pilotage participatif (COPIL).",
    details: "Associer les usagers et associations à chaque étape pour des aménagements utiles. Publier un bilan de performance public deux fois par an.",
  },
  {
    id: "m4",
    categoryId: "mobilites",
    title: "4. Location de vélos au Pôle Gare",
    summary: "Transformer 5 places de parking en espace de location.",
    details: "Création d'un espace de 100m² au cœur du pôle multimodal en partenariat avec des loueurs privés, sans subvention publique nécessaire.",
  },
  {
    id: "m5",
    categoryId: "mobilites",
    title: "5. Label 'Employeur Pro-Vélo' (Niveau Or)",
    summary: "La Mairie doit devenir exemplaire.",
    details: "Engagement immédiat de la municipalité dans la démarche pour faire de la collectivité un modèle de mobilité durable.",
  },
  {
    id: "m6",
    categoryId: "mobilites",
    title: "6. Promotion dynamique",
    summary: "Communication et événements (Fête du vélo).",
    details: "Intégrer les mobilités actives dans toutes les communications municipales et organiser des événements réguliers ambitieux.",
  },

  // Thème 2 : Apaiser nos rues
  {
    id: "m7",
    categoryId: "mobilites",
    title: "7. Priorité à nos enfants (13 écoles)",
    summary: "Réduire drastiquement le transit devant les écoles.",
    details: "Transformation en zones de rencontre ou mise en sens unique devant les 13 écoles identifiées pour libérer de l'espace de vie et sécuriser les entrées/sorties.",
  },
  {
    id: "m8",
    categoryId: "mobilites",
    title: "8. Le Double Sens Cyclable",
    summary: "Généralisation pour la fluidité et la visibilité.",
    details: "Maillage du centre-ville avec signalisation systématique des doubles sens (interventions légères : marquage/panneaux) pour éviter les détours inutiles.",
  },
  {
    id: "m9",
    categoryId: "mobilites",
    title: "9. Extension du Cœur de Ville",
    summary: "Zones piétonnes et zones de rencontre.",
    details: "Redonner de l'espace à la vie et au commerce de proximité tout en maintenant une accessibilité pour les résidents et livraisons.",
  },
  {
    id: "m10",
    categoryId: "mobilites",
    title: "10. Visibilité aux passages piétons (Loi LOM)",
    summary: "Suppression du stationnement 5m en amont.",
    details: "Mise en conformité légale : neutralisation du stationnement masquant la visibilité piétonne, remplacé par des arceaux vélos ou de la végétalisation.",
  },
  {
    id: "m11",
    categoryId: "mobilites",
    title: "11. Cohabitation pacifiée",
    summary: "Sensibilisation et pédagogie.",
    details: "Actions pour expliquer les nouveaux aménagements (sas vélo, voie verte, etc.) et inciter à la vigilance envers les usagers vulnérables.",
  },

  // Thème 3 : Connecter le territoire
  {
    id: "m12",
    categoryId: "mobilites",
    title: "12. Maillage Territorial 2032",
    summary: "Relier les 9 mairies annexes et le centre.",
    details: "Créer des itinéraires sécurisés et directs. Déployer des aménagements de transition dès le début du mandat sur les carrefours critiques.",
  },
  {
    id: "m13",
    categoryId: "mobilites",
    title: "13. Activer le 'Réflexe Vélo'",
    summary: "Signalétique unifiée et jalonnement.",
    details: "Déployer un jalonnement systématique vers les points d'intérêt (temps de trajet vélo) et une signalisation incitant les voitures à la prudence.",
  },
  {
    id: "m14",
    categoryId: "mobilites",
    title: "14. Combattre l'enclavement",
    summary: "Servitudes de passage et Loi LAURE.",
    details: "Préempter des passages clés pour éviter les détours. Appliquer la Loi LAURE : chaque rénovation de voirie doit intégrer un aménagement cyclable.",
  },
  {
    id: "m15",
    categoryId: "mobilites",
    title: "15. Intelligence Collective",
    summary: "Co-construction avec les associations.",
    details: "Mobiliser l'expertise des usagers locaux (gratuite) pour dessiner les tracés les plus efficaces et optimiser les deniers publics.",
  },

  // --- AGRICULTURE (Placeholder) ---
  {
    id: "a1",
    categoryId: "agriculture",
    title: "Consultation : Terres Agricoles",
    summary: "Ce volet est en cours de construction.",
    details: "La préservation de la plaine agricole et l'alimentation locale sont des enjeux majeurs. Nous finalisons nos propositions. Vous avez une idée ou une expertise ? Écrivez-nous pour participer.",
    external_link: "mailto:contact@changerdere.org",
  },
];

// Helper function to get proposals by category
export function getProposalsByCategory(categoryId: string): Proposal[] {
  return proposals.filter((p) => p.categoryId === categoryId);
}

// Helper function to get category by id
export function getCategoryById(id: string): Category | undefined {
  return categories.find((c) => c.id === id);
}

// Helper function to get all proposals (for stats)
export function getAllProposals(): Proposal[] {
  return proposals;
}
