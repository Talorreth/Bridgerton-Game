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
    gamesConfig.js      → les 6 mini-jeux (type, difficulté, temps cible, indice)
    puzzles.js          → les 6 grilles figées (générées par scripts/generatePuzzles.mjs)
    investigation.js    → suspects / lieux / objets / solution du mystère
  hooks/
    useProgress.js      → TOUTE la logique de progression + localStorage
    useCountdown.js      → compte à rebours réutilisable
  components/
    layout/              → TabBar, Header
    games/                → GameHub, GameShell (chronomètre + condition de
                            victoire), QueensGame, TangoGame, ZipGame
    friends/               → mode de test caché (?mode=amies), voir plus bas
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
  completedGames: { 0: { time: 82, completedAt: '2026-08-12T10:00:00.000Z' }, ... },
  unlockedActivities: [1, 2],
  pendingReveal: null, // index du jeu dont la récompense n'a pas encore été "vue"
  deductionGrid: { 's1__l1': 'check', ... },
  mysterySolved: false,
}
```

- **Un seul jeu accessible à la fois** : `nextGameIndex = completedCount` (le
  jeu 0 est toujours accessible en premier).
- **Calendrier fixe** : chaque jeu `N` (N > 0) a une date de déblocage
  (`unlockDate` dans `gamesConfig.js`, format `YYYY-MM-DD`), en plus d'exiger
  que le jeu `N-1` soit déjà réussi. Tant que `Date.now()` n'a pas atteint
  cette date, le jeu affiche un compte à rebours (`waiting`). Voir
  `useProgress.getGameStatus`. Le calendrier actuel s'étale du 23 août
  (ouverture) au 5 septembre (dernière épreuve).
- **Condition de victoire** : `GameShell` affiche un chronomètre en direct
  pendant la partie. Si le temps final est **inférieur ou égal** au temps
  cible (`targetSeconds` dans `gamesConfig.js`, ou au meilleur temps des
  amies si au moins une a testé ce jeu — voir plus bas), le niveau est
  validé et l'indice est révélé (voir `completeGame` dans `useProgress.js`).
- **Double condition sur la dernière activité** : l'activité de la 6ᵉ épreuve
  ne se débloque que si le jeu est réussi **et** que le mystère est résolu
  (`mysterySolved`). Si l'une des deux conditions manque encore,
  `UnlockOverlay` révèle l'indice mais pas l'activité.

## Puzzles figés

Les grilles des 6 épreuves sont générées une seule fois et figées dans
`src/data/puzzles.js`, pour que toutes les joueuses (invitée et amies
testeuses) résolvent exactement la même grille par épreuve — indispensable
pour que les temps soient comparables. Pour regénérer de nouvelles grilles :
`npm run puzzles:generate`.

## Mode de test caché "amies" + classement Supabase

Accessible uniquement via l'URL secrète `?mode=amies` (jamais atteignable
depuis la navigation normale), ce mode permet à des amies de tester les 6
épreuves sans délai d'attente et sans toucher à la progression réelle
(stockage local séparé, `chateau_louise_friends_v1`). Leurs temps sont
envoyés à une base Supabase (voir `src/lib/supabaseClient.js`,
`VITE_SUPABASE_URL` et `VITE_SUPABASE_ANON_KEY` dans `.env.local`), et
affichés dans l'onglet Épreuves normal comme temps à battre + classement
détaillé (`GameHub.jsx`).

## Personnaliser les temps cibles / textes

Tout se passe dans `src/data/gamesConfig.js` (temps cibles, titres, indices)
et `src/data/activities.js` (les 6 activités). Le mystère final (suspects, lieux,
objets, solution) est dans `src/data/investigation.js`.

## Palette & typographie

- Bleu pastel royal `#A4C3D2`, Doré `#D4AF37`, Blanc cassé `#FAFAFA`, Rose
  poudré `#FADADD` — définis dans `tailwind.config.js`.
- Playfair Display (titres) + Cormorant Garamond (texte courant), chargées via
  Google Fonts dans `index.html`.
