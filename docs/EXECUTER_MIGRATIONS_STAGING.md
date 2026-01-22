# Exécuter les Migrations SQL sur Staging

## 📋 Migrations à exécuter

Vous devez exécuter les migrations suivantes dans l'ordre :

1. **019_insert_agriculture_proposals.sql** - Ajoute les 22 propositions Agriculture
2. **020_update_mobilites_proposals.sql** - Met à jour les 14 propositions Mobilités
3. **021_add_manifesto_links.sql** - Ajoute les liens PDF manifestes

## ⚠️ IMPORTANT : Vérifier le projet Supabase

**AVANT d'exécuter quoi que ce soit**, vérifiez que vous êtes dans le **projet préproduction** :

- ✅ **Projet préproduction** : `qxvnbkknudogisxtumfw`
- ❌ **PAS le projet production** : `hvynvggcxxpbavrarbcb`

### Comment vérifier :
1. Aller sur [Supabase Dashboard](https://supabase.com/dashboard)
2. Vérifier l'URL dans le navigateur ou le nom du projet
3. Le projet préproduction doit avoir l'ID : `qxvnbkknudogisxtumfw`

## 🚀 Étapes d'exécution

### 1. Se connecter à Supabase Préproduction

1. Aller sur [Supabase Dashboard](https://supabase.com/dashboard)
2. Cliquer sur le projet **préproduction** (`qxvnbkknudogisxtumfw`)
3. ⚠️ **Vérifier** que vous êtes bien dans le bon projet !

### 2. Exécuter la migration 019

1. Dans Supabase, aller dans **SQL Editor** (menu de gauche)
2. Cliquer sur **"New query"**
3. Ouvrir le fichier `supabase/migrations/019_insert_agriculture_proposals.sql`
4. **Copier TOUT le contenu** du fichier
5. **Coller** dans l'éditeur SQL de Supabase
6. Cliquer sur **"Run"** (ou `Ctrl+Enter` / `Cmd+Enter`)
7. Vérifier qu'il n'y a pas d'erreurs
8. Vérifier le message de succès en bas de l'éditeur

**Vérification après exécution :**
```sql
-- Doit retourner 22 propositions Agriculture
SELECT COUNT(*) FROM proposals 
WHERE category_id = '00000000-0000-0000-0000-000000000003';
```

### 3. Exécuter la migration 020

1. Dans le même SQL Editor, créer une **nouvelle requête** (ou effacer la précédente)
2. Ouvrir le fichier `supabase/migrations/020_update_mobilites_proposals.sql`
3. **Copier TOUT le contenu** du fichier
4. **Coller** dans l'éditeur SQL
5. Cliquer sur **"Run"**
6. Vérifier qu'il n'y a pas d'erreurs

**Vérification après exécution :**
```sql
-- Doit retourner 14 propositions Mobilités (pas 15)
SELECT COUNT(*) FROM proposals 
WHERE category_id = '00000000-0000-0000-0000-000000000002';

-- Vérifier que m15 n'existe plus
SELECT COUNT(*) FROM proposals WHERE id = 'm15';
-- Doit retourner 0
```

### 4. Exécuter la migration 021

1. Créer une **nouvelle requête** dans SQL Editor
2. Ouvrir le fichier `supabase/migrations/021_add_manifesto_links.sql`
3. **Copier TOUT le contenu** du fichier
4. **Coller** dans l'éditeur SQL
5. Cliquer sur **"Run"**
6. Vérifier qu'il n'y a pas d'erreurs

**Vérification après exécution :**
```sql
-- Vérifier que les 3 catégories ont un manifesto_url
SELECT id, name, slug, manifesto_url FROM categories ORDER BY id;
-- Doit afficher 3 lignes avec manifesto_url rempli
```

## ✅ Vérifications finales

Après avoir exécuté les 3 migrations, exécuter cette requête complète :

```sql
-- Vérification complète
SELECT 
  c.name as category,
  COUNT(p.id) as proposal_count,
  c.manifesto_url IS NOT NULL as has_manifesto
FROM categories c
LEFT JOIN proposals p ON p.category_id = c.id
GROUP BY c.id, c.name, c.manifesto_url
ORDER BY c.id;
```

**Résultat attendu :**
- **Habitat** : ~20 propositions, manifesto_url présent
- **Mobilités** : **14 propositions** (pas 15), manifesto_url présent
- **Agriculture** : **22 propositions**, manifesto_url présent

## 🆘 Dépannage

### Erreur : "relation already exists"
- Normal si vous réexécutez une migration
- Les migrations utilisent `ON CONFLICT DO UPDATE` ou `IF NOT EXISTS`

### Erreur : "permission denied"
- Vérifier que vous êtes connecté avec les droits administrateur
- Vérifier que vous êtes dans le bon projet Supabase

### Les propositions ne s'affichent pas
- Vérifier que les migrations ont été exécutées sans erreur
- Vérifier les counts avec les requêtes SQL ci-dessus
- Vérifier les variables d'environnement dans Vercel

### Migration 020 : m15 existe encore
- La migration 020 supprime m15 automatiquement
- Si elle existe encore, exécuter manuellement :
  ```sql
  DELETE FROM votes WHERE proposal_id = 'm15';
  DELETE FROM proposals WHERE id = 'm15';
  ```

## 📝 Notes importantes

1. **Ordre d'exécution** : Toujours exécuter dans l'ordre (019, 020, 021)
2. **Projet** : Toujours vérifier que vous êtes dans le projet préproduction
3. **Vérifications** : Toujours vérifier après chaque migration
4. **Sauvegarde** : Les migrations sont idempotentes (peuvent être réexécutées)

## 🎯 Résumé rapide

```bash
# 1. Aller sur Supabase Dashboard
# 2. Sélectionner projet préproduction (qxvnbkknudogisxtumfw)
# 3. SQL Editor → New query
# 4. Copier-coller 019 → Run
# 5. Nouvelle query → Copier-coller 020 → Run
# 6. Nouvelle query → Copier-coller 021 → Run
# 7. Vérifier avec les requêtes SQL ci-dessus
```
