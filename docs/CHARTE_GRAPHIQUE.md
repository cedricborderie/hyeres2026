# Charte graphique — Plateforme Citoyenne Hyèroise

Document pour briefs de mise en page (nouvelles rubriques, composants).  
Projet : Next.js, Tailwind CSS, police Questrial.

---

## 1. Typographie

| Usage | Classe / style | Exemple |
|-------|----------------|--------|
| **Police** | Questrial (Google Font), weight 400 | `font-sans` → `var(--font-questrial)` |
| **Titre de page / Hero** | `text-xl font-semibold text-gray-900` | Titres principaux |
| **Titre de section** | `text-xl font-bold text-gray-900` ou `text-xl font-semibold` | Sous-titres de bloc |
| **Sous-titre** | `text-xl md:text-2xl font-semibold text-primary-600` | Bandes CTA, encarts |
| **Corps** | `text-base font-medium text-gray-700 leading-[20px]` | Paragraphes |
| **Corps secondaire** | `text-base text-gray-700` ou `text-gray-600` | Descriptions, légendes |
| **Petit texte** | `text-sm text-gray-600` | Métadonnées, liens secondaires |
| **Très petit** | `text-xs text-gray-500` | Liens externes, mentions |

- Interlignes : `leading-[20px]` pour le corps, `leading-7` pour les titres courts.
- Alignement : `text-left` par défaut pour le contenu éditorial.

---

## 2. Couleurs

### 2.1 Couleur principale (turquoise)

- **Nom** : `primary`
- **Valeurs Tailwind** : `primary-50` à `primary-900`
- **Usage** : liens, boutons principaux, navigation active, accents

| Token | Hex | Usage |
|-------|-----|--------|
| primary-50 | `#e6fffd` | Fonds légers, hover nav |
| primary-500 | `#00A19A` | Turquoise de base |
| primary-600 | `#008179` | Boutons, liens, états actifs |
| primary-700 | `#006158` | Hover boutons |

- **Bouton principal** : `bg-primary-600 text-white hover:bg-primary-700`
- **Lien / nav** : `text-primary-600` ou `hover:text-primary-600 hover:bg-primary-50`

### 2.2 Couleurs par catégorie (thématiques)

Utilisées pour identifier Habitat, Mobilités, Agriculture (badges, accents, soulignés).

| Catégorie | Texte | Hover | Fond | Fond clair |
|-----------|------|------|-----|------------|
| **Habitat** | `#14B8A6` | `#0d9488` | `#14B8A6` | `#f0fdfa` (teal-50) |
| **Mobilités** | `#EC4899` | `#db2777` | `#EC4899` | `#fdf2f8` (pink-50) |
| **Agriculture** | `#b45309` | `#92400e` | `#FFE175` | `#fefce8` (yellow-50) |
| **Défaut** | `#008179` (primary-600) | `#006158` | `#008179` | `#e6fffd` (primary-50) |

- En inline : `style={{ color: "#14B8A6" }}` ou classes Tailwind/safelist (voir `tailwind.config.ts`).
- Fonction JS : `getCategoryColorClasses(categoryId)` dans `lib/utils.ts` retourne `text`, `textHover`, `bg`, `bgHover`, `border`, `bgLight`, `underline`.

### 2.3 Couleurs d’interface

| Usage | Classe |
|-------|--------|
| Fond page | `bg-white` |
| Texte principal | `text-gray-900` |
| Texte secondaire | `text-gray-700`, `text-gray-600` |
| Texte tertiaire / discret | `text-gray-500` |
| Bordures | `border-gray-200` |
| Succès / voté | `bg-green-500`, `bg-green-50`, `text-green-600` |
| Erreur | `text-red-600` |
| Bande CTA (jaune) | `bg-[#FFE175]` (ocre, hero) |

---

## 3. Layout et espacements

- **Conteneur** : `container mx-auto px-4 max-w-full` ou `max-w-7xl` pour le contenu.
- **Largeur max contenu** : `max-w-7xl` (page d’accueil, sections), `max-w-4xl` pour le texte long.
- **Espacements verticaux** :
  - Entre sections : `py-12 md:py-[46px]` ou `space-y-12`
  - Bloc interne : `mb-4`, `mb-6`, `mt-6`, `gap-8 md:gap-12`
- **Grille 2 colonnes** : `grid md:grid-cols-2 gap-8 md:gap-12`
- **Header** : `h-16 md:h-20`, `sticky top-0 z-50`, fond blanc, bordure basse.

---

## 4. Composants récurrents

### 4.1 Boutons

- **Primaire** :  
  `bg-primary-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary-700 transition-colors`
- **Secondaire (outline)** :  
  `border border-primary-600 rounded-md bg-primary-50 text-primary-600 hover:bg-primary-100 hover:text-primary-700 px-4 py-2 text-sm font-medium`
- **Neutre** :  
  `bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 px-4 py-2`
- **Succès (voté)** :  
  `bg-green-500 text-white hover:bg-green-600 rounded-md px-4 py-2 text-sm font-semibold`
- **Taille CTA** :  
  `h-14 px-8 rounded-lg text-base font-semibold` (ex. « Commencer à voter »)

### 4.2 Cartes (cards)

- **Carte standard** :  
  `rounded-lg border-2 border-gray-200 p-6 bg-white shadow-md hover:shadow-lg transition-shadow`
- **Carte “votée”** :  
  `border-green-500 bg-green-50` (même structure, couleurs changées)
- **Dialog / modal** :  
  `bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-xl`
- **Overlay** :  
  `fixed inset-0 bg-black/50 z-40 flex items-center justify-center p-4`

### 4.3 Formulaires

- **Input** :  
  `px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent`
- **Bouton submit** : même style que bouton primaire, avec `disabled:opacity-50` si chargement.

### 4.4 Navigation

- **Lien inactif** :  
  `text-gray-700 hover:bg-primary-50 hover:text-primary-600 px-4 py-2 rounded-lg transition-colors`
- **Lien actif** :  
  `bg-primary-600 text-white px-4 py-2 rounded-lg font-medium`
- **Mobile** : même styles, en `flex-col gap-2`, `py-3` pour les liens.

---

## 5. Structure de page type

```text
<main className="min-h-screen bg-white">
  <!-- Hero ou bannière si besoin -->
  <div className="container mx-auto px-4 ...">
    <h1>...</h1>
  </div>

  <!-- Contenu principal -->
  <div className="container mx-auto px-4 py-12 md:py-[46px]">
    <div className="max-w-7xl mx-auto space-y-12">
      <section className="max-w-4xl">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">...</h2>
        <p className="text-base font-medium text-gray-700 leading-[20px]">...</p>
      </section>
      <!-- autres sections -->
    </div>
  </div>
</main>
```

- Une rubrique = une ou plusieurs `<section>` avec titres `h2` et paragraphes en `text-base font-medium text-gray-700 leading-[20px]`.

---

## 6. Icônes

- **Librairie** : Lucide React (`lucide-react`).
- **Tailles** : `w-5 h-5` (nav, boutons), `w-4 h-4` (inline petit), `w-6 h-6` (mobile menu).

---

## 7. Animations

- **Framer Motion** : `motion.div` avec `initial`, `animate`, `transition` (ex. `duration: 0.6`, `delay: 0.2`).
- **Transitions CSS** : `transition-colors`, `transition-shadow`, `transition-opacity` sur boutons et cartes.

---

## 8. Fichiers de référence

| Fichier | Contenu |
|---------|---------|
| `app/globals.css` | Variables CSS, fond body |
| `tailwind.config.ts` | Couleurs `primary`, `green`, `ocre`, `fontFamily`, safelist couleurs catégories |
| `lib/colors.ts` | Palettes `brandColors` (primary, secondary, accent) |
| `lib/utils.ts` | `getCategoryColorClasses(categoryId)` |
| `app/layout.tsx` | Police Questrial, structure Header / main / Footer |
| `components/Header.tsx` | Nav, styles liens actifs/inactifs |
| `components/Footer.tsx` | Grille, newsletter, boutons partage |
| `components/ProposalCard.tsx` | Cartes, boutons, dialog |
| `app/page.tsx` | Hero, bande jaune, sections, typo |

---

## 9. Récap pour une nouvelle rubrique

1. **Conteneur** : `container mx-auto px-4 py-12 md:py-[46px]`, contenu en `max-w-7xl` ou `max-w-4xl`.
2. **Titres** : `h1` en `text-xl font-semibold text-gray-900`, `h2` en `text-xl font-bold` ou `font-semibold text-gray-900`, `mb-4` ou `mb-6`.
3. **Texte** : `text-base font-medium text-gray-700 leading-[20px]`.
4. **Boutons** : primaire `bg-primary-600 text-white hover:bg-primary-700 rounded-lg`, secondaire en outline primary.
5. **Couleurs** : privilégier `primary-600` / `primary-700` et `gray-*` ; utiliser les couleurs catégorie (Habitat / Mobilités / Agriculture) si la rubrique y est liée.
6. **Cartes** : `rounded-lg border-2 border-gray-200 p-6 bg-white shadow-md hover:shadow-lg`.
7. **Cohérence** : même Header/Footer que le reste du site, pas de nouvelle police ni de couleurs hors charte.
