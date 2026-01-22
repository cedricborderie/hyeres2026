# Correction : Invalid Configuration dans Vercel

## 🔴 Problème

Vercel affiche "Invalid configuration" lors de l'ajout du domaine.

## 🔍 Causes possibles

### 1. Format du domaine incorrect

Vérifier que le domaine est au format :
- ✅ `staging.hyeres2026.org` (sous-domaine)
- ❌ `staging.hyeres2026.org/` (pas de slash à la fin)
- ❌ `www.staging.hyeres2026.org` (trop de niveaux)

### 2. Branche non sélectionnée

Vérifier que :
- ✅ La branche `staging` est bien sélectionnée dans le dropdown
- ❌ Pas "All Branches" ou vide

### 3. Domaine déjà utilisé

Vérifier que :
- Le domaine `staging.hyeres2026.org` n'est pas déjà configuré ailleurs
- Dans Vercel Dashboard → Settings → Domains, vérifier s'il existe déjà

### 4. Problème de permissions DNS

Vercel doit pouvoir vérifier que vous possédez le domaine. Si c'est la première fois :
- Vercel vous demandera de configurer le DNS
- L'erreur peut apparaître si le DNS n'est pas encore configuré

## ✅ Solutions

### Solution 1 : Vérifier le format du domaine

1. Dans le champ "Domain", vérifier que c'est exactement : `staging.hyeres2026.org`
2. Pas d'espaces avant/après
3. Pas de slash à la fin
4. Pas de `https://` au début

### Solution 2 : Vérifier la branche

1. Dans le dropdown "All Branches", sélectionner **"staging"**
2. Ne pas laisser "All Branches" sélectionné

### Solution 3 : Vérifier les domaines existants

1. Vercel Dashboard → Votre projet → **Settings** → **Domains**
2. Vérifier si `staging.hyeres2026.org` existe déjà
3. Si oui, le supprimer et le recréer

### Solution 4 : Utiliser l'URL automatique Vercel (temporaire)

Si le domaine personnalisé pose problème, vous pouvez d'abord utiliser l'URL automatique :

1. Vercel Dashboard → **Deployments**
2. Trouver le déploiement de la branche `staging`
3. Cliquer sur le déploiement
4. L'URL de prévisualisation est affichée (ex: `https://hyeres2026-git-staging-cedricborderie.vercel.app`)
5. Utiliser cette URL pour tester la préproduction

Ensuite, configurer le domaine personnalisé une fois que tout fonctionne.

## 🔍 Diagnostic

### Vérifier le message d'erreur exact

Dans Vercel, regarder le message d'erreur complet. Il peut indiquer :
- "Domain already exists" → Le domaine est déjà configuré
- "Invalid domain format" → Format incorrect
- "DNS not configured" → DNS à configurer
- "Branch not found" → La branche staging n'existe pas

### Vérifier la configuration actuelle

1. Vercel Dashboard → Settings → **Domains**
2. Voir quels domaines sont déjà configurés
3. Vérifier s'il y a des conflits

## 📋 Checklist

- [ ] Format du domaine correct : `staging.hyeres2026.org` (sans https://, sans slash)
- [ ] Branche `staging` sélectionnée (pas "All Branches")
- [ ] Environnement "Pre-Production" sélectionné
- [ ] Le domaine n'existe pas déjà dans Vercel
- [ ] La branche staging existe sur GitHub

## 🆘 Si rien ne fonctionne

1. **Utiliser l'URL automatique Vercel** pour tester la préproduction
2. **Configurer le domaine personnalisé plus tard** une fois que tout fonctionne
3. **Contacter le support Vercel** si le problème persiste
