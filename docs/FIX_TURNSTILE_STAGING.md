# Résoudre le problème Cloudflare Turnstile sur Staging

## 🔍 Diagnostic

Si Cloudflare Turnstile ne fonctionne pas sur staging, vérifier les points suivants :

### 1. Variables d'environnement dans Vercel

Les variables d'environnement doivent être configurées pour l'environnement **Preview** (ou **Staging**) dans Vercel.

#### Vérifier dans Vercel Dashboard :

1. Aller sur [Vercel Dashboard](https://vercel.com/dashboard)
2. Sélectionner votre projet
3. Aller dans **Settings** → **Environment Variables**
4. Vérifier que les variables suivantes existent pour l'environnement **Preview** :

```env
NEXT_PUBLIC_TURNSTILE_SITE_KEY=0x4AAAAAACNnq62ppdT8Ei2e
TURNSTILE_SECRET_KEY=0x4AAAAAACNnqygx7qAZ84Km0JVfFtSPPHM
JWT_SECRET_KEY=95ed88443338758e5cf7c8abe6ad88945b3e3a42b5abd0962182bcbd66a7d7a0
```

⚠️ **Important** : 
- `NEXT_PUBLIC_TURNSTILE_SITE_KEY` doit être dans **Preview** (pas seulement Production)
- `TURNSTILE_SECRET_KEY` doit être dans **Preview**
- `JWT_SECRET_KEY` doit être dans **Preview**

### 2. Configuration du domaine dans Cloudflare Turnstile

Si vous utilisez un domaine personnalisé (`staging.hyeres2026.org`), vérifier que le domaine est autorisé dans Cloudflare Turnstile :

1. Aller sur [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Sélectionner votre compte
3. Aller dans **Turnstile** → **Sites**
4. Vérifier que le domaine `staging.hyeres2026.org` (ou l'URL Vercel de staging) est dans la liste des domaines autorisés

**Si le domaine n'est pas autorisé :**
- Ajouter le domaine dans la configuration Turnstile
- Ou utiliser l'URL Vercel de staging dans la configuration

### 3. Redéployer après modification des variables

Après avoir ajouté/modifié les variables d'environnement dans Vercel :

1. Aller dans **Deployments**
2. Trouver le dernier déploiement de la branche `staging`
3. Cliquer sur **"Redeploy"** (ou faire un nouveau push sur `staging`)

⚠️ **Important** : Les variables d'environnement ne sont chargées qu'au moment du build. Un redéploiement est nécessaire après modification.

## 🔧 Solution étape par étape

### Étape 1 : Vérifier les variables dans Vercel

1. Vercel Dashboard → Projet → **Settings** → **Environment Variables**
2. Vérifier que pour **Preview** (ou **Staging**), vous avez :
   - ✅ `NEXT_PUBLIC_TURNSTILE_SITE_KEY`
   - ✅ `TURNSTILE_SECRET_KEY`
   - ✅ `JWT_SECRET_KEY`

**Si elles n'existent pas :**
- Cliquer sur **"Add New"**
- Ajouter chaque variable
- Sélectionner **Preview** comme environnement
- Sauvegarder

### Étape 2 : Vérifier la configuration Turnstile

1. Aller sur [Cloudflare Turnstile](https://dash.cloudflare.com/?to=/:account/turnstile)
2. Vérifier que votre site Turnstile est configuré
3. Vérifier que le domaine staging est autorisé (ou utiliser l'URL Vercel)

### Étape 3 : Redéployer

**Option A : Redéployer depuis Vercel**
1. Vercel Dashboard → **Deployments**
2. Trouver le déploiement staging
3. Cliquer sur **"..."** → **"Redeploy"**

**Option B : Faire un nouveau push**
```bash
# Sur la branche staging
git commit --allow-empty -m "Trigger redeploy for Turnstile config"
git push origin staging
```

### Étape 4 : Tester

1. Aller sur `https://staging.hyeres2026.org` (ou l'URL Vercel staging)
2. Essayer de voter pour une proposition
3. Le modal Turnstile devrait s'afficher
4. Compléter le CAPTCHA
5. Le vote devrait fonctionner

## 🐛 Dépannage

### Le modal Turnstile ne s'affiche pas

**Vérifier dans la console du navigateur :**
1. Ouvrir les DevTools (F12)
2. Aller dans **Console**
3. Vérifier s'il y a des erreurs
4. Chercher le message : `"VoteGatekeeper - Turnstile siteKey: présente"` ou `"manquante"`

**Si "manquante" :**
- La variable `NEXT_PUBLIC_TURNSTILE_SITE_KEY` n'est pas accessible côté client
- Vérifier qu'elle est bien dans Vercel pour Preview
- Redéployer

**Si "présente" mais le modal ne s'affiche pas :**
- Vérifier la configuration du domaine dans Cloudflare Turnstile
- Vérifier qu'il n'y a pas d'erreurs JavaScript dans la console

### Erreur "TURNSTILE_SECRET_KEY not configured"

**Côté serveur :**
- Vérifier que `TURNSTILE_SECRET_KEY` est configurée dans Vercel pour Preview
- Redéployer après ajout

### Le CAPTCHA s'affiche mais la vérification échoue

**Vérifier :**
1. Que `TURNSTILE_SECRET_KEY` correspond à la clé secrète du site Turnstile
2. Que le domaine est autorisé dans Cloudflare Turnstile
3. Les logs serveur dans Vercel pour voir l'erreur exacte

## ✅ Checklist de vérification

- [ ] Variables d'environnement configurées dans Vercel pour **Preview**
- [ ] `NEXT_PUBLIC_TURNSTILE_SITE_KEY` présente
- [ ] `TURNSTILE_SECRET_KEY` présente
- [ ] `JWT_SECRET_KEY` présente
- [ ] Domaine staging autorisé dans Cloudflare Turnstile
- [ ] Redéploiement effectué après modification des variables
- [ ] Test effectué : le modal s'affiche
- [ ] Test effectué : le vote fonctionne après CAPTCHA

## 📝 Configuration complète pour Staging

Dans Vercel Dashboard → Settings → Environment Variables → **Preview** :

```env
# Supabase Préproduction
NEXT_PUBLIC_SUPABASE_URL=https://qxvnbkknudogisxtumfw.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci... (clé anon préproduction)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci... (clé service_role préproduction)

# Cloudflare Turnstile
NEXT_PUBLIC_TURNSTILE_SITE_KEY=0x4AAAAAACNnq62ppdT8Ei2e
TURNSTILE_SECRET_KEY=0x4AAAAAACNnqygx7qAZ84Km0JVfFtSPPHM

# JWT
JWT_SECRET_KEY=95ed88443338758e5cf7c8abe6ad88945b3e3a42b5abd0962182bcbd66a7d7a0
```

⚠️ **Important** : Utiliser les clés du projet **préproduction**, pas production !

## 🆘 Si le problème persiste

1. Vérifier les logs de build dans Vercel
2. Vérifier les logs runtime dans Vercel (Functions)
3. Vérifier la console du navigateur pour les erreurs
4. Vérifier que le package `@marsidev/react-turnstile` est bien installé
