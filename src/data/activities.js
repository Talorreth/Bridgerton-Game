// Les 6 activités du séjour, débloquées une à une par les mini-jeux.
// gameIndex fait le lien avec data/gamesConfig.js (0 à 5).

export const ACTIVITIES = [
  {
    id: 1,
    gameIndex: 0,
    title: "L'Escapade Culturelle dans le Sanctuaire du Génie",
    place: 'Le Clos Lucé',
    description:
      "Une promenade guidée dans la dernière demeure de Léonard de Vinci, entre jardins d'invention et ateliers secrets.",
    icon: 'landmark',
  },
  {
    id: 2,
    gameIndex: 1,
    title: 'La Flânerie Romantique sous les Ombrages du Domaine',
    place: 'Parc du Château',
    description:
      "Une marche paisible sous les frondaisons centenaires, ponctuée de haltes et de vues sur la Loire.",
    icon: 'trees',
  },
  {
    id: 3,
    gameIndex: 2,
    title: 'Le Rituel Serein aux Bains Rituels de la Cour',
    place: 'Spa du Domaine',
    description:
      "Un moment suspendu entre vapeurs parfumées et soins ancestraux, dignes des plus grandes dames de la Cour.",
    icon: 'droplets',
  },
  {
    id: 4,
    gameIndex: 3,
    title: 'Le Festin Matinal & Brunch des Hautes Dignités',
    place: 'Orangerie',
    description:
      "Un brunch raffiné sous verrière, entre pâtisseries fines, thés rares et confitures du domaine.",
    icon: 'croissant',
  },
  {
    id: 5,
    gameIndex: 4,
    title: 'L’Initiation aux Nectars Sacrés du Domaine Taille aux Loups',
    place: 'Domaine Taille aux Loups',
    description:
      "Une dégustation commentée des plus beaux crus de Vouvray et Montlouis, dans les caves troglodytiques.",
    icon: 'wine',
  },
  {
    id: 6,
    gameIndex: 5,
    title: "Le Grand Banquet Gastronomique de Sa Majesté à la Table d'Amphitryon",
    place: "Table d'Amphitryon",
    description:
      "Le point d'orgue du séjour : un banquet gastronomique à plusieurs services, servi dans la grande salle du château.",
    icon: 'crown',
  },
]
