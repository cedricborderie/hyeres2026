# Vérification : Redéploiement nécessaire

## ✅ Configuration vérifiée

La variable `SUPABASE_SERVICE_ROLE_KEY` est bien configurée dans Vercel :
- ✅ Nom correct : `SUPABASE_SERVICE_ROLE_KEY`
- ✅ Valeur présente (JWT)
- ✅ Environnement : "All Environments"
- ✅ Mise à jour : "Updated just now"

## ⚠️ Problème probable : Redéploiement manquant

**Les variables d'environnement sont chargées au moment du BUILD.**

Si vous avez ajouté/modifié `SUPABASE_SERVICE_ROLE_KEY` **après** le dernier déploiement, l'application utilise encore l'ancienne configuration (sans la variable).

## 🔧 Solution : Redéployer

### Option 1 : Redéploiement manuel

1. Vercel Dashboard → Votre projet → **Deployments**
2. Cliquer sur les **3 points** (`...`) du dernier déploiement
3. Cliquer sur **"Redeploy"**
4. Attendre que le déploiement soit terminé (peut prendre 1-2 minutes)

### Option 2 : Nouveau commit (si vous avez des changements)

Si vous avez des changements de code à pousser :
1. Faire un commit (même un petit changement)
2. Push vers votre dépôt
3. Vercel redéploiera automatiquement

## 🔍 Vérification après redéploiement

### 1. Vérifier que le déploiement est terminé

Dans Vercel Dashboard → Deployments :
- Le dernier déploiement doit être marqué comme "Ready" (vert)
- Il doit avoir été créé **après** la modification de la variable

### 2. Tester un vote

1. Aller sur votre site en production
2. Voter pour une proposition
3. Vérifier les logs Vercel

### 3. Vérifier les nouveaux logs

Dans les logs Vercel, vous devriez maintenant voir :

```
Vote insertion attempt: {
  hasSupabaseAdmin: true,
  isAdminConfigured: true,
  supabaseUrl: "defined",
  serviceRoleKey: "defined"  ← DOIT apparaître maintenant
}
```

**Si `serviceRoleKey: "defined"` apparaît** : ✅ La variable est chargée
**Si `serviceRoleKey: "undefined"`** : ❌ Le redéploiement n'a pas fonctionné

## 📋 Checklist

- [ ] Variable `SUPABASE_SERVICE_ROLE_KEY` configurée dans Vercel ✅
- [ ] Application redéployée après modification
- [ ] Nouveau déploiement visible dans Vercel
- [ ] Déploiement terminé (status "Ready")
- [ ] Test de vote effectué
- [ ] `serviceRoleKey: "defined"` dans les logs
- [ ] Vote fonctionne ✅

## 🆘 Si le problème persiste après redéploiement

1. **Vérifier la clé** :
   - Est-ce bien la clé "service_role" de Supabase ?
   - Est-ce différente de `NEXT_PUBLIC_SUPABASE_ANON_KEY` ?

2. **Vérifier les logs** :
   - `serviceRoleKey` doit être "defined"
   - `hasSupabaseAdmin` doit être `true`

3. **Vérifier le déploiement** :
   - Y a-t-il eu un nouveau déploiement après modification ?
   - Le déploiement est-il terminé ?
