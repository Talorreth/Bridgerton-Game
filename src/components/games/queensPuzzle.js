// Génération pure du puzzle "Reines" — aucune dépendance React, réutilisable
// depuis le composant (repli) et depuis scripts/generatePuzzles.mjs.

function shuffle(array) {
  const arr = [...array]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

// Génère une permutation colonne -> ligne où deux couronnes consécutives
// ne se touchent jamais (y compris en diagonale).
function generatePermutation(size) {
  function backtrack(remainingCols, chosen) {
    if (chosen.length === size) return chosen
    const row = chosen.length
    const candidates = shuffle(remainingCols).filter(
      (c) => row === 0 || Math.abs(c - chosen[row - 1]) > 1
    )
    for (const c of candidates) {
      const result = backtrack(
        remainingCols.filter((x) => x !== c),
        [...chosen, c]
      )
      if (result) return result
    }
    return null
  }
  const cols = Array.from({ length: size }, (_, i) => i)
  return backtrack(cols, []) || cols
}

// Fait "pousser" N régions contiguës depuis les cases de la solution, jusqu'à
// recouvrir toute la grille (chaque région contient exactement une couronne).
function growRegions(size, solutionCols) {
  const regionOf = Array.from({ length: size }, () => Array(size).fill(-1))
  const frontier = []
  solutionCols.forEach((c, r) => {
    regionOf[r][c] = r
    frontier.push({ r, c, region: r })
  })

  const deltas = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
  ]
  let unassigned = size * size - size

  while (unassigned > 0 && frontier.length > 0) {
    const idx = Math.floor(Math.random() * frontier.length)
    const { r, c, region } = frontier[idx]
    const options = shuffle(deltas)
      .map(([dr, dc]) => [r + dr, c + dc])
      .filter(([nr, nc]) => nr >= 0 && nr < size && nc >= 0 && nc < size && regionOf[nr][nc] === -1)
    if (options.length === 0) {
      frontier.splice(idx, 1)
      continue
    }
    const [nr, nc] = options[0]
    regionOf[nr][nc] = region
    frontier.push({ r: nr, c: nc, region })
    unassigned--
  }

  // Sécurité : rattache toute case orpheline au voisin déjà assigné le plus proche.
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (regionOf[r][c] === -1) {
        const neighbor = deltas
          .map(([dr, dc]) => [r + dr, c + dc])
          .find(([nr, nc]) => nr >= 0 && nr < size && nc >= 0 && nc < size && regionOf[nr][nc] !== -1)
        regionOf[r][c] = neighbor ? regionOf[neighbor[0]][neighbor[1]] : 0
      }
    }
  }

  return regionOf
}

export function buildPuzzle(size) {
  const solutionCols = generatePermutation(size)
  const regions = growRegions(size, solutionCols)
  return { regions, solutionCols }
}
