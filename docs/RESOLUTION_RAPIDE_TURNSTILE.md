# Résolution Rapide : Turnstile ne fonctionne pas sur Staging

## 🎯 Solution en 3 étapes

### Étape 1 : Vérifier les variables dans Vercel

1. Aller sur [Vercel Dashboard](https://vercel.com/dashboard)
2. Sélectionner votre projet
3. **Settings** → **Environment Variables**
4. Vérifier que pour l'environnement **Preview** (ou **Staging**), vous avez :

```env
NEXT_PUBLIC_TURNSTILE_SITE_KEY=0x4AAAAAACNnq62ppdT8Ei2e
TURNSTILE_SECRET_KEY=0x4AAAAAACNnqygx7qAZ84Km0JVfFtSPPHM
JWT_SECRET_KEY=95ed88443338758e5cf7c8abe6ad88945b3e3a42b5abd0962182bcbd66a7d7a0
```

**Si elles n'existent pas :**
- Cliquer sur **"Add New"**
- Ajouter chaque variable
- ⚠️ **Sélectionner "Preview"** comme environnement (pas seulement Production)
- Sauvegarder

### Étape 2 : Redéployer SANS CACHE

⚠️ **CRITIQUE** : Après avoir ajouté/modifié les variables, un redéploiement **sans cache** est obligatoire.

1. Vercel Dashboard → **Deployments**
2. Trouver le dernier déploiement de la branche `staging`
3. Cliquer sur **"..."** (trois points)
4. Cliquer sur **"Redeploy"**
5. ⚠️ **DÉCOCHER** "Use existing Build Cache" (très important !)
6. Cliquer sur **"Redeploy"**
7. Attendre la fin du build (2-3 minutes)

### Étape 3 : Vérifier le domaine dans Cloudflare Turnstile

1. Aller sur [Cloudflare Turnstile Dashboard](https://dash.cloudflare.com/?to=/:account/turnstile)
2. Sélectionner votre site Turnstile
3. Vérifier que dans la section **"Domains"**, vous avez :
   - ✅ `staging.hyeres2026.org`
   - ✅ L'URL Vercel de staging (ex: `[projet]-git-staging-[user].vercel.app`)

**Si le domaine n'est pas là :**
- Ajouter le domaine
- Sauvegarder
- Attendre quelques minutes

## 🧪 Test après redéploiement

1. Aller sur `https://staging.hyeres2026.org/propositions`
2. Ouvrir les DevTools (F12) → **Console**
3. Cliquer sur "Je soutiens" pour une proposition
4. Vérifier dans la console :
   - ✅ `"VoteGatekeeper - Turnstile siteKey: présente"`
   - ❌ Si "manquante" → Les variables ne sont pas accessibles, vérifier Vercel

5. Le modal Turnstile devrait s'afficher
6. Compléter le CAPTCHA
7. Le vote devrait fonctionner

## 🔍 Diagnostic dans la console

**Si le modal ne s'affiche pas, ouvrir la console et chercher :**

```javascript
// Le message devrait être :
"VoteGatekeeper - Turnstile siteKey: présente"

// Si c'est "manquante", vérifier :
console.log(process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY);
// Doit afficher la clé, pas undefined
```

## ⚠️ Points critiques

1. **Variables dans Preview** : Les variables doivent être dans l'environnement **Preview**, pas seulement Production
2. **Redéploiement sans cache** : Obligatoire après modification des variables
3. **Domaine autorisé** : Le domaine staging doit être dans Cloudflare Turnstile
4. **Attendre la propagation** : Après modification, attendre 2-3 minutes

## 🆘 Si ça ne fonctionne toujours pas

1. **Vérifier les logs de build** dans Vercel pour voir si les variables sont injectées
2. **Vérifier les logs runtime** dans Vercel (Functions) pour les erreurs serveur
3. **Tester avec l'URL Vercel** de staging au lieu du domaine personnalisé
4. **Vérifier la console** du navigateur pour les erreurs JavaScript

## ✅ Checklist finale

- [ ] Variables configurées dans Vercel pour **Preview**
- [ ] `NEXT_PUBLIC_TURNSTILE_SITE_KEY` présente
- [ ] `TURNSTILE_SECRET_KEY` présente
- [ ] `JWT_SECRET_KEY` présente
- [ ] Domaine staging autorisé dans Cloudflare Turnstile
- [ ] Redéploiement effectué **sans cache**
- [ ] Console navigateur : "siteKey: présente"
- [ ] Modal Turnstile s'affiche
- [ ] Vote fonctionne après CAPTCHA
