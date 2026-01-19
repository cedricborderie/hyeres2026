# Guide de Déploiement en Production

Ce guide vous accompagne étape par étape pour déployer la Plateforme Citoyenne Hyèroise en production.

## 📋 Checklist Pré-Déploiement

### 1. Vérifications Locales

- [ ] Tester l'application localement : `npm run dev`
- [ ] Vérifier que le build fonctionne : `npm run build`
- [ ] Tester que toutes les pages fonctionnent :
  - [ ] Page d'accueil (`/`)
  - [ ] Page Propositions (`/propositions`)
  - [ ] Page Résultats (`/resultats`)
  - [ ] Page Mes Priorités (`/bilan`)
- [ ] Vérifier que les votes fonctionnent
- [ ] Vérifier que la newsletter fonctionne
- [ ] Vérifier que les liens sociaux fonctionnent

### 2. Préparation Git

```bash
# Vérifier l'état des fichiers
git status

# Ajouter tous les fichiers modifiés
git add .

# Créer un commit
git commit -m "Préparation déploiement production"

# Pousser vers le dépôt
git push origin main
```

## 🗄️ Configuration Supabase

### 1. Créer un Projet Supabase de Production

1. Aller sur [supabase.com](https://supabase.com)
2. Créer un nouveau projet (ou utiliser un projet existant)
3. Noter l'URL du projet et la clé API anonyme

### 2. Exécuter les Migrations SQL

**IMPORTANT** : Exécuter les migrations dans l'ordre exact suivant :

1. **Migration 001** : `supabase/migrations/001_initial_schema.sql`
   - Crée les tables de base (categories, proposals, votes)
   - Crée les triggers et fonctions

2. **Migration 002** : `supabase/migrations/002_modify_proposal_ids_to_string.sql`
   - Modifie les IDs des propositions de UUID vers VARCHAR(50)
   - ⚠️ **Attention** : Cette migration supprime toutes les propositions existantes

3. **Migration 003** : `supabase/migrations/003_insert_proposals.sql`
   - Insère les 21 propositions (5 Habitat, 15 Mobilités, 1 Agriculture)

4. **Migration 004** : `supabase/migrations/004_create_newsletter_table.sql`
   - Crée la table pour les inscriptions à la newsletter

**Comment exécuter** :
- Aller dans l'éditeur SQL de Supabase
- Copier-coller chaque fichier SQL dans l'ordre
- Exécuter chaque migration
- Vérifier qu'il n'y a pas d'erreurs

### 3. Vérifier les Données

Après les migrations, vérifier que tout est correct :

```sql
-- Vérifier les catégories (doit retourner 3 lignes)
SELECT * FROM categories;

-- Vérifier les propositions (doit retourner 21 lignes)
SELECT id, title, category_id FROM proposals ORDER BY id;

-- Vérifier la structure de la table newsletter
SELECT * FROM newsletter_subscriptions LIMIT 1;
```

## 🚀 Déploiement sur Vercel (Recommandé)

### 1. Préparer le Projet

1. Aller sur [vercel.com](https://vercel.com)
2. Se connecter avec votre compte GitHub/GitLab/Bitbucket
3. Cliquer sur "Add New Project"
4. Importer le dépôt `plateforme-citoyenne`

### 2. Configurer les Variables d'Environnement

Dans les paramètres du projet Vercel, ajouter les variables d'environnement :

```
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_cle_anon_supabase
```

**Où trouver ces valeurs** :
- Dans Supabase : Settings → API
- `NEXT_PUBLIC_SUPABASE_URL` = Project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` = anon/public key

### 3. Configurer le Build

Vercel détecte automatiquement Next.js, mais vérifier :
- **Framework Preset** : Next.js
- **Build Command** : `npm run build` (par défaut)
- **Output Directory** : `.next` (par défaut)
- **Install Command** : `npm install` (par défaut)

### 4. Déployer

1. Cliquer sur "Deploy"
2. Attendre la fin du build
3. Vérifier que le déploiement est réussi

## 🔧 Configuration Alternative (Autre Hébergeur)

Si vous utilisez un autre hébergeur (Netlify, Railway, etc.) :

### Variables d'Environnement Requises

```env
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_cle_anon_supabase
NODE_ENV=production
```

### Commandes de Build

```bash
# Installer les dépendances
npm install

# Builder l'application
npm run build

# Démarrer le serveur (si nécessaire)
npm start
```

## ✅ Tests Post-Déploiement

Une fois déployé, tester :

1. **Page d'accueil**
   - [ ] La page se charge correctement
   - [ ] Les logos s'affichent dans le footer
   - [ ] Les statistiques s'affichent

2. **Page Propositions**
   - [ ] Les propositions s'affichent
   - [ ] Les onglets fonctionnent
   - [ ] Les votes fonctionnent
   - [ ] Les messages d'erreur/succès s'affichent

3. **Page Résultats**
   - [ ] Les résultats s'affichent
   - [ ] Les statistiques sont correctes

4. **Page Mes Priorités**
   - [ ] Les votes de l'utilisateur s'affichent

5. **Newsletter**
   - [ ] Le formulaire fonctionne
   - [ ] Les emails sont enregistrés en base
   - [ ] Les messages de succès/erreur s'affichent

6. **Partage Social**
   - [ ] Les liens WhatsApp fonctionnent
   - [ ] Les liens Facebook fonctionnent

## 🔒 Sécurité

### Vérifications Importantes

- [ ] Les variables d'environnement ne sont **PAS** commitées dans Git
- [ ] Le fichier `.env.local` est dans `.gitignore`
- [ ] Seule la clé **anon/public** de Supabase est utilisée (pas la clé service_role)
- [ ] Les Row Level Security (RLS) sont configurées dans Supabase si nécessaire

### Configuration RLS (Optionnel mais Recommandé)

Dans Supabase, activer Row Level Security pour les tables :

```sql
-- Activer RLS sur la table votes
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;

-- Activer RLS sur la table newsletter_subscriptions
ALTER TABLE newsletter_subscriptions ENABLE ROW LEVEL SECURITY;

-- Créer des politiques pour permettre les insertions publiques
CREATE POLICY "Allow public inserts on votes"
ON votes FOR INSERT
TO anon
WITH CHECK (true);

CREATE POLICY "Allow public inserts on newsletter_subscriptions"
ON newsletter_subscriptions FOR INSERT
TO anon
WITH CHECK (true);
```

## 📊 Monitoring

### Vercel Analytics (Optionnel)

Pour suivre les performances :
1. Aller dans les paramètres du projet Vercel
2. Activer "Analytics"
3. Consulter les métriques de performance

### Supabase Dashboard

- Surveiller l'utilisation de la base de données
- Vérifier les logs d'erreurs
- Surveiller les inscriptions à la newsletter

## 🐛 Dépannage

### Problèmes Courants

**1. Erreur "Proposition introuvable dans la base de données"**
- Vérifier que les migrations 001, 002, 003 ont été exécutées
- Vérifier que les propositions existent : `SELECT * FROM proposals;`

**2. Les votes ne s'enregistrent pas**
- Vérifier les variables d'environnement dans Vercel
- Vérifier les logs Supabase pour les erreurs
- Vérifier que RLS n'est pas trop restrictif

**3. La newsletter ne fonctionne pas**
- Vérifier que la migration 004 a été exécutée
- Vérifier que la table `newsletter_subscriptions` existe
- Vérifier les logs Supabase

**4. Build échoue sur Vercel**
- Vérifier les logs de build dans Vercel
- Vérifier que toutes les dépendances sont dans `package.json`
- Vérifier qu'il n'y a pas d'erreurs TypeScript : `npm run lint`

## 📝 Notes Importantes

- **URL de Production** : Notez l'URL fournie par Vercel (ex: `plateforme-citoyenne.vercel.app`)
- **Domaine Personnalisé** : Vous pouvez ajouter un domaine personnalisé dans les paramètres Vercel
- **Backups** : Pensez à faire des backups réguliers de la base Supabase
- **Mises à Jour** : Pour mettre à jour, poussez simplement vers Git, Vercel redéploiera automatiquement

## 🎉 C'est Prêt !

Une fois toutes ces étapes complétées, votre plateforme est en production !

Pour toute question ou problème, consultez :
- [Documentation Next.js](https://nextjs.org/docs)
- [Documentation Supabase](https://supabase.com/docs)
- [Documentation Vercel](https://vercel.com/docs)
