# 🔒 Séparation Production / Préproduction - Sécurité

## ✅ Aucun risque si vous suivez ces règles

### 1. Variables d'environnement séparées

**CRITIQUE** : Utiliser des projets Supabase différents pour prod et staging.

#### Production (Vercel)
- Projet Supabase : `hvynvggcxxpbavrarbcb` (production)
- Variables dans Vercel : Environnement **"Production"**
- URL : `www.hyeres2026.org`

#### Préproduction (Vercel)
- Projet Supabase : `qxvnbkknudogisxtumfw` (préproduction)
- Variables dans Vercel : Environnement **"Preview"** ou **"Staging"**
- URL : `https://[projet]-git-staging-[user].vercel.app`

### 2. Vérification des variables dans Vercel

Dans Vercel Dashboard → Settings → Environment Variables :

**Production :**
- ✅ `NEXT_PUBLIC_SUPABASE_URL` = `https://hvynvggcxxpbavrarbcb.supabase.co`
- ✅ `SUPABASE_SERVICE_ROLE_KEY` = Clé du projet **production**

**Preview/Staging :**
- ✅ `NEXT_PUBLIC_SUPABASE_URL` = `https://qxvnbkknudogisxtumfw.supabase.co`
- ✅ `SUPABASE_SERVICE_ROLE_KEY` = Clé du projet **préproduction**

⚠️ **NE JAMAIS** utiliser les clés de production dans staging !

### 3. Scripts SQL séparés

**CRITIQUE** : Exécuter les scripts SQL dans le bon projet Supabase.

- ✅ Script `000_full_schema_preproduction.sql` → Projet **préproduction** uniquement
- ✅ Migrations de production → Projet **production** uniquement

**Vérification avant exécution :**
1. Vérifier l'URL dans le dashboard Supabase
2. Vérifier le nom du projet
3. Ne jamais exécuter un script sans vérifier le projet actif

### 4. Branches Git séparées

- ✅ `main` → Production (déploiement automatique)
- ✅ `staging` → Préproduction (déploiement automatique)

**Protection de la branche main :**
- Dans GitHub, vous pouvez protéger la branche `main` :
  - Settings → Branches → Add rule
  - Require pull request before merging
  - Require approvals

### 5. Checklist de sécurité

Avant chaque action, vérifier :

#### Avant d'exécuter un script SQL
- [ ] Je suis dans le bon projet Supabase (vérifier l'URL)
- [ ] Le script est destiné à ce projet
- [ ] Je ne vais pas affecter la production

#### Avant de modifier les variables Vercel
- [ ] Je modifie le bon environnement (Production vs Preview)
- [ ] Les clés correspondent au bon projet Supabase
- [ ] Je ne mélange pas les clés de prod et staging

#### Avant de pousser du code
- [ ] Je suis sur la bonne branche (`staging` pour préprod, `main` pour prod)
- [ ] Le code ne contient pas de secrets
- [ ] Les variables d'environnement ne sont pas dans le code

## 🛡️ Protections en place

### 1. .gitignore
- ✅ Tous les fichiers `.env*` sont ignorés
- ✅ Aucun secret ne peut être commité par accident

### 2. Vercel
- ✅ Variables d'environnement séparées par environnement
- ✅ Production et Preview sont des déploiements séparés

### 3. Supabase
- ✅ Projets séparés = bases de données séparées
- ✅ Aucun risque de mélange des données

## ⚠️ Risques à éviter

### ❌ NE PAS faire

1. **Utiliser les clés de production dans staging**
   - Risque : Staging pourrait modifier les données de production

2. **Exécuter un script SQL sans vérifier le projet**
   - Risque : Modifier la base de données de production par erreur

3. **Merger staging dans main sans vérification**
   - Risque : Déployer du code non testé en production

4. **Partager les clés service_role publiquement**
   - Risque : Quelqu'un pourrait modifier les données

### ✅ À faire

1. **Toujours vérifier le projet Supabase actif** avant d'exécuter un script
2. **Utiliser des projets Supabase différents** pour prod et staging
3. **Vérifier les variables d'environnement** dans Vercel avant déploiement
4. **Tester en staging** avant de déployer en production

## 🔍 Vérification rapide

### Vérifier que tout est séparé

1. **Supabase** :
   - Projet Production : `hvynvggcxxpbavrarbcb`
   - Projet Préproduction : `qxvnbkknudogisxtumfw`
   - ✅ Projets différents = Aucun risque

2. **Vercel** :
   - Production : Variables dans "Production"
   - Staging : Variables dans "Preview"
   - ✅ Environnements séparés = Aucun risque

3. **Git** :
   - `main` → Production
   - `staging` → Préproduction
   - ✅ Branches séparées = Aucun risque

## ✅ Conclusion

**Aucun risque si vous :**
- ✅ Utilisez des projets Supabase différents
- ✅ Configurez les variables dans les bons environnements Vercel
- ✅ Vérifiez toujours le projet actif avant d'exécuter un script SQL
- ✅ Ne mélangez jamais les clés de prod et staging

La séparation est complète : production et préproduction sont totalement indépendantes.
