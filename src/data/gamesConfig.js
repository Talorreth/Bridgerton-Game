// Configuration des 6 mini-jeux séquentiels.
// type: 'queens' | 'tango' | 'zip'
// targetSeconds: temps maximum (en secondes) pour valider le niveau (fixé par le créateur)
// unlockDate: date calendaire (YYYY-MM-DD) à partir de laquelle le jeu peut
// s'ouvrir — en plus d'exiger que le jeu précédent soit réussi. Calendrier
// étalé du 23 août (ouverture) au 5 septembre (dernière épreuve).

export const GAMES = [
  {
    index: 0,
    type: 'queens',
    title: 'Le Défi des Couronnes',
    tagline: 'Placez les couronnes sans qu’aucune ne croise le regard d’une autre.',
    gridSize: 5,
    targetSeconds: 90,
    activityId: 1,
    clue: {
      title: 'Premier feuillet',
      text:
        "« On murmure, chère lectrice, qu'un des convives portait ce soir-là un vêtement de couleur émeraude, et qu'il ne quitta jamais la Bibliothèque des yeux. » — Lady Whistledown",
    },
  },
  {
    index: 1,
    type: 'tango',
    title: 'L’Équilibre Céleste',
    tagline: 'Harmonisez Soleils et Lunes : jamais trois de suite, jamais de déséquilibre.',
    gridSize: 6,
    targetSeconds: 100,
    unlockDate: '2026-08-26',
    activityId: 2,
    clue: {
      title: 'Second feuillet',
      text:
        "« La Comtesse de Beaumont fut vue s'esquivant vers le Jardin d'Hiver, une lettre cachetée de cire pourpre glissée dans sa manche. » — Lady Whistledown",
    },
  },
  {
    index: 2,
    type: 'zip',
    title: 'Le Sentier Dérobé',
    tagline: 'Tracez le chemin secret qui traverse chaque case et relie les chiffres dans l’ordre.',
    gridSize: 5,
    dotCount: 5,
    targetSeconds: 110,
    unlockDate: '2026-08-28',
    activityId: 3,
    clue: {
      title: 'Troisième feuillet',
      text:
        "« Un chandelier d'argent manquait ce matin-là à l'Office. Le Majordome jure ne rien savoir — mais son regard, lui, en disait long. » — Lady Whistledown",
    },
  },
  {
    index: 3,
    type: 'queens',
    title: 'Le Second Défi des Couronnes',
    tagline: 'La grille s’agrandit, la vigilance redouble.',
    gridSize: 6,
    targetSeconds: 75,
    unlockDate: '2026-08-31',
    activityId: 4,
    clue: {
      title: 'Quatrième feuillet',
      text:
        "« Le Vicomte Ashworth aurait été aperçu au Salon de Musique, un poignard de cérémonie glissé sous son gilet brodé. » — Lady Whistledown",
    },
  },
  {
    index: 4,
    type: 'tango',
    title: 'Le Second Équilibre Céleste',
    tagline: 'Six par six, l’équilibre du ciel doit régner sur chaque ligne.',
    gridSize: 6,
    targetSeconds: 80,
    unlockDate: '2026-09-02',
    activityId: 5,
    clue: {
      title: 'Cinquième feuillet',
      text:
        "« La Baronne Farrington, elle, ne quitta jamais la Serre — trop occupée, dit-on, à dissimuler un flacon de laudanum sous ses jupons. » — Lady Whistledown",
    },
  },
  {
    index: 5,
    type: 'zip',
    title: 'Le Dernier Corridor',
    tagline: 'Un ultime chemin, plus long, avant que le coupable ne soit démasqué.',
    gridSize: 6,
    dotCount: 7,
    targetSeconds: 95,
    unlockDate: '2026-09-05',
    activityId: 6,
    clue: {
      title: 'Feuillet final',
      text:
        "« Souvenez-vous, chère lectrice : l'objet du délit n'a jamais quitté la pièce où le coupable fut vu en dernier. À vous de démêler l'écheveau. » — Lady Whistledown",
    },
  },
]

export const getGameByIndex = (index) => GAMES.find((g) => g.index === index)
