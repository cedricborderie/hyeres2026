# Configurer le DNS pour staging.hyeres2026.org

## 📋 Instructions DNS de Vercel

D'après Vercel, vous devez configurer :

- **Type** : CNAME
- **Name** : `staging`
- **Value** : `254cd1fa1fdf4716.vercel-dns-017.com.`

## 🔧 Étapes pour configurer le DNS

### 1. Identifier votre gestionnaire DNS

Où gérez-vous le domaine `hyeres2026.org` ?
- Cloudflare
- OVH
- Namecheap
- Google Domains
- Autre

### 2. Ajouter l'enregistrement CNAME

Dans votre gestionnaire DNS, ajouter un nouvel enregistrement :

**Configuration :**
- **Type** : `CNAME`
- **Nom** : `staging` (ou `staging.hyeres2026.org` selon votre fournisseur)
- **Valeur/Cible** : `254cd1fa1fdf4716.vercel-dns-017.com.`
- **TTL** : `3600` (ou automatique)

### 3. Exemples selon le fournisseur

#### Cloudflare
1. Aller dans votre domaine `hyeres2026.org`
2. **DNS** → **Records** → **Add record**
3. Type : `CNAME`
4. Name : `staging`
5. Target : `254cd1fa1fdf4716.vercel-dns-017.com.`
6. Proxy status : **DNS only** (pas de proxy)
7. **Save**

#### OVH
1. Aller dans **Domaines** → `hyeres2026.org` → **Zone DNS**
2. **Ajouter une entrée**
3. Sous-domaine : `staging`
4. Type : `CNAME`
5. Cible : `254cd1fa1fdf4716.vercel-dns-017.com.`
6. **Valider**

#### Autres fournisseurs
Le principe est le même : ajouter un CNAME avec :
- Nom : `staging`
- Valeur : `254cd1fa1fdf4716.vercel-dns-017.com.`

## ⏱️ Attendre la propagation DNS

Après avoir configuré le DNS :

1. **Attendre 5-30 minutes** (parfois jusqu'à 24h)
2. Dans Vercel, cliquer sur **"Refresh"** à côté du domaine
3. Le statut devrait passer à **"Valid Configuration"** ✅

## 🔍 Vérifier que le DNS est configuré

### Dans le terminal

```bash
# Vérifier le DNS
nslookup staging.hyeres2026.org

# Ou avec dig
dig staging.hyeres2026.org
```

Si le DNS est correct, vous devriez voir `254cd1fa1fdf4716.vercel-dns-017.com.` ou une adresse IP Vercel.

### Dans Vercel

1. Cliquer sur **"Refresh"** à côté du domaine
2. Le statut devrait changer de "Invalid Configuration" à "Valid Configuration"

## ✅ Après configuration

Une fois le DNS configuré et propagé :

1. Le statut dans Vercel sera **"Valid Configuration"** ✅
2. Vous pourrez accéder à `https://staging.hyeres2026.org`
3. Le site sera connecté à la branche `staging`

## 🆘 Si ça ne fonctionne pas

1. **Vérifier le DNS** : Utiliser `nslookup` pour voir si le CNAME est bien configuré
2. **Vérifier le nom** : S'assurer que c'est bien `staging` (pas `staging.hyeres2026.org` dans certains fournisseurs)
3. **Vérifier la valeur** : S'assurer qu'il n'y a pas d'espaces et que le point final est présent
4. **Attendre plus longtemps** : La propagation DNS peut prendre jusqu'à 24h

## 📝 Note importante

Vercel mentionne qu'il y a de nouveaux enregistrements (`254cd1fa1fdf4716.vercel-dns-017.com.`) et que les anciens (`cname.vercel-dns.com`) fonctionnent toujours mais qu'il est recommandé d'utiliser les nouveaux. Utilisez la valeur fournie par Vercel : `254cd1fa1fdf4716.vercel-dns-017.com.`
