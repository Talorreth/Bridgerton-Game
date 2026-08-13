# Château Louise de la Vallière — Le Secret de Lady Whistledown

Jeu de piste / escape game mobile-first, style Régence (Bridgerton), construit en
React + Vite + Tailwind CSS + Framer Motion.

## Installation

```bash
npm install
npm run dev
```

Build de production :

```bash
npm run build
npm run preview
```

## Déploiement

- **Vercel** : importez le dépôt, le fichier `vercel.json` est déjà configuré
  (build `npm run build`, dossier `dist`).
- **Netlify** : importez le dépôt, le fichier `netlify.toml` est déjà configuré.

## Structure du projet

```
src/
  data/
    activities.js      → les 6 activités du séjour
    gamesConfig.js      → les 6 mini-jeux (type, difficulté, high score, indice)
    investigation.js    → suspects / lieux / objets / solution du mystère
  hooks/
    useProgress.js      → TOUTE la logique de progression + localStorage
    useCountdown.js      → compte à rebours réutilisable
  components/
    layout/              → TabBar, Header
    games/                → GameHub, GameShell (timer + score), QueensGame,
                            TangoGame, PatchesGame
    activities/           → PlanningTab, ActivityCard, UnlockOverlay
    investigation/        → BureauEnquete, DeductionGrid, CluesList
    ui/                   → CountdownBadge, icônes d'activités
  App.jsx                 → routage par onglets (state simple, pas de react-router
                            nécessaire pour 4 onglets)
```

## Logique de progression (résumé)

Tout est stocké dans `localStorage` sous la clé `chateau_louise_progress_v1` :

```js
{
  completedGames: { 0: { score: 812, completedAt: '2026-08-12T10:00:00.000Z' }, ... },
  unlockedActivities: [1, 2],
  pendingReveal: null, // index du jeu dont la récompense n'a pas encore été "vue"
  deductionGrid: { 's1__l1': 'check', ... },
  mysterySolved: false,
}
```

- **Un seul jeu accessible à la fois** : `nextGameIndex = completedCount` (le
  jeu 0 est toujours accessible en premier).
- **Timer de 3 jours** : pour le jeu `N` (N > 0), on lit la date de complétion
  du jeu `N-1` (`completedGames[N-1].completedAt`) et on calcule
  `completedAt + 3 jours`. Tant que `Date.now()` n'a pas dépassé cette date,
  le jeu affiche un compte à rebours (`waiting`). Voir `useProgress.getGameStatus`.
- **Condition de victoire** : chaque partie calcule un score
  (`1000 - temps_en_secondes * 4 - erreurs * 30`, borné à 0) dans `GameShell`.
  Si `score >= highScore` (défini dans `gamesConfig.js`), le niveau est validé,
  l'activité correspondante est débloquée et l'indice est révélé (voir
  `completeGame` dans `useProgress.js`).

## Personnaliser les high scores / textes

Tout se passe dans `src/data/gamesConfig.js` (scores, titres, indices) et
`src/data/activities.js` (les 6 activités). Le mystère final (suspects, lieux,
objets, solution) est dans `src/data/investigation.js`.

## Palette & typographie

- Bleu pastel royal `#A4C3D2`, Doré `#D4AF37`, Blanc cassé `#FAFAFA`, Rose
  poudré `#FADADD` — définis dans `tailwind.config.js`.
- Playfair Display (titres) + Cormorant Garamond (texte courant), chargées via
  Google Fonts dans `index.html`.
