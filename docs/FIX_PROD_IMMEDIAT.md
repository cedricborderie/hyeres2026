# 🚨 Fix Immédiat : Erreur "permission denied" en Production

## Problème
Après validation du CAPTCHA Turnstile, erreur : **"permission denied for table votes"**

## ✅ Solution en 2 étapes

### Étape 1 : Exécuter la migration dans Supabase PRODUCTION

1. Aller sur https://supabase.com/dashboard
2. **Sélectionner le projet PRODUCTION** (pas préproduction)
3. **SQL Editor** (menu gauche)
4. **New query**
5. Copier-coller et exécuter ce code :

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

6. Cliquer sur **"Run"**

### Étape 2 : Vérifier la variable dans Vercel PRODUCTION

1. Vercel Dashboard → Votre projet → **Settings** → **Environment Variables**
2. Vérifier que `SUPABASE_SERVICE_ROLE_KEY` existe pour l'environnement **"Production"**
3. Si elle n'existe pas ou est incorrecte :
   - Aller sur Supabase Dashboard → Settings → API
   - Copier la clé **"service_role"** (pas "anon public")
   - Dans Vercel, ajouter/modifier `SUPABASE_SERVICE_ROLE_KEY`
   - **Environnement** : **Production** (pas Preview)
   - **Redéployer** l'application

## 🔍 Vérification

### Dans Supabase SQL Editor :

```sql
-- Vérifier les permissions
SELECT 
  grantee,
  privilege_type
FROM information_schema.table_privileges
WHERE table_name = 'votes'
  AND grantee IN ('anon', 'authenticated', 'service_role')
ORDER BY grantee, privilege_type;
```

**Résultat attendu :**
- ✅ `service_role` : INSERT, SELECT, UPDATE, DELETE
- ✅ `anon` : SELECT, DELETE (❌ PAS INSERT)
- ✅ `authenticated` : SELECT, DELETE (❌ PAS INSERT)

### Dans Vercel :

1. Vérifier que `SUPABASE_SERVICE_ROLE_KEY` est dans **"Production"**
2. Vérifier qu'un **redéploiement** a eu lieu après modification
3. Tester un vote sur le site

## 📋 Checklist

- [ ] Migration exécutée dans Supabase PRODUCTION
- [ ] `service_role` a INSERT (vérifié avec SELECT)
- [ ] `SUPABASE_SERVICE_ROLE_KEY` configurée dans Vercel PRODUCTION
- [ ] Variable dans l'environnement "Production" (pas Preview)
- [ ] Application redéployée après modification
- [ ] Test de vote effectué
- [ ] Vote fonctionne ✅

## 🆘 Si le problème persiste

1. **Vérifier les logs Vercel** :
   - Chercher `=== VOTE DEBUG ===` dans les logs
   - Vérifier `serviceRoleKey: "defined"` ou `"undefined"`

2. **Vérifier la clé** :
   - Est-ce bien la clé "service_role" du projet PRODUCTION ?
   - Est-ce différente de `NEXT_PUBLIC_SUPABASE_ANON_KEY` ?

3. **Vérifier le redéploiement** :
   - Y a-t-il eu un nouveau déploiement après modification ?
   - Le déploiement est-il terminé ?
