// Le mystère final : "Le Secret de Lady Whistledown"
// 4 suspects x 4 lieux x 4 objets — le joueur croise les indices révélés
// au fil des victoires pour accuser le bon trio (suspect / lieu / objet).

export const SUSPECTS = [
  { id: 's1', name: 'La Comtesse de Beaumont', hint: 'Vêtue d’émeraude, toujours près des livres.', portrait: '/suspects/comtesse.jpg' },
  { id: 's2', name: 'Le Vicomte Ashworth', hint: 'Un sourire trop maîtrisé, un gilet trop brodé.', portrait: '/suspects/vicomte.jpg' },
  { id: 's3', name: 'Le Majordome Fenwick', hint: 'Il connaît chaque recoin de l’Office.', portrait: '/suspects/majordome.jpg' },
  { id: 's4', name: 'La Baronne Farrington', hint: 'On la dit friande de secrets et de serres chaudes.', portrait: '/suspects/baronne.jpg' },
]

export const LIEUX = [
  { id: 'l1', name: 'La Bibliothèque', icon: 'bibliotheque' },
  { id: 'l2', name: 'Le Jardin d’Hiver', icon: 'jardin' },
  { id: 'l3', name: 'Le Salon de Musique', icon: 'musique' },
  { id: 'l4', name: 'La Serre', icon: 'serre' },
]

export const OBJETS = [
  { id: 'o1', name: 'Une lettre cachetée de cire pourpre', icon: 'lettre' },
  { id: 'o2', name: 'Un chandelier d’argent', icon: 'chandelier' },
  { id: 'o3', name: 'Un poignard de cérémonie', icon: 'poignard' },
  { id: 'o4', name: 'Un flacon de laudanum', icon: 'laudanum' },
]

// Solution cachée — révélée uniquement lorsque le joueur propose
// la bonne combinaison dans le Bureau d'Enquête.
export const SOLUTION = {
  suspectId: 's1',
  lieuId: 'l1',
  objetId: 'o2',
  reveal:
    "C'est la Comtesse de Beaumont qui, dans la Bibliothèque, dissimula le chandelier d'argent — un gage silencieux pour protéger un secret bien plus précieux que l'argenterie.",
}
