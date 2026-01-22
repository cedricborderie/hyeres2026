# 🚨 Action Urgente : Corriger Permission Denied

## Étape 1 : Exécuter la migration 018 dans Supabase

Dans Supabase SQL Editor, coller et exécuter **TOUT** ce code :

```sql
-- 1. Désactiver RLS
ALTER TABLE votes DISABLE ROW LEVEL SECURITY;

-- 2. Supprimer toutes les politiques
DROP POLICY IF EXISTS "Allow public inserts on votes" ON votes;
DROP POLICY IF EXISTS "Allow public selects on votes" ON votes;
DROP POLICY IF EXISTS "Allow public deletes on votes" ON votes;
DROP POLICY IF EXISTS "service_role_can_insert_votes" ON votes;

-- 3. Donner TOUTES les permissions à service_role
GRANT ALL PRIVILEGES ON TABLE votes TO service_role;

-- 4. Révoquer INSERT de anon et authenticated
REVOKE INSERT ON TABLE votes FROM anon;
REVOKE INSERT ON TABLE votes FROM authenticated;

-- 5. Garder SELECT et DELETE pour anon/authenticated
GRANT SELECT ON TABLE votes TO anon, authenticated;
GRANT DELETE ON TABLE votes TO anon, authenticated;
```

## Étape 2 : Vérifier dans Supabase

Exécuter ces requêtes pour vérifier :

```sql
-- Vérifier RLS
SELECT rowsecurity FROM pg_tables WHERE tablename = 'votes';
-- Doit retourner false

-- Vérifier les permissions de service_role
SELECT 
  grantee,
  privilege_type
FROM information_schema.table_privileges
WHERE table_name = 'votes'
  AND grantee = 'service_role';
-- service_role doit avoir INSERT, SELECT, UPDATE, DELETE
```

## Étape 3 : Tester l'insertion manuelle

Dans Supabase SQL Editor, tester :

```sql
-- Note: session_id est de type UUID, pas TEXT
INSERT INTO votes (proposal_id, session_id) 
VALUES ('h1', gen_random_uuid())
ON CONFLICT DO NOTHING
RETURNING *;
```

**Si cette requête échoue** : Le problème est dans Supabase (permissions).
**Si elle fonctionne** : Le problème est dans le code (client admin).

## Étape 4 : Vérifier les logs Vercel

1. Aller dans Vercel Dashboard → Votre projet → Logs
2. Chercher les erreurs récentes
3. Chercher "Supabase Admin not configured" ou "permission denied"
4. Copier les logs complets

## Étape 5 : Vérifier la variable d'environnement

Dans Vercel :
1. Settings → Environment Variables
2. Vérifier que `SUPABASE_SERVICE_ROLE_KEY` existe
3. Vérifier que la valeur commence par `eyJhbGci...` (JWT)
4. **Si modifiée, REDÉPLOYER l'application**

## Étape 6 : Vérifier le redéploiement

Après avoir modifié `SUPABASE_SERVICE_ROLE_KEY` :
1. Aller dans Vercel Dashboard → Votre projet → Deployments
2. Vérifier qu'un nouveau déploiement a eu lieu après la modification
3. Si pas de nouveau déploiement, déclencher un redéploiement manuel

## 🔍 Diagnostic avancé

Si le problème persiste après toutes ces étapes :

1. **Vérifier les logs serveur** : Les logs Vercel doivent maintenant montrer des détails grâce aux logs ajoutés dans le code
2. **Vérifier que le client admin est créé** : Les logs doivent montrer `hasSupabaseAdmin: true`
3. **Vérifier l'erreur exacte** : Les logs doivent montrer `errorCode` et `errorMessage`

## 📋 Checklist complète

- [ ] Migration 018 exécutée dans Supabase
- [ ] RLS désactivé (vérifié avec SELECT)
- [ ] service_role a INSERT (vérifié avec SELECT)
- [ ] Test d'insertion manuelle fonctionne dans Supabase
- [ ] `SUPABASE_SERVICE_ROLE_KEY` configurée dans Vercel
- [ ] Application redéployée après modification de la variable
- [ ] Logs Vercel vérifiés
- [ ] Nouveau déploiement visible dans Vercel

## 🆘 Si rien ne fonctionne

1. **Partager les logs Vercel** : Copier les erreurs exactes
2. **Partager le résultat du test manuel** : Est-ce que l'insertion manuelle fonctionne ?
3. **Vérifier la clé service_role** : Est-ce bien la clé "service_role" et pas "anon public" ?
