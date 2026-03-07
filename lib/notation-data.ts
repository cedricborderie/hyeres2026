/**
 * Données des tableaux de notation détaillée (Urbanisme, Mobilités, Agriculture).
 * Couleurs : c1 (3.0), c2 (2.5), c3 (2.0), c4 (0 < v ≤ 1.5), c5 (rejet/0), c6 (pas de réponse).
 */

export type CandidateKey =
  | "Cornileau"
  | "Bernardini"
  | "Giran"
  | "Massuco"
  | "Moulin"
  | "Tomatis";

export type NotationCandidate = {
  key: CandidateKey;
  label: string;
};

export type NotationRow = {
  mesure: string;
} & Partial<Record<CandidateKey, number>>;

export type NotationTheme = {
  id: "habitat" | "mobilites" | "agriculture";
  title: string;
  /** Partie du titre à colorer (ex. "Habitat", "Vélo", "Alimentation") */
  titleAccent: string;
  candidates: NotationCandidate[];
  rows: NotationRow[];
};

export const notationCandidates: NotationCandidate[] = [
  { key: "Cornileau", label: "F. Cornileau" },
  { key: "Bernardini", label: "V. Bernardini" },
  { key: "Giran", label: "J.P. Giran" },
  { key: "Massuco", label: "N. Massuco" },
  { key: "Moulin", label: "C. Moulin" },
  { key: "Tomatis", label: "J.M. Eynard-Tomatis" },
];

/** Cellules "pas de réponse" (affichées en gris c6). Clé = "CandidateKey|Code" (ex. "Giran|H4"). */
export const noResponseSet = new Set<string>([
  "Giran|H4", "Giran|H7", "Giran|H8", "Giran|H9", "Giran|H10",
  "Giran|H11", "Giran|H12", "Giran|H13", "Giran|H14", "Giran|H15",
  "Giran|H16", "Giran|H19",
  "Giran|M1", "Giran|M2", "Giran|M3", "Giran|M4", "Giran|M5",
  "Giran|M7", "Giran|M8", "Giran|M9", "Giran|M10", "Giran|M11",
  "Giran|M13", "Giran|M14",
  "Giran|A1", "Giran|A2", "Giran|A5", "Giran|A6", "Giran|A7",
  "Giran|A8", "Giran|A9", "Giran|A10", "Giran|A12", "Giran|A13",
  "Giran|A14", "Giran|A15", "Giran|A18", "Giran|A19", "Giran|A20",
  "Giran|A21", "Giran|A22",
  "Tomatis|H8", "Tomatis|H18",
  "Tomatis|M1", "Tomatis|M3", "Tomatis|M5", "Tomatis|M6", "Tomatis|M8",
  "Tomatis|A10", "Tomatis|A11", "Tomatis|A13", "Tomatis|A16", "Tomatis|A17",
]);

export const notationColors = {
  c1: "#1a3a6b",
  c2: "#0d7070",
  c3: "#14b8a6",
  c4: "#2dd4bf",
  c5: "#d64f82",
  c6: "#d1d5db",
} as const;

function mesureCode(mesure: string): string {
  const m = mesure.match(/^([A-Z]\d+)/);
  return m ? m[1] : "";
}

export function cellColor(
  val: number | null | undefined,
  candidateKey: CandidateKey,
  mesure: string
): string {
  if (val === null || val === undefined || Number.isNaN(val)) return notationColors.c6;
  if (val === 3.0) return notationColors.c1;
  if (val === 2.5) return notationColors.c2;
  if (val === 2.0) return notationColors.c3;
  if (val > 0 && val <= 1.5) return notationColors.c4;
  const code = mesureCode(mesure);
  if (noResponseSet.has(candidateKey + "|" + code)) return notationColors.c6;
  return notationColors.c5;
}

const habitatRows: NotationRow[] = [
  { mesure: "H1. Diminuer la constructibilité", Cornileau: 3.0, Bernardini: 1.5, Giran: 3.0, Massuco: 3.0, Moulin: 2.5, Tomatis: 2.0 },
  { mesure: "H2. Maîtriser les densités", Cornileau: 3.0, Bernardini: 2.5, Giran: 3.0, Massuco: 3.0, Moulin: 1.5, Tomatis: 2.0 },
  { mesure: "H3. Préserver les espaces agricoles", Cornileau: 2.0, Bernardini: 2.5, Giran: 2.5, Massuco: 3.0, Moulin: 2.5, Tomatis: 1.0 },
  { mesure: "H4. Préserver le patrimoine bâti", Cornileau: 2.0, Bernardini: 3.0, Giran: 0.0, Massuco: 3.0, Moulin: 1.5, Tomatis: 1.5 },
  { mesure: "H5. Appliquer la Loi Littoral", Cornileau: 3.0, Bernardini: 2.0, Giran: 3.0, Massuco: 3.0, Moulin: 3.0, Tomatis: 1.5 },
  { mesure: "H6. Sauvegarder les espaces sensibles", Cornileau: 2.0, Bernardini: 2.0, Giran: 3.0, Massuco: 3.0, Moulin: 1.5, Tomatis: 1.5 },
  { mesure: "H7. Limiter le trafic vers la presqu'île", Cornileau: 1.5, Bernardini: 2.5, Giran: 0.0, Massuco: 3.0, Moulin: 2.0, Tomatis: 2.5 },
  { mesure: "H8. Zéro construction en zone à risque", Cornileau: 3.0, Bernardini: 1.5, Giran: 0.0, Massuco: 3.0, Moulin: 3.0, Tomatis: 0.0 },
  { mesure: "H9. Accélérer la révision du PPRI", Cornileau: 1.5, Bernardini: 3.0, Giran: 0.0, Massuco: 2.0, Moulin: 3.0, Tomatis: 1.5 },
  { mesure: "H10. Anticiper le retrait du trait de côte", Cornileau: 3.0, Bernardini: 2.5, Giran: 0.0, Massuco: 3.0, Moulin: 2.5, Tomatis: 2.0 },
  { mesure: "H11. Projets pilotes de relocalisation", Cornileau: 1.0, Bernardini: 0.0, Giran: 0.0, Massuco: 2.0, Moulin: 1.0, Tomatis: 1.5 },
  { mesure: "H12. Réduire les îlots de chaleur urbains", Cornileau: 2.0, Bernardini: 3.0, Giran: 0.0, Massuco: 3.0, Moulin: 1.5, Tomatis: 2.5 },
  { mesure: "H13. Rénover les bâtiments publics", Cornileau: 2.0, Bernardini: 3.0, Giran: 0.0, Massuco: 2.0, Moulin: 2.0, Tomatis: 1.5 },
  { mesure: "H14. Taxe Logements Vacants (TLV)", Cornileau: 1.0, Bernardini: 1.5, Giran: 0.0, Massuco: 2.0, Moulin: 3.0, Tomatis: 3.0 },
  { mesure: "H15. Opération Réhabilitation", Cornileau: 1.5, Bernardini: 2.5, Giran: 0.0, Massuco: 2.0, Moulin: 2.5, Tomatis: 2.0 },
  { mesure: "H16. Réinvestir les amendes SRU", Cornileau: 1.0, Bernardini: 0.0, Giran: 0.0, Massuco: 3.0, Moulin: 2.0, Tomatis: 2.0 },
  { mesure: "H17. Hausse Taxe Résidences Secondaires", Cornileau: 2.0, Bernardini: 0.0, Giran: 0.0, Massuco: 1.5, Moulin: 3.0, Tomatis: 1.5 },
  { mesure: "H18. Coopérative Foncière (BRS)", Cornileau: 0.0, Bernardini: 2.0, Giran: 2.5, Massuco: 2.0, Moulin: 3.0, Tomatis: 0.0 },
  { mesure: "H19. Renouvellement Val des Rougières", Cornileau: 2.0, Bernardini: 1.5, Giran: 0.0, Massuco: 3.0, Moulin: 3.0, Tomatis: 2.0 },
  { mesure: "H20. Hébergement Saisonniers & Jeunes", Cornileau: 1.0, Bernardini: 2.0, Giran: 2.5, Massuco: 2.0, Moulin: 2.0, Tomatis: 2.5 },
];

const mobilitesRows: NotationRow[] = [
  { mesure: "M1. Responsable Vélo", Cornileau: 3.0, Bernardini: 3.0, Giran: 0.0, Massuco: 3.0, Moulin: 3.0, Tomatis: 0.0 },
  { mesure: "M2. Partager les compétences", Cornileau: 3.0, Bernardini: 2.5, Giran: 0.0, Massuco: 3.0, Moulin: 2.0, Tomatis: 2.5 },
  { mesure: "M3. Intelligence Collective", Cornileau: 2.0, Bernardini: 2.5, Giran: 0.0, Massuco: 3.0, Moulin: 3.0, Tomatis: 0.0 },
  { mesure: "M4. Location Vélo Gare", Cornileau: 2.5, Bernardini: 2.5, Giran: 0.0, Massuco: 3.0, Moulin: 1.5, Tomatis: 2.5 },
  { mesure: "M5. Employeur Pro-Vélo", Cornileau: 3.0, Bernardini: 3.0, Giran: 0.0, Massuco: 3.0, Moulin: 2.5, Tomatis: 0.0 },
  { mesure: "M6. Promotion dynamique", Cornileau: 3.0, Bernardini: 3.0, Giran: 1.5, Massuco: 3.0, Moulin: 3.0, Tomatis: 0.0 },
  { mesure: "M7. Priorité enfants (13 écoles)", Cornileau: 2.5, Bernardini: 1.5, Giran: 0.0, Massuco: 2.0, Moulin: 2.5, Tomatis: 1.0 },
  { mesure: "M8. Double Sens Cyclable", Cornileau: 2.0, Bernardini: 2.0, Giran: 0.0, Massuco: 3.0, Moulin: 3.0, Tomatis: 0.0 },
  { mesure: "M9. Extension Cœur de Ville", Cornileau: 2.5, Bernardini: 1.0, Giran: 0.0, Massuco: 1.5, Moulin: 2.5, Tomatis: 0.0 },
  { mesure: "M10. Visibilité Passages Piétons", Cornileau: 3.0, Bernardini: 3.0, Giran: 0.0, Massuco: 3.0, Moulin: 3.0, Tomatis: 0.0 },
  { mesure: "M11. Cohabitation Pacifiée", Cornileau: 3.0, Bernardini: 3.0, Giran: 0.0, Massuco: 3.0, Moulin: 3.0, Tomatis: 2.0 },
  { mesure: "M12. Maillage Territorial", Cornileau: 2.0, Bernardini: 3.0, Giran: 1.5, Massuco: 2.0, Moulin: 2.5, Tomatis: 2.0 },
  { mesure: "M13. Activer le Réflexe Vélo", Cornileau: 1.5, Bernardini: 3.0, Giran: 0.0, Massuco: 3.0, Moulin: 3.0, Tomatis: 2.0 },
  { mesure: "M14. Combattre l'enclavement", Cornileau: 1.5, Bernardini: 3.0, Giran: 0.0, Massuco: 3.0, Moulin: 3.0, Tomatis: 1.5 },
];

const agricultureRows: NotationRow[] = [
  { mesure: "A1. Élu dédié & commission dédiée", Cornileau: 2.5, Bernardini: 2.0, Giran: 0.0, Massuco: 2.0, Moulin: 2.5, Tomatis: 1.5 },
  { mesure: "A2. Commission citoyenne Agricole", Cornileau: 1.5, Bernardini: 2.0, Giran: 0.0, Massuco: 2.0, Moulin: 1.5, Tomatis: 1.5 },
  { mesure: "A3. Sauvegarder les terres (ZAP)", Cornileau: 2.0, Bernardini: 2.5, Giran: 2.0, Massuco: 2.0, Moulin: 2.0, Tomatis: 2.0 },
  { mesure: "A4. Mobiliser les terres privées", Cornileau: 1.5, Bernardini: 0.0, Giran: 1.5, Massuco: 2.0, Moulin: 2.0, Tomatis: 1.5 },
  { mesure: "A5. Espaces-test agricoles", Cornileau: 2.0, Bernardini: 1.5, Giran: 0.0, Massuco: 2.0, Moulin: 2.0, Tomatis: 2.0 },
  { mesure: "A6. Foncière Agricole (SCIC)", Cornileau: 2.5, Bernardini: 0.0, Giran: 0.0, Massuco: 1.5, Moulin: 1.5, Tomatis: 2.0 },
  { mesure: "A7. Habitat léger agricole", Cornileau: 1.5, Bernardini: 0.0, Giran: 0.0, Massuco: 1.5, Moulin: 2.0, Tomatis: 1.5 },
  { mesure: "A8. Jardins et vergers urbains", Cornileau: 2.5, Bernardini: 2.5, Giran: 0.0, Massuco: 2.0, Moulin: 2.0, Tomatis: 2.0 },
  { mesure: "A9. Ferme Municipale Pédagogique", Cornileau: 2.0, Bernardini: 0.0, Giran: 0.0, Massuco: 2.5, Moulin: 2.5, Tomatis: 0.0 },
  { mesure: "A10. Sécurité Sociale de l'Alimentation", Cornileau: 1.5, Bernardini: 1.5, Giran: 0.0, Massuco: 1.0, Moulin: 2.5, Tomatis: 0.0 },
  { mesure: "A11. Maison de l'Alimentation", Cornileau: 2.5, Bernardini: 1.5, Giran: 2.0, Massuco: 2.0, Moulin: 2.5, Tomatis: 0.0 },
  { mesure: "A12. Programme Pédagogique", Cornileau: 2.0, Bernardini: 2.0, Giran: 0.0, Massuco: 2.0, Moulin: 1.5, Tomatis: 1.5 },
  { mesure: "A13. Marché Paysan Festif", Cornileau: 1.0, Bernardini: 2.0, Giran: 0.0, Massuco: 1.0, Moulin: 1.5, Tomatis: 0.0 },
  { mesure: "A14. Audit Participatif Cantines", Cornileau: 1.5, Bernardini: 2.0, Giran: 0.0, Massuco: 2.5, Moulin: 2.0, Tomatis: 1.0 },
  { mesure: "A15. Contrats Producteurs Locaux", Cornileau: 2.0, Bernardini: 2.0, Giran: 0.0, Massuco: 2.0, Moulin: 2.0, Tomatis: 2.0 },
  { mesure: "A16. Plus de menus végétariens", Cornileau: 1.0, Bernardini: 0.0, Giran: 2.0, Massuco: 2.0, Moulin: 1.5, Tomatis: 0.0 },
  { mesure: "A17. Formation Cuisine Durable", Cornileau: 1.5, Bernardini: 1.5, Giran: 0.0, Massuco: 2.0, Moulin: 1.5, Tomatis: 0.0 },
  { mesure: "A18. Stop Ultra-transformé", Cornileau: 1.5, Bernardini: 2.0, Giran: 0.0, Massuco: 2.0, Moulin: 2.0, Tomatis: 1.5 },
  { mesure: "A19. Stop Plastique", Cornileau: 1.5, Bernardini: 2.0, Giran: 0.0, Massuco: 2.0, Moulin: 2.0, Tomatis: 1.5 },
  { mesure: "A20. Portions sur-mesure", Cornileau: 1.5, Bernardini: 0.0, Giran: 0.0, Massuco: 2.0, Moulin: 2.0, Tomatis: 1.5 },
  { mesure: "A21. Compostage Systématique", Cornileau: 2.5, Bernardini: 0.0, Giran: 0.0, Massuco: 2.5, Moulin: 2.0, Tomatis: 1.5 },
  { mesure: "A22. Projet Alimentaire Territorial", Cornileau: 1.5, Bernardini: 1.5, Giran: 0.0, Massuco: 2.0, Moulin: 2.0, Tomatis: 2.0 },
];

export const notationThemes: NotationTheme[] = [
  { id: "habitat", title: "Urbanisme & Habitat", titleAccent: "Habitat", candidates: notationCandidates, rows: habitatRows },
  { id: "mobilites", title: "Mobilités & Vélo", titleAccent: "Vélo", candidates: notationCandidates, rows: mobilitesRows },
  { id: "agriculture", title: "Agriculture & Alimentation", titleAccent: "Alimentation", candidates: notationCandidates, rows: agricultureRows },
];

export function getNotationByThemeId(
  themeId: "habitat" | "mobilites" | "agriculture"
): NotationTheme | undefined {
  return notationThemes.find((t) => t.id === themeId);
}

const legendItems = [
  { color: "c1" as const, text: "La mesure est pleinement appropriée, avec des modalités de mise en œuvre et de faisabilité déjà identifiées." },
  { color: "c2" as const, text: "La liste valide la mesure et l'intègre à son socle programmatique." },
  { color: "c3" as const, text: "L'intention est partagée mais le périmètre reste restreint." },
  { color: "c4" as const, text: "Le candidat ne se positionne pas sur la mesure en question." },
  { color: "c5" as const, text: "La mesure est rejetée ou absente des priorités." },
  { color: "c6" as const, text: "Pas de réponse." },
];

export { legendItems };
