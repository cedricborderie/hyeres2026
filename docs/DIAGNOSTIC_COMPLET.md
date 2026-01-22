# 🔍 Diagnostic Complet : Permission Denied

## Vérifications à faire dans l'ordre

### 1. Vérifier que la migration 018 a été exécutée

Dans Supabase SQL Editor, exécuter :

```sql
-- Vérifier RLS
SELECT rowsecurity FROM pg_tables WHERE tablename = 'votes';
-- Doit retourner false

-- Vérifier les permissions
SELECT 
  grantee,
  privilege_type
FROM information_schema.table_privileges
WHERE table_name = 'votes'
  AND grantee = 'service_role';
-- service_role doit avoir INSERT
```

### 2. Vérifier la variable d'environnement en production

Dans Vercel :
- Settings → Environment Variables
- Vérifier que `SUPABASE_SERVICE_ROLE_KEY` existe
- Vérifier que la valeur est correcte (commence par `eyJhbGci...`)
- **Redéployer** après modification

### 3. Vérifier les logs Vercel

Dans Vercel Dashboard → Votre projet → Logs :
- Chercher "Supabase Admin not configured"
- Chercher "permission denied"
- Copier les erreurs exactes

### 4. Tester l'insertion manuelle dans Supabase

Dans Supabase SQL Editor, tester :

```sql
-- Cette requête DOIT fonctionner
INSERT INTO votes (proposal_id, session_id) 
VALUES ('h1', 'test-manual-' || gen_random_uuid()::text)
ON CONFLICT DO NOTHING
RETURNING *;
```

Si cette requête échoue, le problème est dans Supabase (permissions).
Si elle fonctionne, le problème est dans le code (client admin).

### 5. Vérifier que le code utilise bien supabaseAdmin

Le code dans `app/actions/vote.ts` ligne 177 doit utiliser `supabaseAdmin!` :

```typescript
const { error, data } = await supabaseAdmin!
  .from("votes")
  .insert({...})
```

### 6. Vérifier que le client admin est créé correctement

Le fichier `lib/supabase/admin.ts` doit créer le client si les variables existent.

## 🚨 Solution de dernier recours

Si rien ne fonctionne, exécuter cette migration complète :

```sql
-- 1. Désactiver RLS
ALTER TABLE votes DISABLE ROW LEVEL SECURITY;

-- 2. Supprimer toutes les politiques
DROP POLICY IF EXISTS "Allow public inserts on votes" ON votes;
DROP POLICY IF EXISTS "Allow public selects on votes" ON votes;
DROP POLICY IF EXISTS "Allow public deletes on votes" ON votes;

-- 3. Donner TOUTES les permissions à service_role
GRANT ALL PRIVILEGES ON TABLE votes TO service_role;

-- 4. Révoquer INSERT de anon et authenticated
REVOKE INSERT ON TABLE votes FROM anon;
REVOKE INSERT ON TABLE votes FROM authenticated;

-- 5. Garder SELECT et DELETE pour anon/authenticated
GRANT SELECT ON TABLE votes TO anon, authenticated;
GRANT DELETE ON TABLE votes TO anon, authenticated;
```

## 📋 Checklist de diagnostic

- [ ] Migration 018 exécutée dans Supabase
- [ ] RLS désactivé (vérifié avec SELECT)
- [ ] service_role a INSERT (vérifié avec SELECT)
- [ ] `SUPABASE_SERVICE_ROLE_KEY` configurée dans Vercel
- [ ] Application redéployée après modification de la variable
- [ ] Test d'insertion manuelle fonctionne dans Supabase
- [ ] Logs Vercel vérifiés
- [ ] Code utilise bien `supabaseAdmin` (ligne 177)

## 🆘 Si le problème persiste

1. **Vérifier les logs Vercel** pour l'erreur exacte
2. **Tester l'insertion manuelle** dans Supabase (voir étape 4)
3. **Vérifier que la clé service_role est correcte** (pas la clé anon)
4. **Vérifier que le redéploiement a bien eu lieu** après modification de la variable
