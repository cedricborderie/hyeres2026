# Test d'Insertion Corrigé

## ⚠️ Types de colonnes

D'après la migration 002, `proposal_id` est de type **VARCHAR** (string), pas UUID.
`session_id` est de type **UUID**.

## Requête de test corrigée

```sql
-- Test d'insertion
-- proposal_id est VARCHAR (string) comme 'h1', 'h2', etc.
-- session_id est UUID
INSERT INTO votes (proposal_id, session_id) 
VALUES ('h1', gen_random_uuid())
ON CONFLICT DO NOTHING
RETURNING *;
```

## Vérifier que la proposition existe

Avant de tester, vérifiez que la proposition 'h1' existe :

```sql
SELECT id, title FROM proposals WHERE id = 'h1';
```

Si elle n'existe pas, utilisez un ID de proposition qui existe :

```sql
-- Lister toutes les propositions
SELECT id, title FROM proposals LIMIT 5;

-- Utiliser un ID existant pour le test
INSERT INTO votes (proposal_id, session_id) 
VALUES ('votre-id-existant', gen_random_uuid())
ON CONFLICT DO NOTHING
RETURNING *;
```

## Nettoyer après le test

```sql
-- Supprimer le vote de test (remplacer l'UUID par celui retourné)
DELETE FROM votes WHERE id = 'uuid-du-vote-de-test';
```

## Interprétation des résultats

### ✅ Si l'insertion fonctionne

Le problème est dans le code (client admin) :
- Vérifier les logs Vercel
- Vérifier que `SUPABASE_SERVICE_ROLE_KEY` est configurée
- Vérifier que l'application a été redéployée

### ❌ Si l'insertion échoue avec "permission denied"

Le problème est dans Supabase :
- Vérifier que la migration 018 a été exécutée
- Vérifier que `service_role` a INSERT
- Vérifier que RLS est désactivé
