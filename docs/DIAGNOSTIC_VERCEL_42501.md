# Diagnostic Erreur 42501 dans Vercel

## 🔴 Problème identifié

Les logs Vercel montrent :
- Code d'erreur : `42501` (insufficient privilege)
- Message : "permission denied"
- Cela signifie que le client admin n'est **pas utilisé** ou la variable n'est **pas chargée**

## 🔍 Vérifications à faire

### 1. Vérifier les logs de diagnostic

Dans les logs Vercel, chercher cette ligne :
```
Vote insertion attempt: {
  hasSupabaseAdmin: true/false,
  isAdminConfigured: true/false,
  supabaseUrl: "defined"/"undefined",
  serviceRoleKey: "defined"/"undefined"
}
```

**Si `serviceRoleKey: "undefined"`** :
- `SUPABASE_SERVICE_ROLE_KEY` n'est pas chargée en production
- Vérifier la configuration dans Vercel

**Si `hasSupabaseAdmin: false`** :
- Le client admin n'est pas créé
- Vérifier que les deux variables sont définies

### 2. Vérifier la variable d'environnement dans Vercel

1. Vercel Dashboard → Votre projet → **Settings** → **Environment Variables**
2. Chercher `SUPABASE_SERVICE_ROLE_KEY`
3. Vérifier :
   - ✅ La variable existe
   - ✅ La valeur est correcte (commence par `eyJhbGci...`)
   - ✅ L'environnement est "Production" (ou "All Environments")
   - ✅ Pas d'espaces avant/après la valeur

### 3. Vérifier le redéploiement

1. Vercel Dashboard → Votre projet → **Deployments**
2. Vérifier qu'un nouveau déploiement a eu lieu **après** la modification de `SUPABASE_SERVICE_ROLE_KEY`
3. Si pas de nouveau déploiement :
   - Cliquer sur les 3 points du dernier déploiement
   - "Redeploy"

### 4. Vérifier que la clé est la bonne

Dans Supabase Dashboard → Settings → API :
- Copier la clé **"service_role"** (pas "anon public")
- Elle doit commencer par `eyJhbGci...`
- Elle doit être différente de `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 🔧 Solution

### Si `serviceRoleKey: "undefined"` dans les logs

1. **Vérifier la variable dans Vercel** :
   - Settings → Environment Variables
   - Chercher `SUPABASE_SERVICE_ROLE_KEY`
   - Si elle n'existe pas, l'ajouter
   - Si elle existe, vérifier la valeur

2. **Redéployer** :
   - Après modification, déclencher un redéploiement
   - Attendre que le déploiement soit terminé

3. **Tester à nouveau** :
   - Voter sur le site
   - Vérifier les nouveaux logs

### Si `hasSupabaseAdmin: false` dans les logs

Le client admin n'est pas créé. Vérifier :
1. `NEXT_PUBLIC_SUPABASE_URL` est définie
2. `SUPABASE_SERVICE_ROLE_KEY` est définie
3. Les deux sont dans le même environnement (Production)

## 📋 Checklist

- [ ] Logs Vercel vérifiés
- [ ] `serviceRoleKey: "defined"` dans les logs
- [ ] `hasSupabaseAdmin: true` dans les logs
- [ ] `SUPABASE_SERVICE_ROLE_KEY` configurée dans Vercel
- [ ] Variable dans l'environnement "Production"
- [ ] Application redéployée après modification
- [ ] Test de vote effectué
- [ ] Nouveaux logs vérifiés

## 🆘 Si le problème persiste

1. **Copier les logs complets** : Tous les logs lors d'un vote
2. **Vérifier la clé** : Est-ce bien la clé "service_role" ?
3. **Vérifier le redéploiement** : Y a-t-il eu un nouveau déploiement ?
