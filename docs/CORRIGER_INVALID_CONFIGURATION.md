# Corriger "Invalid Configuration" pour staging.hyeres2026.org

## 🔴 Problème

Le domaine `staging.hyeres2026.org` affiche "Invalid Configuration" dans Vercel, même s'il est assigné à la branche `staging`.

## 🔍 Causes possibles

### 1. DNS non configuré (le plus probable)

Vercel ne peut pas vérifier que vous possédez le domaine car le DNS n'est pas configuré.

### 2. Pas de déploiement pour la branche staging

Si la branche `staging` n'a pas encore été déployée, Vercel ne peut pas valider la configuration.

### 3. Configuration DNS incorrecte

Le DNS est configuré mais pointe vers le mauvais endroit.

## ✅ Solutions

### Solution 1 : Configurer le DNS

1. **Cliquer sur "Learn more"** à côté de "Invalid Configuration"
2. Vercel vous donnera les instructions DNS exactes
3. Généralement, il faut ajouter un **CNAME** :
   - **Type** : CNAME
   - **Nom** : `staging` (ou `staging.hyeres2026.org`)
   - **Valeur** : Vercel vous donnera une valeur (ex: `cname.vercel-dns.com` ou similaire)

4. **Configurer dans votre gestionnaire DNS** (là où vous gérez `hyeres2026.org`)
5. **Attendre la propagation DNS** (quelques minutes à quelques heures)

### Solution 2 : Vérifier qu'il y a un déploiement staging

1. Vercel Dashboard → **Deployments**
2. Vérifier qu'il y a un déploiement pour la branche `staging`
3. Si pas de déploiement :
   - Faire un petit changement sur la branche staging
   - Commiter et pousser :
     ```bash
     git add .
     git commit -m "Trigger deployment"
     git push
     ```

### Solution 3 : Utiliser l'URL automatique en attendant

En attendant que le DNS soit configuré :

1. Vercel Dashboard → **Deployments**
2. Trouver le déploiement de la branche `staging`
3. Utiliser l'URL de prévisualisation affichée (ex: `https://hyeres2026-git-staging-cedricborderie.vercel.app`)
4. Cette URL fonctionne immédiatement, sans configuration DNS

## 📋 Étapes détaillées pour configurer le DNS

### 1. Obtenir les instructions Vercel

1. Dans Vercel Dashboard → Settings → Domains
2. Cliquer sur le domaine `staging.hyeres2026.org`
3. Cliquer sur "Learn more" ou "Configure DNS"
4. Vercel affichera les instructions exactes

### 2. Configurer dans votre gestionnaire DNS

1. Aller dans votre gestionnaire DNS (ex: Cloudflare, OVH, etc.)
2. Ajouter un enregistrement CNAME :
   - **Type** : CNAME
   - **Nom** : `staging` (ou `staging.hyeres2026.org` selon votre fournisseur)
   - **Valeur** : La valeur fournie par Vercel
   - **TTL** : 3600 (ou automatique)

### 3. Vérifier la configuration

Après avoir configuré le DNS :

1. Attendre quelques minutes (propagation DNS)
2. Dans Vercel, le statut devrait passer à "Valid Configuration"
3. Tester : `https://staging.hyeres2026.org`

## 🔍 Diagnostic

### Vérifier le DNS

Vous pouvez vérifier si le DNS est configuré avec :

```bash
# Dans le terminal
nslookup staging.hyeres2026.org
# ou
dig staging.hyeres2026.org
```

Si le DNS n'est pas configuré, vous verrez une erreur "NXDOMAIN" ou similaire.

### Vérifier les déploiements

1. Vercel Dashboard → **Deployments**
2. Filtrer par branche "staging"
3. Vérifier qu'il y a au moins un déploiement

## ✅ Checklist

- [ ] DNS configuré (CNAME pointant vers Vercel)
- [ ] Propagation DNS terminée (attendre quelques minutes)
- [ ] Déploiement staging existe dans Vercel
- [ ] Statut passe à "Valid Configuration"
- [ ] Test : `https://staging.hyeres2026.org` fonctionne

## 🆘 Si le problème persiste

1. **Cliquer sur "Learn more"** dans Vercel pour voir les détails de l'erreur
2. **Vérifier le DNS** avec `nslookup` ou `dig`
3. **Contacter le support Vercel** si nécessaire
