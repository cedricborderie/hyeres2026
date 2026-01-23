# Diagnostic Complet Turnstile sur Staging

## 🔍 Checklist de diagnostic

### 1. Variables d'environnement dans Vercel

**Vérifier dans Vercel Dashboard :**
1. Settings → Environment Variables
2. Pour l'environnement **Preview** (ou **Staging**), vérifier :

```env
NEXT_PUBLIC_TURNSTILE_SITE_KEY=0x4AAAAAACNnq62ppdT8Ei2e
TURNSTILE_SECRET_KEY=0x4AAAAAACNnqygx7qAZ84Km0JVfFtSPPHM
JWT_SECRET_KEY=95ed88443338758e5cf7c8abe6ad88945b3e3a42b5abd0962182bcbd66a7d7a0
```

**Points à vérifier :**
- ✅ Les variables sont bien dans **Preview** (pas seulement Production)
- ✅ `NEXT_PUBLIC_TURNSTILE_SITE_KEY` commence bien par `0x4AAAAAA...`
- ✅ `TURNSTILE_SECRET_KEY` correspond à la clé secrète du site Turnstile

### 2. Configuration Cloudflare Turnstile

**Vérifier dans Cloudflare Dashboard :**
1. Aller sur [Cloudflare Turnstile](https://dash.cloudflare.com/?to=/:account/turnstile)
2. Sélectionner votre site Turnstile
3. Vérifier la section **"Domains"** :
   - ✅ `staging.hyeres2026.org` est dans la liste
   - ✅ L'URL Vercel de staging est aussi autorisée (ex: `[projet]-git-staging-[user].vercel.app`)

**Si le domaine n'est pas autorisé :**
- Ajouter le domaine dans la configuration Turnstile
- Sauvegarder
- Attendre quelques minutes pour la propagation

### 3. Redéploiement après modification

⚠️ **CRITIQUE** : Après avoir ajouté/modifié les variables d'environnement ou le domaine dans Turnstile, un **redéploiement est obligatoire**.

**Option A : Redéployer depuis Vercel**
1. Vercel Dashboard → **Deployments**
2. Trouver le dernier déploiement de `staging`
3. Cliquer sur **"..."** → **"Redeploy"**
4. ⚠️ Cocher **"Use existing Build Cache"** = **DÉCOCHÉ** (pour forcer le rebuild avec les nouvelles variables)

**Option B : Trigger un nouveau déploiement**
```bash
# Sur la branche staging
git commit --allow-empty -m "Trigger redeploy for Turnstile fix"
git push origin staging
```

### 4. Vérifier dans la console du navigateur

**Sur staging, ouvrir les DevTools (F12) :**

1. **Console** → Chercher les messages :
   - `"VoteGatekeeper - Turnstile siteKey: présente"` ✅
   - `"VoteGatekeeper - Turnstile siteKey: manquante"` ❌

2. **Si "manquante"** :
   - La variable `NEXT_PUBLIC_TURNSTILE_SITE_KEY` n'est pas accessible côté client
   - Vérifier qu'elle est bien dans Vercel pour Preview
   - Redéployer (sans cache)

3. **Network** → Chercher les requêtes vers :
   - `challenges.cloudflare.com/turnstile/v0/siteverify`
   - Vérifier si la requête est faite et la réponse

### 5. Vérifier les logs serveur dans Vercel

**Dans Vercel Dashboard :**
1. Aller dans **Deployments** → Sélectionner le déploiement staging
2. Cliquer sur **"Functions"** ou **"Logs"**
3. Chercher les erreurs liées à :
   - `TURNSTILE_SECRET_KEY not configured`
   - `Error verifying Turnstile token`

### 6. Test du modal Turnstile

**Sur staging, tester :**
1. Aller sur `https://staging.hyeres2026.org/propositions`
2. Cliquer sur "Je soutiens" pour une proposition
3. **Comportement attendu** :
   - Le modal Turnstile s'affiche
   - Le widget Turnstile est visible
   - Après validation, le vote fonctionne

**Si le modal ne s'affiche pas :**
- Vérifier la console du navigateur (erreurs JavaScript)
- Vérifier que `NEXT_PUBLIC_TURNSTILE_SITE_KEY` est bien présente
- Vérifier que le domaine est autorisé dans Turnstile

## 🔧 Solutions par problème

### Problème 1 : Le modal ne s'affiche pas du tout

**Causes possibles :**
- Variable `NEXT_PUBLIC_TURNSTILE_SITE_KEY` manquante ou incorrecte
- Domaine non autorisé dans Turnstile
- Erreur JavaScript empêchant le rendu

**Solution :**
1. Vérifier les variables dans Vercel (Preview)
2. Vérifier le domaine dans Turnstile
3. Redéployer sans cache
4. Vérifier la console du navigateur

### Problème 2 : Le modal s'affiche mais le widget Turnstile est vide/erreur

**Causes possibles :**
- Clé site incorrecte
- Domaine non autorisé
- Problème de chargement du script Turnstile

**Solution :**
1. Vérifier que la clé site dans Vercel correspond à celle dans Turnstile
2. Vérifier que le domaine staging est bien autorisé
3. Vérifier la console pour les erreurs de chargement

### Problème 3 : Le CAPTCHA se valide mais le vote échoue

**Causes possibles :**
- `TURNSTILE_SECRET_KEY` manquante ou incorrecte
- Problème de vérification côté serveur

**Solution :**
1. Vérifier `TURNSTILE_SECRET_KEY` dans Vercel (Preview)
2. Vérifier les logs serveur dans Vercel
3. Vérifier que la clé secrète correspond à celle du site Turnstile

### Problème 4 : Erreur "TURNSTILE_SECRET_KEY not configured"

**Solution :**
1. Ajouter `TURNSTILE_SECRET_KEY` dans Vercel pour Preview
2. Redéployer (sans cache)

## ✅ Checklist complète

- [ ] Variables d'environnement configurées dans Vercel pour **Preview**
- [ ] `NEXT_PUBLIC_TURNSTILE_SITE_KEY` présente et correcte
- [ ] `TURNSTILE_SECRET_KEY` présente et correcte
- [ ] `JWT_SECRET_KEY` présente
- [ ] Domaine `staging.hyeres2026.org` autorisé dans Cloudflare Turnstile
- [ ] URL Vercel de staging autorisée dans Turnstile (si utilisée)
- [ ] Redéploiement effectué **sans cache** après modifications
- [ ] Console navigateur : `"Turnstile siteKey: présente"`
- [ ] Modal Turnstile s'affiche
- [ ] Widget Turnstile se charge
- [ ] Validation du CAPTCHA fonctionne
- [ ] Vote fonctionne après validation

## 🧪 Test de diagnostic

**Exécuter dans la console du navigateur sur staging :**

```javascript
// Vérifier si la clé est accessible
console.log('Turnstile Site Key:', process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY);

// Vérifier si le composant Turnstile est chargé
console.log('Turnstile component:', typeof window !== 'undefined' ? 'Available' : 'Not available');
```

**Si `undefined` :**
- La variable n'est pas accessible côté client
- Vérifier qu'elle est bien dans Vercel pour Preview
- Redéployer sans cache

## 📝 Configuration complète Vercel Preview

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

## 🆘 Si rien ne fonctionne

1. **Vérifier les logs de build** dans Vercel pour voir si les variables sont bien injectées
2. **Vérifier les logs runtime** dans Vercel (Functions) pour voir les erreurs serveur
3. **Tester avec l'URL Vercel** de staging au lieu du domaine personnalisé
4. **Vérifier que le package** `@marsidev/react-turnstile` est bien dans `package.json`
5. **Vérifier la version** de Next.js (doit être compatible)

## 🔄 Redéploiement complet

Si le problème persiste, faire un redéploiement complet :

1. Vercel Dashboard → Deployments
2. Trouver le déploiement staging
3. **"..."** → **"Redeploy"**
4. ⚠️ **Décocher** "Use existing Build Cache"
5. Cliquer sur **"Redeploy"**
6. Attendre la fin du build
7. Tester à nouveau
