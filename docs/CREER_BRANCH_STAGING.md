# Créer la branche staging

## 📋 Étapes pour créer et pousser la branche staging

### 1. Vérifier sur quelle branche vous êtes

```bash
git branch
```

Vous devriez voir `* main` (vous êtes sur main).

### 2. Créer la branche staging

```bash
git checkout -b staging
```

Cette commande :
- Crée une nouvelle branche `staging`
- Bascule automatiquement sur cette branche

### 3. Pousser la branche sur GitHub

```bash
git push -u origin staging
```

Cette commande :
- Pousse la branche `staging` sur GitHub
- Configure le suivi (`-u origin staging`) pour les futurs push

### 4. Vérifier que la branche existe

```bash
git branch -a
```

Vous devriez voir :
- `* staging` (branche locale, vous êtes dessus)
- `remotes/origin/staging` (branche distante sur GitHub)

## ✅ Après avoir poussé la branche

1. **Vercel détectera automatiquement** la nouvelle branche
2. **Un déploiement automatique** sera créé pour la branche staging
3. **Dans Vercel**, vous pourrez maintenant sélectionner "staging" dans le dropdown

## 🔄 Workflow futur

### Pour travailler sur la préproduction

```bash
# Basculer sur staging
git checkout staging

# Faire vos modifications
# ...

# Commiter
git add .
git commit -m "Vos modifications"

# Pousser (déploie automatiquement sur staging.hyeres2026.org)
git push
```

### Pour déployer en production

```bash
# Basculer sur main
git checkout main

# Merger staging dans main
git merge staging

# Pousser (déploie automatiquement sur www.hyeres2026.org)
git push
```

## 📝 Note

La branche `staging` sera identique à `main` au départ. Vous pouvez ensuite faire des modifications spécifiques à la préproduction sans affecter la production.
