# Correction des Permissions en Production

## Problème
Erreur : "permission denied for table votes"

## Cause
La migration 011 révoque les permissions INSERT sur la table `votes` pour les rôles `anon` et `authenticated`. Seul le client admin (service_role) peut insérer des votes.

## Solutions

### Solution 1 : Vérifier la configuration des variables d'environnement

En production (Vercel), vérifier que ces variables sont configurées :

```env
NEXT_PUBLIC_SUPABASE_URL=https://hvynvggcxxpbavrarbcb.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_cle_anon
SUPABASE_SERVICE_ROLE_KEY=votre_cle_service_role  # ⚠️ CRITIQUE
```

**IMPORTANT** : `SUPABASE_SERVICE_ROLE_KEY` doit être la clé "service_role" (pas "anon"), trouvable dans :
- Supabase Dashboard → Project Settings → API → service_role key

### Solution 2 : Vérifier que la migration 011 a été exécutée

Dans Supabase SQL Editor, exécuter :

```sql
-- Vérifier les permissions actuelles
SELECT 
  grantee,
  privilege_type
FROM information_schema.table_privileges
WHERE table_name = 'votes'
ORDER BY grantee, privilege_type;
```

Résultat attendu :
- `anon` : SELECT, DELETE (pas INSERT)
- `authenticated` : SELECT, DELETE (pas INSERT)
- `service_role` : Toutes les permissions (INSERT, SELECT, DELETE, UPDATE)

Si INSERT est présent pour `anon` ou `authenticated`, exécuter la migration 011 :

```sql
-- Migration 011 : Lock votes table for security
REVOKE INSERT ON votes FROM anon;
REVOKE INSERT ON votes FROM authenticated;
GRANT SELECT ON votes TO anon, authenticated;
GRANT DELETE ON votes TO anon, authenticated;
```

### Solution 3 : Vérifier le code utilise bien le client admin

Le code dans `app/actions/vote.ts` ligne 177 doit utiliser `supabaseAdmin` :

```typescript
const { error, data } = await supabaseAdmin!
  .from("votes")
  .insert({...})
```

Si `supabaseAdmin` est `null`, cela signifie que `SUPABASE_SERVICE_ROLE_KEY` n'est pas configuré.

### Solution 4 : Vider la base de données (si nécessaire)

Si vous voulez repartir de zéro :

```sql
-- ⚠️ ATTENTION : Supprime tous les votes
DELETE FROM votes;

-- Réinitialiser les compteurs
UPDATE proposals SET vote_count = 0;
```

## Vérification Turnstile

Pour le problème du modal Turnstile qui ne s'affiche pas :

1. Vérifier en production que `NEXT_PUBLIC_TURNSTILE_SITE_KEY` est configuré
2. Vérifier dans la console du navigateur s'il y a des erreurs
3. Le modal ne s'affiche que si `verifyHumanBadge()` retourne `false`

## Test après correction

1. Voter pour une proposition
2. Le modal Turnstile doit s'afficher (première fois)
3. Après vérification, le vote doit être enregistré
4. Les votes suivants ne doivent plus demander de CAPTCHA (badge valide 24h)
