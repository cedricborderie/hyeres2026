# Guide : Créer et gérer des branches Git

## 📋 Vérifier l'état actuel

```bash
# Voir toutes les branches (locales et distantes)
git branch -a

# Voir sur quelle branche vous êtes
git branch
# L'astérisque (*) indique la branche actuelle
```

## 🆕 Créer une nouvelle branche

### Option 1 : Créer et basculer en une seule commande

```bash
git checkout -b nom-de-la-branche
```

Exemple :
```bash
git checkout -b staging
```

### Option 2 : Créer puis basculer (2 étapes)

```bash
# 1. Créer la branche
git branch nom-de-la-branche

# 2. Basculer sur la branche
git checkout nom-de-la-branche
```

## 📤 Pousser une branche sur GitHub

Une fois que vous avez créé une branche locale, poussez-la sur GitHub :

```bash
git push -u origin nom-de-la-branche
```

Le `-u` configure le suivi, donc les prochains `git push` seront automatiques.

Exemple :
```bash
git push -u origin staging
```

## 🔄 Basculer entre les branches

```bash
# Basculer sur main
git checkout main

# Basculer sur staging
git checkout staging

# Ou avec la nouvelle syntaxe Git
git switch staging
```

## 📋 Commandes utiles

### Voir toutes les branches
```bash
git branch -a
```

### Voir les branches distantes
```bash
git branch -r
```

### Supprimer une branche locale
```bash
git branch -d nom-de-la-branche
```

### Supprimer une branche distante
```bash
git push origin --delete nom-de-la-branche
```

## 🎯 Workflow typique

### Créer une branche pour une nouvelle fonctionnalité

```bash
# 1. S'assurer d'être sur main et à jour
git checkout main
git pull origin main

# 2. Créer une nouvelle branche
git checkout -b feature/nom-fonctionnalite

# 3. Faire vos modifications
# ...

# 4. Commiter
git add .
git commit -m "Description des modifications"

# 5. Pousser la branche
git push -u origin feature/nom-fonctionnalite
```

### Merger une branche dans main

```bash
# 1. Basculer sur main
git checkout main

# 2. Merger la branche
git merge nom-de-la-branche

# 3. Pousser
git push origin main
```

## ✅ Vérification

Après avoir créé et poussé une branche :

1. **Vérifier localement** :
   ```bash
   git branch -a
   ```
   Vous devriez voir votre branche avec un astérisque (*) si vous êtes dessus.

2. **Vérifier sur GitHub** :
   - Aller sur https://github.com/cedricborderie/hyeres2026/branches
   - Votre branche devrait apparaître dans la liste

3. **Vérifier dans Vercel** :
   - Vercel détectera automatiquement la nouvelle branche
   - Un déploiement sera créé automatiquement
