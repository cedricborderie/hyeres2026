# Résolution : "permission denied for table votes" en Production

## 🔴 Problème
Erreur lors du vote : `permission denied for table votes`

## 🔍 Diagnostic

### Étape 1 : Vérifier les variables d'environnement en production

Dans Vercel (ou votre hébergeur), vérifier que ces variables sont configurées :

```env
NEXT_PUBLIC_SUPABASE_URL=https://hvynvggcxxpbavrarbcb.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...  # ⚠️ CRITIQUE
```

**Où trouver `SUPABASE_SERVICE_ROLE_KEY` :**
1. Aller sur https://supabase.com/dashboard
2. Sélectionner votre projet
3. Settings → API
4. Section "Project API keys"
5. Copier la clé **"service_role"** (⚠️ NE PAS utiliser "anon public")

### Étape 2 : Vérifier que la migration 011 a été exécutée

Dans Supabase SQL Editor, exécuter :

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
- `anon` : SELECT, DELETE (❌ PAS INSERT)
- `authenticated` : SELECT, DELETE (❌ PAS INSERT)  
- `service_role` : INSERT, SELECT, UPDATE, DELETE (✅ TOUT)

Si `anon` ou `authenticated` ont INSERT, exécuter la migration 011 ou 012.

### Étape 3 : Exécuter la migration de correction

Dans Supabase SQL Editor, exécuter la migration `012_fix_permissions_and_grant_service_role.sql` :

```sql
-- Grant all permissions to service_role
GRANT ALL ON votes TO service_role;

-- Revoke INSERT from anon and authenticated
REVOKE INSERT ON votes FROM anon;
REVOKE INSERT ON votes FROM authenticated;

-- Keep SELECT and DELETE for RLS
GRANT SELECT ON votes TO anon, authenticated;
GRANT DELETE ON votes TO anon, authenticated;
```

### Étape 4 : Redéployer l'application

Après avoir configuré `SUPABASE_SERVICE_ROLE_KEY` dans Vercel :
1. Aller dans Vercel Dashboard → Votre projet → Settings → Environment Variables
2. Ajouter/modifier `SUPABASE_SERVICE_ROLE_KEY`
3. Redéployer l'application (ou attendre le prochain commit)

## 🔧 Solution Alternative : Vider la base si nécessaire

Si vous voulez repartir de zéro (⚠️ Supprime tous les votes) :

```sql
-- Supprimer tous les votes
DELETE FROM votes;

-- Réinitialiser les compteurs
UPDATE proposals SET vote_count = 0;
```

## 🐛 Problème Turnstile : Modal ne s'affiche pas

### Causes possibles :

1. **Variable d'environnement manquante** :
   - Vérifier que `NEXT_PUBLIC_TURNSTILE_SITE_KEY` est configurée en production
   - Vérifier que `TURNSTILE_SECRET_KEY` est configurée en production

2. **Badge déjà présent** :
   - Si le cookie `human_badge` existe déjà (valide 24h), le modal ne s'affiche pas
   - Le vote passe directement mais échoue sur les permissions

3. **Console du navigateur** :
   - Ouvrir F12 → Console
   - Vérifier s'il y a des erreurs JavaScript
   - Vérifier les logs : `VoteGatekeeper - Modal is now open`

### Test du modal Turnstile :

1. Supprimer le cookie `human_badge` dans le navigateur
2. Rafraîchir la page
3. Essayer de voter
4. Le modal Turnstile devrait s'afficher

## ✅ Vérification finale

Après correction :

1. **Tester le vote** :
   - Supprimer le cookie `human_badge` (F12 → Application → Cookies)
   - Voter pour une proposition
   - Le modal Turnstile doit s'afficher
   - Après vérification, le vote doit être enregistré ✅

2. **Vérifier les logs** :
   - Console navigateur : Pas d'erreurs
   - Console serveur (Vercel Logs) : Pas d'erreur "permission denied"

3. **Vérifier dans Supabase** :
   ```sql
   SELECT * FROM votes ORDER BY created_at DESC LIMIT 5;
   ```
   - Les votes doivent apparaître ✅

## 📝 Checklist de résolution

- [ ] `SUPABASE_SERVICE_ROLE_KEY` configurée en production
- [ ] Migration 011 ou 012 exécutée dans Supabase
- [ ] Permissions vérifiées (service_role a INSERT)
- [ ] Application redéployée
- [ ] Test de vote effectué
- [ ] Modal Turnstile s'affiche (première fois)
- [ ] Vote enregistré dans Supabase

## 🆘 Si le problème persiste

1. Vérifier les logs Vercel pour voir l'erreur exacte
2. Vérifier que `isSupabaseAdminConfigured()` retourne `true` (logs serveur)
3. Tester l'insertion manuelle dans Supabase avec service_role :
   ```sql
   -- Se connecter avec service_role et tester
   INSERT INTO votes (proposal_id, session_id) 
   VALUES ('h1', 'test-manual-' || gen_random_uuid()::text);
   ```
