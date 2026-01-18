# Hyères 2026 - Plateforme Citoyenne

Plateforme d'engagement citoyen pour les élections municipales d'Hyères, France.

## 🎯 Objectif

Permettre aux citoyens de parcourir des propositions politiques dans 3 catégories (Habitat, Mobilité, Agriculture) et voter pour celles qu'ils soutiennent afin d'influencer les candidats.

**Principes clés :**
- **Faible friction** : Pas de connexion requise
- **Haute partageabilité** : Partage social intégré

## 🛠️ Stack Technique

- **Framework** : Next.js 14 (App Router) avec TypeScript
- **Styling** : Tailwind CSS
- **Composants** : Shadcn/UI (cards, tabs, buttons, dialogs, toast)
- **Icônes** : Lucide React
- **Base de données** : Supabase (PostgreSQL)
- **Animations** : Framer Motion + canvas-confetti

## 🚀 Installation

1. Installer les dépendances :
```bash
npm install
```

2. (Optionnel) Configurer Supabase :
   - Créer un projet sur [Supabase](https://supabase.com)
   - Copier les variables d'environnement dans `.env.local`
   - Exécuter la migration SQL (`supabase/migrations/001_initial_schema.sql`)

3. Lancer le serveur de développement :
```bash
npm run dev
```

4. Ouvrir [http://localhost:3000](http://localhost:3000) dans votre navigateur.

## 📁 Structure du Projet

```
├── app/
│   ├── page.tsx              # Page d'accueil (/)
│   ├── propositions/
│   │   └── page.tsx          # Interface de vote (/propositions)
│   └── bilan/
│       └── page.tsx          # Récapitulatif et partage (/bilan)
├── components/
│   ├── ProposalCard.tsx      # Carte de proposition avec vote
│   └── LiveStats.tsx         # Statistiques en temps réel
├── lib/
│   ├── data.ts               # Données mock (à remplacer par Supabase)
│   └── utils.ts              # Utilitaires (session_id, votes)
└── supabase/
    └── migrations/
        └── 001_initial_schema.sql  # Script SQL pour Supabase
```

## 🗄️ Schéma de Base de Données

### Tables

1. **categories** : Catégories (Habitat, Mobilité, Agriculture)
2. **proposals** : Propositions politiques avec détails
3. **votes** : Votes anonymes liés par `session_id` (localStorage)

### Contraintes

- Un `session_id` peut voter une seule fois par `proposal_id`
- Les `vote_count` sont automatiquement mis à jour via des triggers

## ✨ Fonctionnalités

### Page d'accueil (/)
- Section Hero avec titre "Hyères 2026"
- Statistiques en temps réel des votes
- Call-to-action "Commencer à voter"

### Interface de vote (/propositions)
- Navigation par onglets entre les catégories
- Cartes de propositions avec description
- Bouton "Je soutiens" avec confetti
- Dialog "En savoir plus" avec contenu détaillé
- Tab Agriculture : "Bientôt disponible" avec lien mailto

### Bilan & Partage (/bilan)
- Récapitulatif des propositions soutenues
- Partage WhatsApp et Facebook

## 🎨 Design

- **Approche** : Mobile-first
- **Couleurs** : Bleus institutionnels, Verts, Ocre
- **Police** : Inter (Google Fonts)

## 📝 Notes de Développement

### Données Mock

Le fichier `lib/data.ts` contient des données mock pour tester l'UI sans connexion à la base de données. Pour la production :

1. Connecter à Supabase
2. Remplacer les imports de `lib/data.ts` par des appels API
3. Utiliser les subscriptions Supabase pour les mises à jour en temps réel

### Session ID

Le `session_id` est généré automatiquement et stocké dans `localStorage`. C'est un UUID unique qui identifie anonymement l'utilisateur pour éviter les votes multiples.

### Votes

Actuellement, les votes sont stockés dans `localStorage`. Pour la production :
- Synchroniser avec Supabase lors du vote
- Utiliser les subscriptions Supabase pour les statistiques en temps réel

## 📄 Licence

Ce projet est développé pour les élections municipales d'Hyères 2026.
