# Configuration du domaine staging.hyeres2026.org

## ✅ Configuration correcte

Vous avez configuré :
- **Domaine** : `staging.hyeres2026.org`
- **Environnement** : **Pre-Production** ✅
- **Branches** : All Branches (ou vous pouvez sélectionner uniquement "staging")

## 📋 Avant de sauvegarder

### 1. Vérifier les variables d'environnement

Dans Vercel Dashboard → Settings → Environment Variables :

Assurez-vous que pour l'environnement **"Preview"** (ou "Pre-Production"), vous avez :

```env
NEXT_PUBLIC_SUPABASE_URL=https://qxvnbkknudogisxtumfw.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci... (clé anon préproduction)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci... (clé service_role préproduction)
NEXT_PUBLIC_TURNSTILE_SITE_KEY=0x4AAAAAACNnq62ppdT8Ei2e
TURNSTILE_SECRET_KEY=0x4AAAAAACNnqygx7qAZ84Km0JVfFtSPPHM
JWT_SECRET_KEY=95ed88443338758e5cf7c8abe6ad88945b3e3a42b5abd0962182bcbd66a7d7a0
```

⚠️ **IMPORTANT** : Utiliser les clés du projet **préproduction** (`qxvnbkknudogisxtumfw`), pas celles de production !

### 2. Configuration DNS

Après avoir cliqué sur "Save", Vercel vous donnera des instructions DNS à configurer :

1. Aller dans votre gestionnaire DNS (là où vous gérez `hyeres2026.org`)
2. Ajouter un enregistrement CNAME :
   - **Type** : CNAME
   - **Nom** : `staging` (ou `staging.hyeres2026.org`)
   - **Valeur** : Vercel vous donnera une valeur (ex: `cname.vercel-dns.com`)

### 3. Vérification

Une fois le DNS configuré (peut prendre quelques minutes à quelques heures) :

1. Aller sur `https://staging.hyeres2026.org`
2. Vérifier que le site s'affiche
3. Tester un vote pour vérifier que tout fonctionne

## 🔒 Sécurité

### Aucun risque pour la production

- ✅ Le domaine `staging.hyeres2026.org` est connecté à **Pre-Production**
- ✅ Les variables d'environnement sont séparées
- ✅ Le projet Supabase est différent (`qxvnbkknudogisxtumfw` ≠ `hvynvggcxxpbavrarbcb`)
- ✅ La production (`www.hyeres2026.org`) reste totalement indépendante

### Vérification

- Production : `www.hyeres2026.org` → Projet Supabase `hvynvggcxxpbavrarbcb`
- Préproduction : `staging.hyeres2026.org` → Projet Supabase `qxvnbkknudogisxtumfw`

✅ **Totalement séparés** = Aucun risque

## 📝 Après la configuration

1. **Cliquer sur "Save"** dans Vercel
2. **Configurer le DNS** selon les instructions Vercel
3. **Attendre la propagation DNS** (quelques minutes)
4. **Tester** : `https://staging.hyeres2026.org`

## 🆘 Si le domaine ne fonctionne pas

1. Vérifier que le DNS est bien configuré (peut prendre jusqu'à 24h)
2. Vérifier que les variables d'environnement sont dans "Preview"
3. Vérifier qu'un déploiement existe pour la branche staging
