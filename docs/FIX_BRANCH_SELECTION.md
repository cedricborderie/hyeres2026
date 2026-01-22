# Correction : Sélection de branche Git

## 🔴 Problème

Le message d'erreur indique : **"You must select a git branch for preview environments"**

## ✅ Solution

Pour les environnements **Preview/Pre-Production**, Vercel nécessite une branche Git spécifique.

### Étapes à suivre

1. Dans le deuxième dropdown (celui avec "All Branches")
2. Cliquer sur le dropdown
3. Sélectionner la branche **"staging"** (ou la branche que vous utilisez pour la préproduction)
4. Le message d'erreur devrait disparaître
5. Cliquer sur **"Save"**

## 📋 Configuration finale

Vous devriez avoir :
- **Environnement** : Pre-Production ✅
- **Branche Git** : **staging** ✅ (au lieu de "All Branches")

## 🔍 Pourquoi cette exigence ?

Vercel a besoin de savoir quelle branche Git déployer pour l'environnement Preview/Pre-Production. "All Branches" n'est pas suffisant car Vercel ne sait pas quelle branche utiliser.

En sélectionnant "staging", Vercel saura que :
- Chaque push sur la branche `staging` → Déploiement sur `staging.hyeres2026.org`
- Chaque push sur la branche `main` → Déploiement sur `www.hyeres2026.org` (production)

## ✅ Après correction

Une fois que vous avez sélectionné la branche "staging" :
1. Le message d'erreur disparaît
2. Vous pouvez cliquer sur "Save"
3. Vercel vous donnera les instructions DNS
4. Le domaine `staging.hyeres2026.org` sera connecté à la branche `staging`
