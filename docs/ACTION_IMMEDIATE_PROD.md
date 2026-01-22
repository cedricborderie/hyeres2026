# 🚨 Action Immédiate : Corriger l'erreur "permission denied"

## Problème
L'erreur persiste même après avoir vidé la base → C'est un problème de **permissions**, pas de données.

## ✅ Solution en 3 étapes

### Étape 1 : Exécuter la migration 014 dans Supabase

1. Aller sur https://supabase.com/dashboard
2. Sélectionner votre projet
3. **SQL Editor** (menu gauche)
4. **New query**
5. Coller et exécuter ce code :

```sql
-- Grant ALL permissions to service_role
GRANT ALL PRIVILEGES ON TABLE votes TO service_role;

-- Revoke INSERT from anon and authenticated
REVOKE INSERT ON TABLE votes FROM anon;
REVOKE INSERT ON TABLE votes FROM authenticated;

-- Keep SELECT and DELETE for RLS
GRANT SELECT ON TABLE votes TO anon, authenticated;
GRANT DELETE ON TABLE votes TO anon, authenticated;
```

6. Cliquer sur **Run**

### Étape 2 : Vérifier la variable d'environnement en production

Dans **Vercel** (ou votre hébergeur) :

1. Aller dans **Settings** → **Environment Variables**
2. Vérifier que `SUPABASE_SERVICE_ROLE_KEY` est bien configurée
3. **Valeur attendue** : La clé "service_role" de Supabase (pas "anon public")
4. Si elle n'existe pas ou est incorrecte :
   - Aller sur Supabase Dashboard → Settings → API
   - Copier la clé **"service_role"** (section "Project API keys")
   - Coller dans Vercel comme `SUPABASE_SERVICE_ROLE_KEY`
   - **Redéployer l'application**

### Étape 3 : Vérifier les permissions

Dans Supabase SQL Editor, exécuter :

```sql
SELECT 
  grantee,
  privilege_type
FROM information_schema.table_privileges
WHERE table_name = 'votes'
  AND grantee IN ('anon', 'authenticated', 'service_role')
ORDER BY grantee, privilege_type;
```

**Résultat attendu :**
- ✅ `service_role` doit avoir : INSERT, SELECT, UPDATE, DELETE
- ✅ `anon` doit avoir : SELECT, DELETE (❌ PAS INSERT)
- ✅ `authenticated` doit avoir : SELECT, DELETE (❌ PAS INSERT)

## 🔍 Diagnostic si ça ne fonctionne toujours pas

### Vérifier que le client admin est configuré

Dans les logs Vercel (ou console serveur), chercher :
- `"Supabase Admin not configured"` → `SUPABASE_SERVICE_ROLE_KEY` manquante
- `"permission denied"` → Permissions incorrectes dans Supabase

### Test manuel dans Supabase

Dans Supabase SQL Editor, tester l'insertion :

```sql
-- Cette requête doit fonctionner
INSERT INTO votes (proposal_id, session_id) 
VALUES ('h1', 'test-manual-' || gen_random_uuid()::text)
ON CONFLICT DO NOTHING
RETURNING *;
```

Si cette requête échoue avec "permission denied", vous n'êtes pas connecté avec `service_role` dans le SQL Editor.

## 📋 Checklist de résolution

- [ ] Migration 014 exécutée dans Supabase
- [ ] `SUPABASE_SERVICE_ROLE_KEY` configurée dans Vercel
- [ ] Application redéployée après modification de la variable
- [ ] Permissions vérifiées (service_role a INSERT)
- [ ] Test de vote effectué sur le site

## 🆘 Si le problème persiste

1. **Vérifier les logs Vercel** :
   - Vercel Dashboard → Votre projet → Logs
   - Chercher les erreurs liées à Supabase

2. **Vérifier la configuration du client admin** :
   - Le code dans `lib/supabase/admin.ts` doit créer le client si les variables sont présentes
   - Vérifier que `isSupabaseAdminConfigured()` retourne `true`

3. **Tester avec curl** (si vous avez accès au terminal) :
   ```bash
   curl -X POST https://votre-site.vercel.app/api/test-vote \
     -H "Content-Type: application/json" \
     -d '{"proposalId":"h1"}'
   ```
