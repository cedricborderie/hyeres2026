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
  // --- HABITAT & URBANISME (20 Propositions) ---
  // Axe 1
  {
    id: "h1",
    categoryId: "habitat",
    title: "H1. Diminuer la constructibilité",
    summary: "Réduire les zones U et limiter les résidences secondaires.",
    details: "Réduire les zones constructibles (Zones U) et appliquer la loi Le Meur pour interdire toute construction supplémentaire de résidences secondaires.",
  },
  {
    id: "h2",
    categoryId: "habitat",
    title: "H2. Maîtriser les densités",
    summary: "Stopper l'étalement urbain et l'habitat diffus.",
    details: "Encadrer strictement l'habitat diffus et les lotissements périphériques. Rendre obligatoire une notice urbanistique opposable valorisant la mixité, les jardins et les espaces communs.",
  },
  {
    id: "h3",
    categoryId: "habitat",
    title: "H3. Préserver les espaces agricoles",
    summary: "Protéger les Rougières et appliquer la Loi Climat.",
    details: "Créer des zones agricoles protégées (ZAP), appliquer l'objectif de réduction de consommation d'espaces (Loi Climat) et redonner une vocation agricole à la zone des Rougières.",
  },
  {
    id: "h4",
    categoryId: "habitat",
    title: "H4. Préserver le patrimoine bâti",
    summary: "Protéger le petit patrimoine avec les habitants.",
    details: "Inventorier le 'petit patrimoine' non classé avec l'aide des citoyens et travailler avec l'Architecte des Bâtiments de France pour imposer des règles de protection cohérentes aux promoteurs.",
  },
  // Axe 2
  {
    id: "h5",
    categoryId: "habitat",
    title: "H5. Appliquer la Loi Littoral",
    summary: "Limiter strictement les extensions en bord de mer.",
    details: "Zéro dérogation : limiter drastiquement les nouvelles constructions et les extensions en bord de mer pour préserver la valeur paysagère et la biodiversité.",
  },
  {
    id: "h6",
    categoryId: "habitat",
    title: "H6. Sauvegarder les espaces sensibles",
    summary: "Protection absolue (MGEN, Gapeau, La Badine).",
    details: "Ces sites emblématiques (MGEN, Gapeau, La Badine) doivent être totalement préservés. Nous tendrons vers des densités plus faibles et des zones inconstructibles.",
  },
  {
    id: "h7",
    categoryId: "habitat",
    title: "H7. Limiter le trafic vers la presqu'île",
    summary: "Désengorger la Tour Fondue et Giens.",
    details: "Déplacer les flux de l'embarcadère de la Tour Fondue vers le port d'Hyères en affrétant plus de navettes au départ du port et envisager à terme la fermeture de la route du Sel à la circulation automobile.",
  },
  // Axe 3
  {
    id: "h8",
    categoryId: "habitat",
    title: "H8. Zéro construction en zone à risque",
    summary: "Interdiction totale, même en surélevant.",
    details: "Délimiter des zones rouges strictes où toute nouvelle construction est interdite (même surélevée) face à l'aggravation des risques d'inondation.",
  },
  {
    id: "h9",
    categoryId: "habitat",
    title: "H9. Révision du PPRI",
    summary: "Une priorité absolue du mandat.",
    details: "Mettre à jour en priorité le Plan de Prévention des Risques d'Inondation (PPRI) pour tenir compte de l'imperméabilisation des sols et des épisodes pluvieux intenses.",
  },
  {
    id: "h10",
    categoryId: "habitat",
    title: "H10. Anticiper le trait de côte",
    summary: "Définir des zones d'études prospectives.",
    details: "Identifier clairement dans le PLU les zones menacées par la montée des eaux et le recul du trait de côte pour geler les projets à risque.",
  },
  {
    id: "h11",
    categoryId: "habitat",
    title: "H11. Projets pilotes de relocalisation",
    summary: "Une logique de solidarité face aux risques.",
    details: "Lancer des projets pilotes d'adaptation ou de relocalisation pour les habitants menacés par les risques littoraux, dans une logique solidaire et responsable.",
  },
  // Axe 4
  {
    id: "h12",
    categoryId: "habitat",
    title: "H12. Réduire les îlots de chaleur",
    summary: "Végétalisation massive (50-150€/m²).",
    details: "Remplacer les matériaux urbains inadaptés et créer des îlots de fraîcheur sur l'espace public par une végétalisation massive.",
  },
  {
    id: "h13",
    categoryId: "habitat",
    title: "H13. Rénover les bâtiments publics",
    summary: "Isolation et 'Free Cooling'.",
    details: "Investir (200 à 500€/m²) pour adapter les écoles et bâtiments publics aux fortes chaleurs : isolation renforcée, protections solaires et surventilation nocturne.",
  },
  // Axe 5
  {
    id: "h14",
    categoryId: "habitat",
    title: "H14. Taxe Logements Vacants (TLV)",
    summary: "Mobiliser les 2600 logements vides.",
    details: "Appliquer la Taxe sur les Logements Vacants (TLV) (17% la 1ère année, puis 34%) pour inciter à la mise en location. Les recettes seront reversées à l'ANAH pour financer la rénovation.",
  },
  {
    id: "h15",
    categoryId: "habitat",
    title: "H15. Opération Réhabilitation",
    summary: "Aider les propriétaires (MaPrimeRénov).",
    details: "Lancer une campagne massive pour remettre les logements vacants sur le marché via les dispositifs MaPrimeRénov et LocAvantages (Coût pour la ville : 0€).",
  },
  {
    id: "h16",
    categoryId: "habitat",
    title: "H16. Réinvestir les amendes SRU",
    summary: "Acheter dans le centre-ville.",
    details: "Utiliser les 318 000€ d'amendes annuelles (loi SRU) pour préempter et rénover des immeubles anciens du centre-ville au lieu de payer des pénalités à l'État.",
  },
  {
    id: "h17",
    categoryId: "habitat",
    title: "H17. Hausse Taxe Résidences Secondaires",
    summary: "Passer de 12% à 20% (Zone Tendue).",
    details: "Passer la taxe d'habitation sur les résidences secondaires de 12,02% à 20% pour générer 1,5M€ de recettes supplémentaires par an dédiées au logement abordable.",
  },
  {
    id: "h18",
    categoryId: "habitat",
    title: "H18. Coopérative Foncière (BRS)",
    summary: "Logements abordables à vie.",
    details: "Créer un Organisme Foncier Solidaire (OFS) : la collectivité garde le terrain, l'habitant achète les murs avec une décote de 30% à 50% (Bail Réel Solidaire).",
  },
  {
    id: "h19",
    categoryId: "habitat",
    title: "H19. Renouvellement Val des Rougières",
    summary: "Plan ANRU sur 15 ans.",
    details: "Engager un plan type ANRU pour requalifier totalement le quartier du Val des Rougières et améliorer la qualité de vie (Investissement estimé : 24€/habitant/an pendant 15 ans).",
  },
  {
    id: "h20",
    categoryId: "habitat",
    title: "H20. Hébergement Saisonniers & Jeunes",
    summary: "Auberges de jeunesse et Tiers-lieux.",
    details: "Soutenir le développement de solutions d'hébergement dignes et hybrides (auberges adossées à des tiers-lieux) pour les travailleurs saisonniers et les jeunes.",
  },

  // --- MOBILITÉS & VÉLO (15 Propositions) ---
  {
    id: "m1",
    categoryId: "mobilites",
    title: "M1. Créer un poste de Responsable Vélo",
    summary: "Un pilotage réactif dédié à la mairie et à la métropole.",
    details: "Recrutement d'un chargé de mission pour coordonner infrastructures et communication. Création de synergies avec la métropole TPM pour fluidifier les projets.",
  },
  {
    id: "m2",
    categoryId: "mobilites",
    title: "M2. Partager les compétences",
    summary: "Essaimer la 'Culture Vélo' dans les services.",
    details: "Former un référent à chaque échelon administratif et former 5% de la Police Municipale (6 agents) à la mobilité cycliste (Brevet FUB) pour assurer une sécurité de proximité.",
  },
  {
    id: "m3",
    categoryId: "mobilites",
    title: "M3. Raccourcir les circuits de décision",
    summary: "Créer un Comité de Pilotage participatif (COPIL).",
    details: "Associer les usagers et associations à chaque étape pour des aménagements utiles. Publier un bilan de performance public deux fois par an.",
  },
  {
    id: "m4",
    categoryId: "mobilites",
    title: "M4. Location de vélos au Pôle Gare",
    summary: "Transformer 5 places de parking en espace de location.",
    details: "Création d'un espace de 100m² au cœur du pôle multimodal en partenariat avec des loueurs privés, sans subvention publique nécessaire.",
  },
  {
    id: "m5",
    categoryId: "mobilites",
    title: "M5. Label 'Employeur Pro-Vélo'",
    summary: "Faire de la Mairie un employeur pro-vélo exemplaire (Niveau Or).",
    details: "Engagement immédiat de la municipalité dans la démarche pour faire de la collectivité un modèle de mobilité durable pour ses propres agents.",
  },
  {
    id: "m6",
    categoryId: "mobilites",
    title: "M6. Promotion dynamique",
    summary: "Communication et événements (Fête du vélo).",
    details: "Intégrer les mobilités actives dans toutes les communications municipales et organiser des événements réguliers ambitieux.",
  },
  {
    id: "m7",
    categoryId: "mobilites",
    title: "M7. Priorité à nos enfants (13 écoles)",
    summary: "Réduire drastiquement le transit devant les écoles.",
    details: "Transformation en zones de rencontre ou mise en sens unique devant les 13 écoles identifiées pour libérer de l'espace de vie et sécuriser les entrées/sorties.",
  },
  {
    id: "m8",
    categoryId: "mobilites",
    title: "M8. Le Double Sens Cyclable",
    summary: "Généralisation conformément à la loi sur les voies sens uniques à 30km/h.",
    details: "Maillage du centre-ville avec signalisation systématique des doubles sens (interventions légères : marquage/panneaux) pour éviter les détours inutiles aux cyclistes.",
  },
  {
    id: "m9",
    categoryId: "mobilites",
    title: "M9. Extension du Cœur de Ville",
    summary: "Zones piétonnes et zones de rencontre.",
    details: "Redonner de l'espace à la vie et au commerce de proximité tout en maintenant une accessibilité pour les résidents et livraisons.",
  },
  {
    id: "m10",
    categoryId: "mobilites",
    title: "M10. Visibilité aux passages piétons",
    summary: "Suppression du stationnement 5m en amont (Loi LOM).",
    details: "Mise en conformité légale : neutralisation du stationnement masquant la visibilité piétonne, remplacé par des arceaux vélos ou de la végétalisation.",
  },
  {
    id: "m11",
    categoryId: "mobilites",
    title: "M11. Cohabitation pacifiée",
    summary: "Sensibilisation et pédagogie.",
    details: "Actions pour expliquer les nouveaux aménagements (sas vélo, voie verte, etc.) et inciter à la vigilance envers les usagers vulnérables.",
  },
  {
    id: "m12",
    categoryId: "mobilites",
    title: "M12. Maillage Territorial 2032",
    summary: "Relier les 9 mairies annexes et le centre.",
    details: "Créer des itinéraires sécurisés et directs. Déployer des aménagements de transition dès le début du mandat sur les carrefours critiques pour un bénéfice immédiat.",
  },
  {
    id: "m13",
    categoryId: "mobilites",
    title: "M13. Activer le 'Réflexe Vélo'",
    summary: "Signalétique unifiée et jalonnement.",
    details: "Déployer un jalonnement systématique vers les points d'intérêt (indiquant le temps de trajet vélo) et une signalisation incitant les voitures à la prudence.",
  },
  {
    id: "m14",
    categoryId: "mobilites",
    title: "M14. Combattre l'enclavement",
    summary: "Servitudes de passage et Loi LAURE.",
    details: "Préempter des passages clés pour éviter les détours. Appliquer la Loi LAURE : chaque rénovation de voirie doit obligatoirement intégrer un aménagement cyclable.",
  },
  {
    id: "m15",
    categoryId: "mobilites",
    title: "M15. Intelligence Collective",
    summary: "Co-construction avec les associations.",
    details: "Mobiliser l'expertise gratuite des usagers locaux pour dessiner les tracés les plus efficaces et optimiser l'utilisation des deniers publics.",
  },

  // --- AGRICULTURE (Placeholder) ---
  {
    id: "a1",
    categoryId: "agriculture",
    title: "A1. Consultation : Terres Agricoles",
    summary: "Ce volet est en cours de construction.",
    details: "La préservation de la plaine agricole et l'alimentation locale sont des enjeux majeurs. Nous finalisons nos propositions. Vous avez une idée ou une expertise ? Écrivez-nous pour participer.",
    external_link: "mailto:contact@changerdere.org"
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
