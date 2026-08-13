// Génération pure du puzzle "Équilibre Céleste" (Tango) — aucune dépendance
// React, réutilisable depuis le composant (repli) et depuis
// scripts/generatePuzzles.mjs.

export const EMPTY = 0
export const SUN = 1
export const MOON = 2

// Génère une grille pleine valide par backtracking :
// - même nombre de soleils / lunes par ligne et par colonne
// - jamais 3 symboles identiques consécutifs
function generateSolution(size) {
  const grid = Array.from({ length: size }, () => Array(size).fill(EMPTY))
  const half = size / 2

  function countsOk(arr, value) {
    const count = arr.filter((v) => v === value).length
    return count <= half
  }
  function noTripleEnd(arr) {
    const n = arr.length
    if (n < 3) return true
    return !(arr[n - 1] === arr[n - 2] && arr[n - 2] === arr[n - 3] && arr[n - 1] !== EMPTY)
  }

  function backtrack(index) {
    if (index === size * size) return true
    const r = Math.floor(index / size)
    const c = index % size
    const options = Math.random() < 0.5 ? [SUN, MOON] : [MOON, SUN]

    for (const value of options) {
      grid[r][c] = value
      const rowSoFar = grid[r].slice(0, c + 1)
      const colSoFar = grid.map((row) => row[c]).slice(0, r + 1)
      if (
        countsOk(rowSoFar, value) &&
        countsOk(colSoFar, value) &&
        noTripleEnd(rowSoFar) &&
        noTripleEnd(colSoFar)
      ) {
        if (backtrack(index + 1)) return true
      }
      grid[r][c] = EMPTY
    }
    return false
  }

  backtrack(0)
  return grid
}

// Choisit quelques paires de cases voisines et note si la solution les veut
// identiques (=) ou opposées (×), comme les indices du vrai Tango.
function pickConstraints(solution, size) {
  const pairs = []
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (c + 1 < size) pairs.push({ r1: r, c1: c, r2: r, c2: c + 1 })
      if (r + 1 < size) pairs.push({ r1: r, c1: c, r2: r + 1, c2: c })
    }
  }
  pairs.sort(() => Math.random() - 0.5)
  const count = Math.min(pairs.length, Math.round(size * 1.3))
  return pairs.slice(0, count).map((p) => ({
    ...p,
    type: solution[p.r1][p.c1] === solution[p.r2][p.c2] ? 'eq' : 'diff',
  }))
}

export function buildPuzzle(size) {
  const solution = generateSolution(size)
  const fixed = Array.from({ length: size }, () => Array(size).fill(false))
  const values = Array.from({ length: size }, () => Array(size).fill(EMPTY))

  const totalCells = size * size
  const revealCount = Math.round(totalCells * 0.22)
  const positions = []
  for (let r = 0; r < size; r++) for (let c = 0; c < size; c++) positions.push([r, c])
  positions.sort(() => Math.random() - 0.5)

  for (let i = 0; i < revealCount; i++) {
    const [r, c] = positions[i]
    fixed[r][c] = true
    values[r][c] = solution[r][c]
  }

  const constraints = pickConstraints(solution, size)

  return { fixed, values, constraints, solution }
}
