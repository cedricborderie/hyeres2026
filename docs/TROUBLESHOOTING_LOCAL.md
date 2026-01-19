# Dépannage - Problème Local

## Problème : La page http://localhost:3000 n'affiche rien

### Solution appliquée

Le problème venait d'ESLint qui bloquait la compilation à cause des apostrophes non échappées dans le JSX.

**Correction** : Désactivation de la règle `react/no-unescaped-entities` dans `.eslintrc.json`

### Pour redémarrer proprement

```bash
# 1. Nettoyer le cache Next.js
rm -rf .next

# 2. Redémarrer le serveur de développement
npm run dev
```

### Vérifications

1. **Vérifier que le serveur démarre** :
   - Ouvrir le terminal
   - Lancer `npm run dev`
   - Vérifier qu'il n'y a pas d'erreurs
   - Le message devrait être : "Ready on http://localhost:3000"

2. **Vérifier la console du navigateur** :
   - Ouvrir les outils de développement (F12)
   - Onglet Console
   - Vérifier s'il y a des erreurs JavaScript

3. **Vérifier la console du terminal** :
   - Regarder les erreurs éventuelles lors du démarrage
   - Vérifier les erreurs de compilation

### Si le problème persiste

1. **Nettoyer complètement** :
```bash
rm -rf .next node_modules
npm install
npm run dev
```

2. **Vérifier les variables d'environnement** :
   - Le fichier `.env.local` existe-t-il ?
   - Les variables Supabase sont-elles définies ?

3. **Vérifier les ports** :
   - Le port 3000 est-il déjà utilisé ?
   - Essayer un autre port : `npm run dev -- -p 3001`

### Erreurs courantes

- **"Port already in use"** : Un autre processus utilise le port 3000
  - Solution : Tuer le processus ou utiliser un autre port

- **"Module not found"** : Une dépendance manque
  - Solution : `npm install`

- **Erreurs TypeScript** : Problèmes de types
  - Solution : Vérifier avec `npx tsc --noEmit`
