# Limitation par Adresse IP

## Objectif

Limiter le nombre de votants par adresse IP pour éviter les votes multiples depuis la même source.

## Implémentation

### Option 1 : Via Supabase Edge Functions (Recommandé)

Cette limitation nécessite une vérification côté serveur, car les adresses IP ne sont pas accessibles côté client de manière fiable.

1. **Créer une Edge Function Supabase** (`supabase/functions/vote/`):
   - Récupérer l'IP du client depuis les headers de requête
   - Vérifier dans une table `ip_limits` si l'IP a déjà voté
   - Limiter le nombre de votes par IP (ex: 1 vote par IP par proposition)

2. **Structure de table suggérée**:
```sql
CREATE TABLE ip_limits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ip_address INET NOT NULL,
  proposal_id UUID REFERENCES proposals(id),
  session_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(ip_address, proposal_id)
);
```

3. **Middleware Next.js** (optionnel):
   - Utiliser `next.js` API routes pour capturer l'IP
   - Passer l'IP à Supabase lors du vote

### Option 2 : Via Next.js API Routes

Créer une route API (`app/api/vote/route.ts`) qui:
- Capture l'IP du client via `headers()`
- Appelle Supabase avec l'IP
- Retourne un succès/erreur selon la limite

## Note

Actuellement, le vote fonctionne avec localStorage uniquement. Pour implémenter la limitation IP, il faut:
1. Migrer vers Supabase (sync des votes)
2. Créer les fonctions serveur nécessaires
3. Mettre à jour le client pour appeler les API au lieu de localStorage

Cette fonctionnalité est marquée comme "pending" dans les TODOs et nécessite l'intégration Supabase complète.
