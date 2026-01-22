# 🎯 Solution Finale : Erreur 42501

## 🔴 Problème identifié

Les logs montrent :
- ✅ `supabaseUrl: 'defined'`
- ✅ `supabaseKey: 'defined'` (clé anon)
- ❌ **PAS de `serviceRoleKey` dans les logs** → `SUPABASE_SERVICE_ROLE_KEY` n'est **pas chargée**

L'erreur `42501: permission denied` signifie que le code utilise le client **anon** au lieu du client **admin**.

## ✅ Solution immédiate

### 1. Vérifier la variable dans Vercel

1. Vercel Dashboard → Votre projet → **Settings** → **Environment Variables**
2. Chercher `SUPABASE_SERVICE_ROLE_KEY`
3. **Si elle n'existe pas** :
   - Cliquer sur "Add New"
   - Nom : `SUPABASE_SERVICE_ROLE_KEY`
   - Valeur : La clé "service_role" de Supabase
   - Environnement : **Production** (ou "All Environments")
   - Cliquer sur "Save"

4. **Si elle existe** :
   - Vérifier que la valeur est correcte
   - Vérifier que l'environnement inclut "Production"
   - Si modifiée, **redéployer**

### 2. Obtenir la clé service_role

1. Aller sur https://supabase.com/dashboard
2. Sélectionner votre projet
3. **Settings** → **API**
4. Section "Project API keys"
5. Copier la clé **"service_role"** (⚠️ PAS "anon public")
6. Elle doit commencer par `eyJhbGci...`

### 3. Redéployer l'application

**IMPORTANT** : Après avoir ajouté/modifié `SUPABASE_SERVICE_ROLE_KEY` :

1. Vercel Dashboard → Votre projet → **Deployments**
2. Cliquer sur les **3 points** du dernier déploiement
3. Cliquer sur **"Redeploy"**
4. Attendre que le déploiement soit terminé

### 4. Vérifier les nouveaux logs

Après redéploiement, tester un vote et vérifier les logs Vercel. Vous devriez maintenant voir :

```
Vote insertion attempt: {
  hasSupabaseAdmin: true,
  isAdminConfigured: true,
  supabaseUrl: "defined",
  serviceRoleKey: "defined"  ← DOIT apparaître maintenant
}
```

## 🔍 Vérification

### Checklist

- [ ] `SUPABASE_SERVICE_ROLE_KEY` ajoutée dans Vercel
- [ ] Variable dans l'environnement "Production"
- [ ] Valeur correcte (clé service_role, pas anon)
- [ ] Application redéployée
- [ ] Nouveau déploiement visible dans Vercel
- [ ] Test de vote effectué
- [ ] `serviceRoleKey: "defined"` dans les nouveaux logs
- [ ] Vote fonctionne ✅

## 🆘 Si le problème persiste

1. **Vérifier que la clé est correcte** :
   - Doit être la clé "service_role"
   - Doit être différente de `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Doit commencer par `eyJhbGci...`

2. **Vérifier le redéploiement** :
   - Y a-t-il eu un nouveau déploiement après modification ?
   - Le déploiement est-il terminé ?

3. **Vérifier les logs** :
   - `serviceRoleKey` doit être "defined"
   - `hasSupabaseAdmin` doit être `true`

## 📝 Note importante

Les variables d'environnement dans Vercel sont chargées **au moment du build**. Si vous modifiez une variable, vous **devez redéployer** pour que la modification soit prise en compte.
