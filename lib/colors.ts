/**
 * Configuration des couleurs basées sur le logo
 * 
 * Pour adapter les couleurs selon votre logo :
 * 1. Identifiez les couleurs principales de votre logo (hex codes)
 * 2. Remplacez les valeurs ci-dessous
 * 3. Les couleurs seront automatiquement appliquées dans toute l'application
 */

export const brandColors = {
  // Couleur principale - #00A19A (turquoise)
  primary: {
    50: "#e6fffd",
    100: "#ccfff9",
    200: "#99fff3",
    300: "#66ffed",
    400: "#33ffe7",
    500: "#00A19A", // Couleur principale turquoise
    600: "#008179",
    700: "#006158",
    800: "#004137",
    900: "#002116",
  },
  
  // Couleur secondaire (si votre logo a une deuxième couleur)
  secondary: {
    50: "#f0fdf4",
    100: "#dcfce7",
    200: "#bbf7d0",
    300: "#86efac",
    400: "#4ade80",
    500: "#22c55e", // Couleur secondaire - À REMPLACER si nécessaire
    600: "#16a34a",
    700: "#15803d",
    800: "#166534",
    900: "#14532d",
  },
  
  // Couleur accent (pour les éléments spéciaux comme Agriculture)
  accent: {
    50: "#fefce8",
    100: "#fef9c3",
    200: "#fef08a",
    300: "#fde047",
    400: "#facc15",
    500: "#eab308", // Couleur accent - À REMPLACER si nécessaire
    600: "#ca8a04",
    700: "#a16207",
    800: "#854d0e",
    900: "#713f12",
  },
};

/**
 * Exemple d'utilisation avec des couleurs personnalisées :
 * 
 * Si votre logo utilise #FF6B35 (orange) comme couleur principale :
 * 
 * primary: {
 *   500: "#FF6B35",
 *   600: "#e55a2b",
 *   700: "#cc4921",
 *   // ... etc
 * }
 * 
 * Utilisez un outil comme https://tailwindcss.com/docs/customizing-colors
 * pour générer la palette complète à partir de votre couleur de base.
 */
