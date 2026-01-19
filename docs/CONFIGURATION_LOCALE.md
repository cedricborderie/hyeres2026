# Configuration pour le Développement Local

## Problème : Les votes ne fonctionnent pas en local

Si les votes ne s'incrémentent pas en local, c'est probablement parce que **Supabase n'est pas configuré** ou que les **migrations SQL n'ont pas été exécutées**.

## Solution 1 : Configurer Supabase en Local (Recommandé)

### Étape 1 : Créer un fichier `.env.local`

Créer un fichier `.env.local` à la racine du projet avec :

```env
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_cle_anon_supabase
```

**Où trouver ces valeurs** :
1. Aller sur [supabase.com](https://supabase.com)
2. Créer un projet (ou utiliser un existant)
3. Aller dans Settings → API
4. Copier :
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Étape 2 : Exécuter les Migrations SQL

Dans Supabase, aller dans l'éditeur SQL et exécuter dans l'ordre :

1. `supabase/migrations/001_initial_schema.sql`
2. `supabase/migrations/002_modify_proposal_ids_to_string.sql`
3. `supabase/migrations/003_insert_proposals.sql`
4. `supabase/migrations/004_create_newsletter_table.sql`

### Étape 3 : Redémarrer le Serveur

```bash
# Arrêter le serveur (Ctrl+C)
# Redémarrer
npm run dev
```

## Solution 2 : Mode Développement avec localStorage (Alternative)

Si vous ne voulez pas configurer Supabase en local, vous pouvez utiliser un mode de développement qui utilise localStorage. Cependant, cela nécessite des modifications du code.

**Note** : Pour la production, Supabase est nécessaire. Il est donc recommandé de configurer Supabase même en local.

## Vérification

### Vérifier que Supabase est configuré

1. **Vérifier le fichier `.env.local`** :
   ```bash
   cat .env.local
   ```
   Doit contenir `NEXT_PUBLIC_SUPABASE_URL` et `NEXT_PUBLIC_SUPABASE_ANON_KEY`

2. **Vérifier dans la console du navigateur** :
   - Ouvrir les outils de développement (F12)
   - Onglet Console
   - Voter pour une proposition
   - Si vous voyez "Base de données non configurée", Supabase n'est pas configuré

3. **Vérifier dans Supabase** :
   - Aller dans Table Editor → `votes`
   - Voter via l'application
   - Un nouvel enregistrement doit apparaître dans la table `votes`
   - Le `vote_count` de la proposition doit s'incrémenter automatiquement

## Problèmes Courants

### "Base de données non configurée"
- **Cause** : `.env.local` n'existe pas ou les variables ne sont pas définies
- **Solution** : Créer `.env.local` avec les variables Supabase

### "Proposition introuvable dans la base de données"
- **Cause** : Les migrations SQL n'ont pas été exécutées
- **Solution** : Exécuter les migrations 001, 002, 003 dans Supabase

### Les votes s'affichent mais ne s'incrémentent pas
- **Cause** : Les triggers PostgreSQL ne fonctionnent pas
- **Solution** : Vérifier que les triggers existent (voir `docs/VERIFICATION_VOTES.md`)

## Note Importante

**En production, Supabase est obligatoire**. Il n'y a pas de fallback localStorage pour les votes en production. Configurez Supabase même en local pour tester dans les mêmes conditions qu'en production.
