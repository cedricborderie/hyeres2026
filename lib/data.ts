// lib/data.ts

export type Category = {
  id: string;
  title: string;
  description: string;
  color: string;
};

export type Proposal = {
  id: string;
  categoryId: string;
  title: string;
  summary: string; // Short text for the card
  details: string; // Full text for the modal (can include line breaks)
  external_link?: string;
};

export const categories: Category[] = [
  {
    id: "habitat",
    title: "Habitat & Urbanisme",
    description: "5 recommandations pour un développement harmonieux et durable.",
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
  // --- HABITAT (5 Recommandations) ---
  {
    id: "h1",
    categoryId: "habitat",
    title: "1. Réviser un PLU trop permissif",
    summary: "Diminuer la constructibilité et maîtriser les densités.",
    details: "Nous proposons de réduire les zones constructibles (Zones U) et d'appliquer la loi Le Meur pour interdire toute construction supplémentaire de résidences secondaires. Il faut rendre obligatoire une notice urbanistique opposable valorisant la mixité et les espaces communs, et redonner une vocation agricole à la zone des Rougières.",
  },
  {
    id: "h2",
    categoryId: "habitat",
    title: "2. Protéger et valoriser le littoral",
    summary: "Appliquer strictement la loi Littoral et sauvegarder les espaces sensibles.",
    details: "Le littoral est une réserve de biodiversité et une valeur paysagère forte. Nous demandons l'application stricte de la loi Littoral, la sauvegarde des espaces sensibles (MGEN, Gapeau, La Badine) et le déplacement de l'embarcadère de la Tour Fondue vers le port.",
  },
  {
    id: "h3",
    categoryId: "habitat",
    title: "3. Anticiper les risques d'inondation",
    summary: "Délimiter des zones inconstructibles strictes face à la submersion.",
    details: "Face aux épisodes pluvieux intenses et au recul du trait de côte, la révision du PPRI est une priorité. Les règles d'urbanisme doivent interdire toute nouvelle construction dans les zones à risque et définir des projets pilotes de relocalisation (logique solidaire et responsable).",
  },
  {
    id: "h4",
    categoryId: "habitat",
    title: "4. Faire face aux canicules",
    summary: "Végétalisation massive et rénovation thermique des bâtiments.",
    details: "Pour réduire les îlots de chaleur, nous proposons une végétalisation massive de l'espace public (50 à 150€/m2) et la rénovation des bâtiments publics inadaptés (isolation, protections solaires, free cooling). Les Plans Climat Air Energie (PCAET) doivent être respectés.",
  },
  {
    id: "h5",
    categoryId: "habitat",
    title: "5. Favoriser un habitat mixte et accessible",
    summary: "Mobiliser les logements vacants et créer une Coopérative Foncière.",
    details: "Il y a 2600 logements vacants à Hyères ! Appliquons la Taxe sur les Logements Vacants (TLV) pour financer leur rénovation via l'ANAH. Nous proposons aussi de passer la taxe sur les résidences secondaires à 20% et de créer un Organisme Foncier Solidaire (OFS) pour des logements durablement abordables (Bail Réel Solidaire).",
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
