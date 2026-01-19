# Diagnostic - Votes ne fonctionnent pas en Local

## Vérifications à faire

### 1. Vérifier que Supabase est configuré

Le fichier `.env.local` existe, mais vérifiez qu'il contient bien :

```env
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_cle_anon_supabase
```

**Important** : 
- Les variables doivent commencer par `NEXT_PUBLIC_` pour être accessibles côté client
- Pas d'espaces autour du `=`
- Pas de guillemets autour des valeurs

### 2. Redémarrer le serveur après modification de .env.local

Si vous avez modifié `.env.local`, vous **devez** redémarrer le serveur :

```bash
# Arrêter le serveur (Ctrl+C)
# Redémarrer
npm run dev
```

Next.js ne recharge pas automatiquement les variables d'environnement.

### 3. Vérifier les erreurs dans la console

1. **Console du navigateur** (F12 → Console) :
   - Voter pour une proposition
   - Regarder s'il y a des erreurs
   - Si vous voyez "Base de données non configurée", Supabase n'est pas configuré

2. **Console du terminal** (où tourne `npm run dev`) :
   - Regarder les erreurs serveur
   - Vérifier les logs Supabase

### 4. Vérifier que les migrations ont été exécutées

Dans Supabase (Table Editor), vérifier que ces tables existent :
- ✅ `categories` (3 lignes)
- ✅ `proposals` (21 lignes : h1-h5, m1-m15, a1)
- ✅ `votes` (peut être vide)
- ✅ `newsletter_subscriptions` (peut être vide)

Si les tables n'existent pas, exécuter les migrations SQL.

### 5. Test rapide dans Supabase

Exécuter cette requête dans l'éditeur SQL de Supabase :

```sql
-- Vérifier qu'une proposition existe
SELECT id, title, vote_count FROM proposals WHERE id = 'h1';

-- Devrait retourner une ligne avec vote_count = 0 (ou plus si déjà voté)
```

Si cette requête ne retourne rien, les migrations n'ont pas été exécutées.

### 6. Test d'insertion manuelle

Dans Supabase, essayer d'insérer un vote manuellement :

```sql
-- Remplacer 'votre-session-id' par un UUID de test
INSERT INTO votes (proposal_id, session_id) 
VALUES ('h1', 'test-session-123');

-- Vérifier que vote_count s'incrémente
SELECT id, title, vote_count FROM proposals WHERE id = 'h1';
```

Si `vote_count` ne s'incrémente pas, les triggers ne fonctionnent pas.

## Solutions selon le problème

### Problème : "Base de données non configurée"
- Vérifier `.env.local`
- Redémarrer le serveur
- Vérifier que les variables sont bien chargées (elles apparaissent dans les logs Next.js au démarrage)

### Problème : "Proposition introuvable"
- Exécuter les migrations 001, 002, 003 dans Supabase
- Vérifier que les propositions existent : `SELECT * FROM proposals;`

### Problème : Les votes s'insèrent mais vote_count ne change pas
- Vérifier que les triggers existent (voir `docs/VERIFICATION_VOTES.md`)
- Exécuter la migration 001 ou 002 pour recréer les triggers

### Problème : Erreur de connexion Supabase
- Vérifier l'URL Supabase (doit être https://xxx.supabase.co)
- Vérifier la clé API (doit être la clé "anon public", pas la "service_role")
- Vérifier votre connexion internet

## Mode Debug

Pour voir plus de détails, ajouter des logs dans `app/actions/vote.ts` :

```typescript
console.log("Supabase configured:", isSupabaseConfigured());
console.log("Supabase URL:", process.env.NEXT_PUBLIC_SUPABASE_URL ? "defined" : "undefined");
```

Ces logs apparaîtront dans le terminal où tourne `npm run dev`.
