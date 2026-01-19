# Guide de Dépannage

## Erreur : "Proposition introuvable dans la base de données"

### Symptômes
Lorsque vous votez pour une proposition, vous recevez l'erreur :
```
Proposition introuvable dans la base de données (ID: h1). 
Assurez-vous que les migrations SQL ont été exécutées dans Supabase.
```

### Causes possibles

1. **Les migrations SQL n'ont pas été exécutées**
   - Les propositions ne sont pas encore insérées dans Supabase
   - Les tables existent mais sont vides

2. **Les migrations ont été exécutées dans le mauvais ordre**
   - Les migrations doivent être exécutées dans l'ordre : 001, 002, 003

3. **Les IDs des propositions ne correspondent pas**
   - Les IDs dans `lib/data.ts` (h1, m1, a1, etc.) doivent correspondre aux IDs dans Supabase

### Solution

#### Étape 1 : Vérifier que Supabase est configuré

Vérifiez que les variables d'environnement sont définies dans `.env.local` :
```env
NEXT_PUBLIC_SUPABASE_URL=votre_url_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_cle_anon
```

#### Étape 2 : Exécuter les migrations SQL dans Supabase

1. Connectez-vous à votre projet Supabase
2. Allez dans l'éditeur SQL
3. Exécutez les migrations dans l'ordre :

**Migration 001** : `supabase/migrations/001_initial_schema.sql`
- Crée les tables (categories, proposals, votes)
- Crée les triggers et fonctions

**Migration 002** : `supabase/migrations/002_modify_proposal_ids_to_string.sql`
- Modifie les IDs des propositions de UUID vers VARCHAR(50)
- Adapte la structure pour correspondre à `lib/data.ts`

**Migration 003** : `supabase/migrations/003_insert_proposals.sql`
- Insère toutes les propositions (5 Habitat, 15 Mobilités, 1 Agriculture)

#### Étape 3 : Vérifier que les propositions sont insérées

Exécutez cette requête SQL dans Supabase pour vérifier :
```sql
SELECT id, title, category_id FROM proposals ORDER BY id;
```

Vous devriez voir les propositions avec les IDs : h1, h2, h3, h4, h5, m1, m2, ..., m15, a1

#### Étape 4 : Vérifier les catégories

Exécutez cette requête pour vérifier les catégories :
```sql
SELECT id, name, slug FROM categories;
```

Vous devriez voir 3 catégories avec les IDs UUID correspondants.

### Vérification rapide

Pour vérifier rapidement l'état de votre base de données, vous pouvez créer une page de diagnostic (optionnel) qui appelle `checkDatabaseStatus()` depuis `app/actions/check-db.ts`.

### Notes importantes

- Les IDs des propositions dans `lib/data.ts` doivent **exactement** correspondre aux IDs dans Supabase
- Après la migration 002, les IDs sont des VARCHAR(50), pas des UUID
- La migration 002 supprime toutes les propositions existantes (si vous en aviez), donc exécutez-la avec précaution
- Assurez-vous que la migration 003 est exécutée après la migration 002

### En cas de problème persistant

1. Vérifiez les logs du serveur (console) pour voir les erreurs détaillées
2. Vérifiez que les variables d'environnement sont bien chargées
3. Vérifiez que vous utilisez la bonne instance Supabase
4. Vérifiez que les migrations ont été exécutées sans erreur
