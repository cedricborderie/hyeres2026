# Guide de Déploiement sur Staging

## 📋 Vue d'ensemble

Ce guide vous accompagne pour déployer les modifications sur l'environnement de **staging** (préproduction).

## ✅ Prérequis

- ✅ Vous êtes sur la branche `staging`
- ✅ Les modifications sont prêtes à être déployées
- ✅ Le projet Supabase de préproduction est configuré (`qxvnbkknudogisxtumfw`)
- ✅ Vercel est configuré pour déployer automatiquement la branche `staging`

## 🚀 Étapes de déploiement

### 1. Vérifier l'état actuel

```bash
# Vérifier que vous êtes sur staging
git branch

# Voir les modifications en attente
git status
```

### 2. Préparer les fichiers pour le commit

```bash
# Ajouter tous les fichiers modifiés et nouveaux
git add .

# Vérifier ce qui sera commité
git status
```

### 3. Créer un commit

```bash
# Créer un commit avec un message descriptif
git commit -m "Mise à jour staging: ajout propositions agriculture, mise à jour mobilités, ajout liens manifestes"
```

**Exemple de message de commit :**
```
Mise à jour staging

- Ajout des 22 propositions Agriculture & Alimentation
- Mise à jour des 14 propositions Mobilités & Vélo
- Ajout des liens PDF manifestes pour chaque catégorie
- Ajout page Mentions Légales
- Corrections diverses (vote, footer, etc.)
```

### 4. Pousser vers GitHub

```bash
# Pousser la branche staging vers GitHub
git push origin staging
```

### 5. Vercel déploie automatiquement

Une fois le push effectué :
- ✅ Vercel détecte automatiquement le push sur `staging`
- ✅ Un nouveau déploiement est lancé automatiquement
- ✅ Vous pouvez suivre le déploiement dans le dashboard Vercel

### 6. Vérifier le déploiement

1. Aller sur [Vercel Dashboard](https://vercel.com/dashboard)
2. Sélectionner votre projet
3. Vérifier que le déploiement de la branche `staging` est en cours/succès
4. Cliquer sur le déploiement pour voir les logs si nécessaire

### 7. Tester sur staging

Une fois le déploiement terminé, tester sur :
- **URL Vercel** : `https://[projet]-git-staging-[user].vercel.app`
- **URL personnalisée** : `https://staging.hyeres2026.org` (si configuré)

**Tests à effectuer :**
- [ ] Page d'accueil s'affiche correctement
- [ ] Page Propositions avec les 3 catégories
- [ ] Les 22 propositions Agriculture s'affichent
- [ ] Les 14 propositions Mobilités s'affichent
- [ ] Les liens "Télécharger les recommandations" fonctionnent
- [ ] Les votes fonctionnent
- [ ] La page Mentions Légales est accessible

## 🗄️ Migrations SQL (si nécessaire)

Si vous avez ajouté de nouvelles migrations SQL (comme `021_add_manifesto_links.sql`), les exécuter dans Supabase de préproduction :

### 1. Se connecter à Supabase Préproduction

1. Aller sur [Supabase Dashboard](https://supabase.com/dashboard)
2. Sélectionner le projet **préproduction** (`qxvnbkknudogisxtumfw`)
3. ⚠️ **Vérifier** que vous êtes bien dans le projet préproduction (pas production !)

### 2. Exécuter les migrations

1. Aller dans **SQL Editor**
2. Ouvrir le fichier de migration (ex: `supabase/migrations/021_add_manifesto_links.sql`)
3. Copier le contenu
4. Coller dans l'éditeur SQL
5. Cliquer sur **Run** (ou `Ctrl+Enter` / `Cmd+Enter`)
6. Vérifier qu'il n'y a pas d'erreurs

### 3. Vérifier les données

```sql
-- Vérifier les catégories avec manifesto_url
SELECT id, name, slug, manifesto_url FROM categories ORDER BY id;

-- Vérifier les propositions Agriculture (doit retourner 22)
SELECT COUNT(*) FROM proposals WHERE category_id = '00000000-0000-0000-0000-000000000003';

-- Vérifier les propositions Mobilités (doit retourner 14)
SELECT COUNT(*) FROM proposals WHERE category_id = '00000000-0000-0000-0000-000000000002';
```

## 🔒 Vérifications de sécurité

Avant de déployer, vérifier :

- [ ] ✅ Vous êtes sur la branche `staging` (pas `main`)
- [ ] ✅ Aucun fichier `.env*` n'est commité
- [ ] ✅ Aucune clé secrète n'est dans le code
- [ ] ✅ Les migrations SQL seront exécutées dans le projet **préproduction** (pas production)

## 📝 Checklist complète

### Avant le commit
- [ ] Code testé localement
- [ ] Build fonctionne : `npm run build`
- [ ] Pas d'erreurs TypeScript : `npx tsc --noEmit`
- [ ] Pas d'erreurs ESLint : `npm run lint`
- [ ] Fichiers sensibles non commités

### Après le push
- [ ] Déploiement Vercel réussi
- [ ] Site accessible sur staging
- [ ] Migrations SQL exécutées (si nouvelles)
- [ ] Tests fonctionnels effectués

## 🆘 Dépannage

### Le déploiement échoue sur Vercel

1. Vérifier les logs de build dans Vercel
2. Vérifier les erreurs TypeScript/ESLint
3. Vérifier que toutes les dépendances sont dans `package.json`

### Les données ne s'affichent pas

1. Vérifier que les migrations SQL ont été exécutées
2. Vérifier les variables d'environnement dans Vercel (environnement Preview)
3. Vérifier que vous utilisez le bon projet Supabase

### Les votes ne fonctionnent pas

1. Vérifier les variables d'environnement Supabase dans Vercel
2. Vérifier les permissions dans Supabase
3. Vérifier les logs Supabase pour les erreurs

## 🔄 Workflow complet

```bash
# 1. Vérifier la branche
git branch  # Doit afficher * staging

# 2. Ajouter les modifications
git add .

# 3. Commiter
git commit -m "Description des modifications"

# 4. Pousser (déploie automatiquement)
git push origin staging

# 5. Attendre le déploiement Vercel
# 6. Tester sur staging.hyeres2026.org
# 7. Exécuter les migrations SQL si nécessaire
```

## ✅ C'est prêt !

Une fois toutes ces étapes complétées, votre staging est à jour !

Pour déployer en production, merger `staging` dans `main` :
```bash
git checkout main
git merge staging
git push origin main
```
