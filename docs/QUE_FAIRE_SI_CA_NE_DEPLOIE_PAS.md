# Que faire si la préprod ne déploie pas ?

Quand un `git push origin staging` ne déclenche pas de déploiement (ou que le site préprod ne se met pas à jour), vérifier les points ci‑dessous.

---

## 1. Vérifier que le push est bien parti sur GitHub

- Ouvrir : https://github.com/cedricborderie/hyeres2026
- Onglet **Code** → branche **staging**
- Vérifier que le dernier commit (ex. « Import propositions mises à jour… ») est bien présent.

Si le commit n’est pas là, dans le terminal :

```bash
git checkout staging
git push origin staging
```

---

## 2. Vérifier la config Git dans Vercel

1. [Vercel Dashboard](https://vercel.com/dashboard) → ton projet
2. **Settings** → **Git**
3. Vérifier :
   - **Production Branch** = `main` (normal)
   - Pour les **Preview** : que les déploiements de branches soient activés (souvent “All branches” ou équivalent).

Si tu utilises un environnement **Pre-Production** relié à un domaine (`staging.hyeres2026.org`) :

- **Settings** → **Environment Variables** (ou la section où tu lie les domaines aux branches)
- S’assurer que l’environnement Pre-Production / domaine de staging est bien lié à la branche **staging** (et pas “All Branches”). Voir aussi `docs/FIX_BRANCH_SELECTION.md`.

---

## 3. Déclencher un déploiement à la main (solution rapide)

Même sans changer de code, tu peux forcer un nouveau build :

1. Vercel Dashboard → ton projet → **Deployments**
2. Repérer le **dernier déploiement** de la branche **staging** (ou le dernier en date)
3. Cliquer sur les **3 points** à droite du déploiement
4. Choisir **Redeploy**
5. Laisser les options par défaut → **Redeploy**

Ça reconstruit et redéploie la même branche. Si le dernier déploiement était déjà basé sur `staging` à jour, le résultat sera à jour.

---

## 4. Vérifier qu’un déploiement “Preview” existe pour staging

1. Vercel Dashboard → **Deployments**
2. Regarder la liste : tu dois voir des déploiements avec la branche **staging** (ou “Preview”).
3. Si aucun déploiement staging n’existe :
   - Soit le repo n’est pas correctement connecté (Settings → Git)
   - Soit les “Preview Deployments” sont désactivés
   - Soit la branche `staging` n’a jamais été poussée après la liaison Vercel/GitHub.

Dans ce cas, refaire un push :

```bash
git checkout staging
git push origin staging
```

Puis recharger la page **Deployments** dans Vercel : un nouveau déploiement devrait apparaître.

---

## 5. Vérifier l’URL de la préprod

- **URL type Vercel** :  
  `https://[nom-projet]-git-staging-[ton-username].vercel.app`  
  (ex. `https://hyeres2026-git-staging-cedricborderie.vercel.app`)
- **Domaine custom** :  
  `https://staging.hyeres2026.org` (si configuré dans **Settings** → **Domains**)

Tu peux cliquer sur l’URL du dernier déploiement “staging” dans **Deployments** pour être sûr d’être sur la bonne préprod.

---

## 6. Si le build échoue (état “Error” dans Vercel)

1. Dans **Deployments**, cliquer sur le déploiement en erreur
2. Ouvrir l’onglet **Building** / **Logs** et lire l’erreur (TypeScript, `npm install`, etc.)
3. Corriger en local, committer, puis :

```bash
git add .
git commit -m "Fix: …"
git push origin staging
```

---

## Récap des commandes utiles

```bash
# Être sûr d’être sur staging et à jour
git checkout staging
git pull origin staging   # si quelqu’un d’autre pousse

# Pousser et déclencher un déploiement
git push origin staging

# Forcer un redeploy sans changer le code (commit vide)
git commit --allow-empty -m "Trigger redeploy preprod"
git push origin staging
```

---

## Checklist rapide

- [ ] Le dernier commit staging est visible sur GitHub
- [ ] Dans Vercel → Deployments, un déploiement “staging” (ou Preview) existe
- [ ] Le domaine préprod (Vercel ou `staging.hyeres2026.org`) pointe vers ce déploiement
- [ ] Si besoin, **Redeploy** manuel fait depuis Vercel
- [ ] Variables d’environnement **Preview** remplies dans Vercel (Supabase, Turnstile, etc.) – voir `docs/URL_PREPRODUCTION.md`
