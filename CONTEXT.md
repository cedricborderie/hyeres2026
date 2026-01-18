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

* **Ce qui fonctionne :** 
  - Page d'accueil (/) avec Hero, statistiques en temps réel
  - Page propositions (/propositions) avec tabs par catégorie
  - Système de vote avec localStorage (session_id unique par navigateur)
  - Page bilan (/bilan) avec récapitulatif des votes et partage social (WhatsApp, Facebook)
  - Composant ProposalCard avec dialog "En savoir plus" et animation confetti au vote
  - Header avec logo et navigation sticky
  - 5 recommandations Habitat affichées
  - 15 propositions Mobilités affichées
  - Tab Agriculture avec placeholder "Bientôt disponible" et mailto

* **Ce qui est cassé/en cours :** 
  - Vote stocké uniquement dans localStorage (pas encore synchronisé avec Supabase)
  - Statistiques en temps réel calculées depuis localStorage (à remplacer par Supabase real-time)
  - Migration SQL Supabase créée mais pas encore exécutée
  - Pas de gestion des erreurs réseau si Supabase est configuré

## 3. Architecture & Fichiers
* **Structure des dossiers :**
  ```
  app/
    page.tsx              # Page d'accueil (/)
    propositions/page.tsx # Interface de vote (/propositions)
    bilan/page.tsx        # Récapitulatif et partage (/bilan)
    layout.tsx            # Layout avec Header
    globals.css           # Styles globaux + Inter font
  
  components/
    Header.tsx            # Header sticky avec logo et navigation
    ProposalCard.tsx      # Carte de proposition avec vote et dialog
    LiveStats.tsx         # Statistiques des votes en temps réel
  
  lib/
    data.ts               # Données officielles (categories + proposals)
    utils.ts              # Utilitaires (session_id, gestion votes localStorage)
    colors.ts             # Configuration couleurs (documentation)
  
  supabase/
    migrations/
      001_initial_schema.sql # Script SQL pour créer les tables
  ```

* **Décisions d'architecture récentes :**
  - Passage de données mock à données officielles avec nouvelle structure
  - Utilisation de `categoryId` (camelCase) au lieu de `category_id` (snake_case)
  - Categories utilisent maintenant `id`, `title`, `description`, `color` (classes Tailwind)
  - Proposals utilisent `categoryId`, `summary`, `details`
  - Couleurs primaires alignées sur le logo teal-vert (#4CA79F)
  - Catégories utilisent maintenant des classes Tailwind directes (`bg-emerald-700`, `bg-pink-500`, `bg-yellow-600`)

## 4. Prochaines étapes (Next Steps)
* [ ] Intégrer Supabase : configuration des variables d'environnement
* [ ] Exécuter la migration SQL `001_initial_schema.sql` sur Supabase
* [ ] Remplacer le stockage localStorage par synchronisation Supabase pour les votes
* [ ] Implémenter les subscriptions Supabase pour les statistiques en temps réel
* [ ] Ajouter la gestion d'erreurs pour les appels Supabase
* [ ] Tester le flux complet : vote → Supabase → mise à jour en temps réel
* [ ] Déployer l'application (Vercel recommandé pour Next.js)

## 5. Journal des changements (Log)
* 2025-01-18: Intégration des données officielles (Cursor) - Remplacement des données mock par le contenu officiel du manifeste, mise à jour de la structure de données
* 2025-01-18: Ajout du logo et adaptation des couleurs (Cursor) - Logo "Plateforme Citoyenne Hyèroise", couleurs primary adaptées au teal-vert (#4CA79F)
* 2025-01-18: Création du Header avec navigation (Cursor) - Header sticky avec logo, bouton retour accueil, navigation active
* 2025-01-18: Initialisation du projet (Cursor) - Scaffold Next.js 14, configuration Tailwind, création des pages et composants de base
