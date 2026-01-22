# Utiliser la page de debug

## Accéder à la page de debug

1. Déployer le code avec la nouvelle page `/debug`
2. Aller sur `https://www.hyeres2026.org/debug`
3. Vérifier les valeurs affichées

## Interprétation

La page affiche :
- `hasServiceRoleKey`: Doit être `true` ✅
- `hasSupabaseUrl`: Doit être `true` ✅
- `hasAnonKey`: Doit être `true` ✅

Si `hasServiceRoleKey` est `false` :
- ❌ `SUPABASE_SERVICE_ROLE_KEY` n'est pas chargée en production
- Vérifier la configuration dans Vercel
- Redéployer après modification

## Après vérification

Une fois que vous avez vérifié, supprimez la page `/debug` pour la sécurité.
