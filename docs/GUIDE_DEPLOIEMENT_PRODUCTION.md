# Guide de Déploiement en Production

## ⚠️ IMPORTANT : Vérifications avant déploiement

Avant de déployer en production, vérifier :

- [ ] ✅ Les tests ont été effectués sur staging
- [ ] ✅ Tout fonctionne correctement sur staging
- [ ] ✅ Vous êtes sur la branche `main` (pas `staging`)
- [ ] ✅ Les migrations SQL seront exécutées dans le projet **PRODUCTION** Supabase

## 🚀 Étapes de déploiement

### 1. Vérifier que vous êtes sur main

```bash
git branch --show-current
```

Doit afficher : `main`

Si vous êtes sur `staging`, basculer sur `main` :
```bash
git checkout main
```

### 2. Mettre à jour main avec staging

```bash
# S'assurer que main est à jour
git pull origin main

# Merger staging dans main
git merge staging

# Résoudre les conflits s'il y en a (normalement il ne devrait pas y en avoir)
```

### 3. Pousser vers GitHub

```bash
git push origin main
```

### 4. Vercel déploie automatiquement

- ✅ Vercel détecte automatiquement le push sur `main`
- ✅ Un nouveau déploiement est lancé automatiquement
- ✅ Suivre le déploiement dans le dashboard Vercel

## 🗄️ Migrations SQL en PRODUCTION

⚠️ **CRITIQUE** : Exécuter les migrations dans le projet **PRODUCTION** Supabase, pas préproduction !

### 1. Se connecter à Supabase PRODUCTION

1. Aller sur [Supabase Dashboard](https://supabase.com/dashboard)
2. ⚠️ **Vérifier** que vous sélectionnez le projet **PRODUCTION** :
   - **Projet PRODUCTION** : `hvynvggcxxpbavrarbcb`
   - ❌ **PAS le projet préproduction** : `qxvnbkknudogisxtumfw`

### 2. Exécuter les migrations dans l'ordre

**Migration 019** : `supabase/migrations/019_insert_agriculture_proposals.sql`
- Ajoute les 22 propositions Agriculture
- Supprime l'ancien placeholder a1

**Migration 020** : `supabase/migrations/020_update_mobilites_proposals.sql`
- Met à jour les 14 propositions Mobilités
- Supprime m15

**Migration 021** : `supabase/migrations/021_add_manifesto_links.sql`
- Ajoute la colonne `manifesto_url` aux catégories
- Remplit les liens PDF pour chaque catégorie

### 3. Vérifications après exécution

```sql
-- Vérifier Agriculture (doit retourner 22)
SELECT COUNT(*) FROM proposals 
WHERE category_id = '00000000-0000-0000-0000-000000000003';

-- Vérifier Mobilités (doit retourner 14)
SELECT COUNT(*) FROM proposals 
WHERE category_id = '00000000-0000-0000-0000-000000000002';

-- Vérifier les manifestes
SELECT id, name, manifesto_url FROM categories ORDER BY id;
-- Doit afficher 3 lignes avec manifesto_url rempli
```

## 🔒 Vérifications de sécurité

### Variables d'environnement Vercel

Dans Vercel Dashboard → Settings → Environment Variables :

**Production** doit avoir :
- ✅ `NEXT_PUBLIC_SUPABASE_URL` = `https://hvynvggcxxpbavrarbcb.supabase.co` (PRODUCTION)
- ✅ `SUPABASE_SERVICE_ROLE_KEY` = Clé du projet **PRODUCTION**
- ✅ `NEXT_PUBLIC_TURNSTILE_SITE_KEY` = Clé Turnstile
- ✅ `TURNSTILE_SECRET_KEY` = Clé secrète Turnstile
- ✅ `JWT_SECRET_KEY` = Clé JWT

⚠️ **NE JAMAIS** utiliser les clés de préproduction en production !

### Projet Supabase

- ✅ Production : `hvynvggcxxpbavrarbcb`
- ✅ Préproduction : `qxvnbkknudogisxtumfw`
- ✅ **Totalement séparés** = Aucun risque

## ✅ Tests post-déploiement

Une fois déployé, tester sur `www.hyeres2026.org` :

- [ ] Page d'accueil s'affiche correctement
- [ ] Page Propositions avec les 3 catégories
- [ ] Les 22 propositions Agriculture s'affichent
- [ ] Les 14 propositions Mobilités s'affichent
- [ ] Les liens "Télécharger les recommandations" fonctionnent
- [ ] Les votes fonctionnent
- [ ] La page Mentions Légales est accessible (`/mentions-legales`)
- [ ] Le lien Mentions Légales dans le footer fonctionne

## 📋 Checklist complète

### Avant le merge
- [ ] Tests effectués sur staging
- [ ] Tout fonctionne sur staging
- [ ] Migrations SQL testées sur préproduction
- [ ] Code prêt pour production

### Pendant le déploiement
- [ ] Basculer sur `main`
- [ ] Merger `staging` dans `main`
- [ ] Pousser vers GitHub
- [ ] Vérifier le déploiement Vercel

### Après le déploiement
- [ ] Exécuter les migrations SQL en PRODUCTION
- [ ] Vérifier les données dans Supabase PRODUCTION
- [ ] Tester le site en production
- [ ] Vérifier que tout fonctionne

## 🆘 Dépannage

### Le déploiement échoue
- Vérifier les logs de build dans Vercel
- Vérifier les variables d'environnement
- Vérifier qu'il n'y a pas d'erreurs TypeScript/ESLint

### Les données ne s'affichent pas
- Vérifier que les migrations SQL ont été exécutées en PRODUCTION
- Vérifier les variables d'environnement dans Vercel (environnement Production)
- Vérifier que vous utilisez le bon projet Supabase

### Erreur lors de l'exécution des migrations
- Vérifier que vous êtes dans le projet PRODUCTION Supabase
- Vérifier les logs d'erreur dans Supabase
- Vérifier que les migrations précédentes ont été exécutées

## 🎯 Résumé rapide

```bash
# 1. Vérifier la branche
git branch --show-current  # Doit être "main"

# 2. Mettre à jour et merger
git pull origin main
git merge staging

# 3. Pousser (déploie automatiquement)
git push origin main

# 4. Exécuter les migrations SQL en PRODUCTION Supabase
# 5. Tester sur www.hyeres2026.org
```

## ⚠️ Rappel important

- **Production Supabase** : `hvynvggcxxpbavrarbcb`
- **Préproduction Supabase** : `qxvnbkknudogisxtumfw`
- **Toujours vérifier** le projet actif avant d'exécuter des migrations SQL !
