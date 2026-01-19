# Project Context & State

## 1. Vue d'ensemble (Overview)
* **But du projet :** Plateforme citoyenne permettant aux habitants d'Hyères de voter pour des propositions politiques dans 3 catégories (Habitat, Mobilités, Agriculture) afin d'influencer les candidats aux élections municipales.
* **Stack technique :** Next.js 14 (App Router), TypeScript, Tailwind CSS, Framer Motion, canvas-confetti, Lucide React, Supabase (PostgreSQL - à intégrer)
* **Règles clés :** 
  - Pas de connexion requise (vote anonyme via session_id localStorage)
  - Mobile-first design
  - TypeScript strict activé
  - Utilisation de Tailwind CSS uniquement (pas de CSS in JS)
  - Optimistic UI pour les votes

## 2. État Actuel (Current State)
* **Dernière modification :** 
  - Intégration des données officielles de l'association dans `lib/data.ts` (5 recommandations Habitat, 15 propositions Mobilités, 1 placeholder Agriculture)
  - Remplacement des données mock par le contenu officiel du manifeste
  - Adaptation de la structure de données : `categoryId` au lieu de `category_id`, `summary`/`details` au lieu de `description`/`content_text`
  - Mise à jour des composants pour utiliser la nouvelle structure
  - Ajout du logo "Plateforme Citoyenne Hyèroise" et adaptation des couleurs au teal-vert (#4CA79F)
  - **Intégration Supabase complète** : Server Actions pour les votes (`app/actions/vote.ts`)
  - **Middleware Next.js** : Génération automatique de `session_id` via cookies HttpOnly sécurisés
  - **Migrations Supabase** : 3 migrations créées (schéma initial, modification IDs en VARCHAR, insertion des propositions)
  - **Section associations** : Ajout de 5 logos des associations partenaires sur la page d'accueil
  - **Ajustements CSS** : Modifications de typographie et espacements sur la page d'accueil

* **Ce qui fonctionne :** 
  - Page d'accueil (/) avec Hero, statistiques en temps réel, drapeau SVG, section associations avec logos
  - Page propositions (/propositions) avec tabs par catégorie
  - **Système de vote hybride** : 
    - Cookies HttpOnly sécurisés pour le `session_id` (générés automatiquement par middleware)
    - Server Actions pour soumettre les votes à Supabase (`submitVote`, `hasVotedForProposal`)
    - Fallback localStorage si Supabase n'est pas configuré
  - Page bilan (/bilan) avec récapitulatif des votes et partage social (WhatsApp, Facebook)
  - Composant ProposalCard avec dialog "En savoir plus" et animation confetti au vote
  - Header avec logo et navigation sticky
  - 5 recommandations Habitat affichées
  - 15 propositions Mobilités affichées
  - Tab Agriculture avec placeholder "Bientôt disponible" et mailto
  - **Gestion d'erreurs** : Messages d'erreur détaillés pour les votes (déjà voté, proposition introuvable, etc.)
  - **Revalidation automatique** : Les pages se mettent à jour après un vote via `revalidatePath`

* **Ce qui est cassé/en cours :** 
  - Statistiques en temps réel : Actuellement calculées depuis localStorage ou Supabase, mais pas de subscriptions real-time encore implémentées
  - Limitation par IP : Documentée dans `docs/IP_LIMITATION.md` mais pas encore implémentée (nécessite Edge Functions Supabase)
  - Les migrations Supabase doivent être exécutées manuellement sur l'instance Supabase
  - Page d'erreur (`app/error.tsx`) créée mais pas encore testée en production

## 3. Architecture & Fichiers
* **Structure des dossiers :**
  ```
  app/
    page.tsx              # Page d'accueil (/) - Hero, drapeau, associations, contenu
    propositions/page.tsx # Interface de vote (/propositions)
    bilan/page.tsx        # Récapitulatif et partage (/bilan)
    layout.tsx            # Layout avec Header
    globals.css           # Styles globaux + Inter font
    error.tsx             # Page d'erreur globale
    actions/
      vote.ts             # Server Actions pour votes Supabase (submitVote, hasVotedForProposal)
  
  components/
    Header.tsx            # Header sticky avec logo et navigation
    ProposalCard.tsx      # Carte de proposition avec vote et dialog
    LiveStats.tsx         # Statistiques des votes en temps réel
  
  lib/
    data.ts               # Données officielles (categories + proposals)
    utils.ts              # Utilitaires (session_id, gestion votes localStorage - fallback)
    colors.ts             # Configuration couleurs (documentation)
    supabase/
      server.ts           # Client Supabase serveur (server-only)
  
  middleware.ts           # Génération automatique de session_id via cookies HttpOnly
  
  public/
    drapeau.svg           # Drapeau de la plateforme (renommé de Drapeau.svg)
    logo.svg              # Logo principal
    logos/                 # Logos des associations partenaires
      cil-des-rougieres.png
      mobilites-presquile-giens.png
      maltae.png
      changer-d-ere.png
      ecolieu-plan-du-pont.png
  
  supabase/
    migrations/
      001_initial_schema.sql              # Schéma initial (tables, triggers, fonctions)
      002_modify_proposal_ids_to_string.sql # Modification IDs en VARCHAR(50)
      003_insert_proposals.sql             # Insertion des 21 propositions
  
  docs/
    IP_LIMITATION.md      # Documentation pour limitation par IP (non implémentée)
  ```

* **Décisions d'architecture récentes :**
  - Passage de données mock à données officielles avec nouvelle structure
  - Utilisation de `categoryId` (camelCase) au lieu de `category_id` (snake_case)
  - Categories utilisent maintenant `id`, `title`, `description`, `color` (classes Tailwind)
  - Proposals utilisent `categoryId`, `summary`, `details`
  - Couleurs primaires alignées sur le logo teal-vert (#4CA79F)
  - Catégories utilisent maintenant des classes Tailwind directes (`bg-emerald-700`, `bg-pink-500`, `bg-yellow-600`)
  - **Système de session sécurisé** : Migration de localStorage vers cookies HttpOnly gérés par middleware Next.js
  - **Server Actions** : Votes gérés côté serveur pour sécurité et validation
  - **IDs de propositions** : Changement de UUID vers VARCHAR(50) pour correspondre aux IDs dans `lib/data.ts` (h1, m1, a1, etc.)
  - **Fallback gracieux** : L'application fonctionne même si Supabase n'est pas configuré (utilise localStorage)
  - **Gestion d'erreurs robuste** : Messages d'erreur spécifiques pour chaque cas (déjà voté, proposition introuvable, etc.)

## 4. Prochaines étapes (Next Steps)
* [x] Intégrer Supabase : configuration des variables d'environnement
* [x] Créer les migrations SQL (001, 002, 003)
* [ ] **Exécuter les migrations SQL sur Supabase** (à faire manuellement sur l'instance Supabase)
* [x] Remplacer le stockage localStorage par synchronisation Supabase pour les votes (Server Actions implémentées)
* [x] Ajouter la gestion d'erreurs pour les appels Supabase
* [ ] Implémenter les subscriptions Supabase pour les statistiques en temps réel (remplacer polling par real-time)
* [ ] Tester le flux complet en production : vote → Supabase → mise à jour en temps réel
* [ ] Implémenter limitation par IP (voir `docs/IP_LIMITATION.md` - nécessite Edge Functions Supabase)
* [ ] Déployer l'application (Vercel recommandé pour Next.js)
* [ ] Optimiser les images des logos (compression, format WebP si possible)

## 5. Journal des changements (Log)
* 2025-01-18: Ajout section associations et logos (Cursor) - Section "À l'initiative d'associations Hyèroises indépendantes" avec 5 logos en pleine largeur sur la page d'accueil
* 2025-01-18: Ajustements CSS page d'accueil (Cursor) - Modifications typographie (tailles, poids), espacements, ajout flex sur éléments
* 2025-01-18: Intégration Supabase complète (Cursor) - Server Actions pour votes, middleware pour cookies HttpOnly, client Supabase serveur
* 2025-01-18: Migrations Supabase (Cursor) - Création de 3 migrations : schéma initial, modification IDs VARCHAR, insertion propositions
* 2025-01-18: Renommage drapeau.svg (Cursor) - Correction casse du fichier (Drapeau.svg → drapeau.svg) pour compatibilité production
* 2025-01-18: Intégration des données officielles (Cursor) - Remplacement des données mock par le contenu officiel du manifeste, mise à jour de la structure de données
* 2025-01-18: Ajout du logo et adaptation des couleurs (Cursor) - Logo "Plateforme Citoyenne Hyèroise", couleurs primary adaptées au teal-vert (#4CA79F)
* 2025-01-18: Création du Header avec navigation (Cursor) - Header sticky avec logo, bouton retour accueil, navigation active
* 2025-01-18: Initialisation du projet (Cursor) - Scaffold Next.js 14, configuration Tailwind, création des pages et composants de base

## 6. Détails Techniques Importants

### Système de Vote
* **Session ID** : Généré automatiquement par middleware Next.js, stocké dans cookie HttpOnly sécurisé
* **Server Actions** : `app/actions/vote.ts` contient `submitVote()` et `hasVotedForProposal()`
* **Sécurité** : Session ID lu depuis cookies serveur uniquement (pas manipulable côté client)
* **Fallback** : Si Supabase non configuré, utilise localStorage (via `lib/utils.ts`)
* **Contraintes** : Un vote par `session_id` + `proposal_id` (contrainte unique Supabase)

### Base de Données Supabase
* **Structure** : 3 tables principales (`categories`, `proposals`, `votes`)
* **IDs Propositions** : VARCHAR(50) pour correspondre à `lib/data.ts` (h1, m1, a1, etc.)
* **Triggers** : Mise à jour automatique de `vote_count` via triggers PostgreSQL
* **Migrations** : 3 fichiers SQL à exécuter dans l'ordre (001, 002, 003)
* **Variables d'environnement** : `NEXT_PUBLIC_SUPABASE_URL` et `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Assets & Images
* **Drapeau** : `/public/drapeau.svg` (renommé pour compatibilité casse)
* **Logos associations** : `/public/logos/*.png` (5 fichiers PNG)
* **Logo principal** : `/public/logo.svg`
* **Optimisation** : Utilisation de `next/image` pour toutes les images

### Limitations Actuelles
* **Pas de limitation IP** : Documentée mais non implémentée (nécessite Edge Functions)
* **Pas de real-time** : Statistiques mises à jour via revalidation, pas de subscriptions WebSocket
* **Pas de cache** : Pas de stratégie de cache pour les données Supabase

### Configuration Requise
* **Variables d'environnement** (`.env.local`) :
  ```
  NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
  NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
  ```
* **Sans Supabase** : L'application fonctionne en mode fallback avec localStorage uniquement
* **Avec Supabase** : Les votes sont synchronisés en base de données, les statistiques sont calculées depuis Supabase

### Notes pour Gemini/AI
* **Langue** : Tous les commentaires et messages utilisateur sont en français
* **Conventions** : camelCase pour variables JS/TS, snake_case pour base de données
* **Sécurité** : Session ID toujours lu depuis cookies serveur, jamais depuis client
* **TypeScript strict** : Mode strict activé, tous les types doivent être explicites
* **Tailwind uniquement** : Pas de CSS-in-JS, utiliser uniquement les classes Tailwind
* **Mobile-first** : Tous les designs doivent être pensés mobile d'abord
