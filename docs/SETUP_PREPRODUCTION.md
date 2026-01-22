# Setup Préproduction - Guide Complet

## 📋 Vue d'ensemble

Ce guide explique comment créer un nouvel environnement de préproduction dans Supabase en utilisant le script SQL complet.

## 🚀 Étapes de déploiement

### 1. Créer un nouveau projet Supabase

1. Aller sur https://supabase.com/dashboard
2. Cliquer sur **"New Project"**
3. Remplir les informations :
   - **Name** : `hyeres2026-preprod` (ou autre nom)
   - **Database Password** : Choisir un mot de passe fort
   - **Region** : Choisir la région la plus proche (ex: `West EU (Paris)`)
4. Cliquer sur **"Create new project"**
5. Attendre que le projet soit créé (2-3 minutes)

### 2. Exécuter le script SQL complet

1. Dans le nouveau projet Supabase, aller dans **SQL Editor** (menu de gauche)
2. Cliquer sur **"New query"**
3. Ouvrir le fichier `supabase/migrations/000_full_schema_preproduction.sql`
4. Copier **TOUT** le contenu du fichier
5. Coller dans l'éditeur SQL de Supabase
6. Cliquer sur **"Run"** (ou `Ctrl+Enter` / `Cmd+Enter`)
7. Attendre que le script se termine (quelques secondes)

### 3. Vérifier que tout est correct

Le script affiche automatiquement des vérifications à la fin. Vérifiez que :

- ✅ **3 catégories** ont été créées
- ✅ **21 propositions** ont été créées (5 Habitat, 15 Mobilités, 1 Agriculture)
- ✅ **service_role** a INSERT, SELECT, UPDATE, DELETE sur votes
- ✅ **anon** et **authenticated** ont SELECT, DELETE (mais PAS INSERT) sur votes
- ✅ **RLS est désactivé** sur votes

### 4. Récupérer les variables d'environnement

1. Dans Supabase Dashboard → **Settings** → **API**
2. Copier les valeurs suivantes :
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role key** → `SUPABASE_SERVICE_ROLE_KEY` ⚠️ **Ne pas partager publiquement**

### 5. Configurer les variables dans Vercel (ou votre hébergeur)

1. Aller dans Vercel Dashboard → Votre projet → **Settings** → **Environment Variables**
2. Ajouter les variables pour l'environnement **Preview** (ou créer un environnement "Preproduction") :

```env
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet-preprod.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci... (clé anon)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci... (clé service_role)
NEXT_PUBLIC_TURNSTILE_SITE_KEY=votre_cle_turnstile
TURNSTILE_SECRET_KEY=votre_cle_secrete_turnstile
JWT_SECRET_KEY=votre_cle_jwt
```

3. **Redéployer** l'application

## ✅ Vérifications post-déploiement

### Vérifier les données

Dans Supabase SQL Editor, exécuter :

```sql
-- Vérifier les catégories
SELECT * FROM categories;

-- Vérifier les propositions
SELECT id, title, category_id, vote_count FROM proposals ORDER BY id;

-- Vérifier les permissions
SELECT 
  grantee,
  privilege_type
FROM information_schema.table_privileges
WHERE table_name = 'votes'
  AND grantee IN ('anon', 'authenticated', 'service_role')
ORDER BY grantee, privilege_type;
```

### Tester l'insertion d'un vote

```sql
-- Test d'insertion (doit fonctionner avec service_role)
INSERT INTO votes (proposal_id, session_id) 
VALUES ('h1', gen_random_uuid())
ON CONFLICT DO NOTHING
RETURNING *;

-- Vérifier que vote_count a été mis à jour
SELECT id, title, vote_count FROM proposals WHERE id = 'h1';

-- Nettoyer le test
DELETE FROM votes WHERE proposal_id = 'h1';
UPDATE proposals SET vote_count = 0 WHERE id = 'h1';
```

## 🔒 Sécurité

### Variables sensibles

- ⚠️ **`SUPABASE_SERVICE_ROLE_KEY`** : Ne JAMAIS exposer publiquement
- ⚠️ **`TURNSTILE_SECRET_KEY`** : Ne JAMAIS exposer publiquement
- ⚠️ **`JWT_SECRET_KEY`** : Ne JAMAIS exposer publiquement

### Permissions

Le script configure les permissions de manière sécurisée :
- ✅ Seul `service_role` peut insérer des votes (via le code serveur)
- ✅ `anon` et `authenticated` peuvent lire et supprimer leurs votes
- ✅ RLS est désactivé car les permissions suffisent

## 📝 Notes importantes

1. **Ce script est idempotent** : Vous pouvez l'exécuter plusieurs fois sans problème (utilise `ON CONFLICT DO NOTHING`)

2. **Les données sont préservées** : Si vous réexécutez le script, les données existantes ne seront pas supprimées

3. **Pour réinitialiser complètement** : Si vous voulez repartir de zéro, supprimez d'abord les tables :
   ```sql
   DROP TABLE IF EXISTS votes CASCADE;
   DROP TABLE IF EXISTS proposals CASCADE;
   DROP TABLE IF EXISTS categories CASCADE;
   DROP TABLE IF EXISTS newsletter_subscriptions CASCADE;
   ```
   Puis réexécutez le script.

## 🆘 Dépannage

### Erreur : "relation already exists"
- Normal si vous réexécutez le script
- Le script utilise `IF NOT EXISTS` et `ON CONFLICT DO NOTHING`

### Erreur : "permission denied"
- Vérifier que vous êtes connecté avec les droits administrateur dans Supabase
- Vérifier que le script a bien été exécuté en entier

### Les propositions ne s'affichent pas
- Vérifier que les 21 propositions ont été insérées : `SELECT COUNT(*) FROM proposals;`
- Vérifier que les catégories existent : `SELECT * FROM categories;`

## 📚 Fichiers associés

- `supabase/migrations/000_full_schema_preproduction.sql` - Script SQL complet
- `docs/CONFIGURATION_LOCALE.md` - Configuration locale
- `docs/DEPLOYMENT.md` - Guide de déploiement
