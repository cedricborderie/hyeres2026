# Diagnostic RLS (Row Level Security)

## Problème
Même avec les bonnes permissions et `SUPABASE_SERVICE_ROLE_KEY` configurée, l'erreur "permission denied" persiste.

## Cause probable : RLS bloque l'insertion

La migration 009 active RLS sur la table `votes`. Même si `service_role` devrait normalement bypasser RLS, il peut y avoir un problème.

## Diagnostic

### Étape 1 : Vérifier si RLS est activé

Dans Supabase SQL Editor, exécuter :

```sql
SELECT 
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables
WHERE tablename = 'votes';
```

Si `rls_enabled = true`, RLS est activé.

### Étape 2 : Vérifier les politiques RLS

```sql
SELECT 
  policyname,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'votes';
```

### Étape 3 : Solution - Désactiver RLS pour les inserts

Puisque nous utilisons `service_role` pour insérer (qui devrait bypasser RLS), et que nous avons déjà révoqué INSERT pour `anon` et `authenticated`, nous pouvons désactiver RLS :

```sql
-- Désactiver RLS sur votes (service_role bypassera quand même)
ALTER TABLE votes DISABLE ROW LEVEL SECURITY;
```

**Pourquoi c'est sûr :**
- `anon` et `authenticated` n'ont pas INSERT (révoqué par migration 011)
- Seul `service_role` peut insérer (utilisé par le code)
- RLS n'est donc pas nécessaire pour la sécurité

### Étape 4 : Alternative - Garder RLS mais créer une politique

Si vous voulez garder RLS activé :

```sql
-- Créer une politique qui permet service_role d'insérer
CREATE POLICY IF NOT EXISTS "service_role_can_insert_votes"
ON votes
FOR INSERT
TO service_role
WITH CHECK (true);
```

Mais normalement, `service_role` devrait bypasser RLS automatiquement.

## Test après correction

1. Exécuter la migration 016 ou désactiver RLS manuellement
2. Tester un vote sur le site
3. Vérifier dans Supabase que le vote a été inséré :

```sql
SELECT * FROM votes ORDER BY created_at DESC LIMIT 5;
```

## Vérification finale

Après avoir désactivé RLS ou créé la politique :

```sql
-- Vérifier que RLS est désactivé
SELECT rowsecurity FROM pg_tables WHERE tablename = 'votes';
-- Devrait retourner false

-- Vérifier les permissions
SELECT 
  grantee,
  privilege_type
FROM information_schema.table_privileges
WHERE table_name = 'votes'
  AND grantee = 'service_role';
-- service_role doit avoir INSERT
```
