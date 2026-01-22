# URL de Préproduction

## 🔍 Comment trouver l'URL de préproduction

### Option 1 : Dans Vercel Dashboard

1. Aller sur https://vercel.com/dashboard
2. Sélectionner votre projet
3. Aller dans **"Deployments"**
4. Chercher le déploiement de la branche **"staging"** (ou "preprod")
5. L'URL de prévisualisation est affichée sous chaque déploiement

**Format typique :**
- `https://plateforme-citoyenne-staging.vercel.app`
- ou `https://plateforme-citoyenne-git-staging-votre-nom.vercel.app`

### Option 2 : URL automatique Vercel

Quand vous poussez une branche sur GitHub, Vercel crée automatiquement une URL de prévisualisation :

**Format :**
```
https://[nom-projet]-git-[branche]-[votre-username].vercel.app
```

Par exemple, si :
- Nom du projet : `hyeres2026` ou `plateforme-citoyenne`
- Branche : `staging`
- Votre username : `cedricborderie`

L'URL serait :
```
https://hyeres2026-git-staging-cedricborderie.vercel.app
```

### Option 3 : Configurer un domaine personnalisé

Dans Vercel Dashboard → Votre projet → **Settings** → **Domains** :

1. Ajouter un domaine personnalisé pour la branche staging
2. Par exemple : `staging.hyeres2026.org` ou `preprod.hyeres2026.org`

## 📋 Vérification

### 1. Vérifier que la branche staging est déployée

1. Vercel Dashboard → **Deployments**
2. Vérifier qu'il y a un déploiement pour la branche **"staging"**
3. Si pas de déploiement, pousser la branche staging :
   ```bash
   git push origin staging
   ```

### 2. Vérifier les variables d'environnement

Dans Vercel Dashboard → **Settings** → **Environment Variables** :

Vérifier que les variables sont configurées pour **"Preview"** (ou créer un environnement "Staging") :
- `NEXT_PUBLIC_SUPABASE_URL` (projet préproduction)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` (clé anon préproduction)
- `SUPABASE_SERVICE_ROLE_KEY` (clé service_role préproduction)
- `NEXT_PUBLIC_TURNSTILE_SITE_KEY`
- `TURNSTILE_SECRET_KEY`
- `JWT_SECRET_KEY`

## 🚀 Accès rapide

Une fois que vous avez l'URL, vous pouvez :

1. **Tester le site** : Ouvrir l'URL dans le navigateur
2. **Tester les votes** : Vérifier que tout fonctionne
3. **Vérifier les logs** : Vercel Dashboard → Logs (filtrer par déploiement staging)

## 📝 Note

L'URL de prévisualisation Vercel change à chaque nouveau commit sur la branche staging. Si vous voulez une URL stable, configurez un domaine personnalisé dans Vercel.
