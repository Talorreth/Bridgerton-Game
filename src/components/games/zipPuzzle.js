// Génération pure du puzzle "Sentier Dérobé" (Zip) — aucune dépendance React,
// réutilisable depuis le composant (repli) et depuis
// scripts/generatePuzzles.mjs.

export function key(r, c) {
  return `${r}-${c}`
}

// Chemin hamiltonien aléatoire (heuristique de Warnsdorff : on privilégie les
// voisins les plus "coincés" pour éviter les impasses).
function generateHamiltonianPath(size) {
  const total = size * size
  const visited = Array.from({ length: size }, () => Array(size).fill(false))
  const path = []
  const deltas = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
  ]

  function neighbors(r, c) {
    return deltas
      .map(([dr, dc]) => [r + dr, c + dc])
      .filter(([nr, nc]) => nr >= 0 && nr < size && nc >= 0 && nc < size && !visited[nr][nc])
  }

  function backtrack(r, c) {
    visited[r][c] = true
    path.push([r, c])
    if (path.length === total) return true

    const candidates = neighbors(r, c)
      .map((pos) => ({ pos, deg: neighbors(pos[0], pos[1]).length, rand: Math.random() }))
      .sort((a, b) => a.deg - b.deg || a.rand - b.rand)
      .map((x) => x.pos)

    for (const [nr, nc] of candidates) {
      if (backtrack(nr, nc)) return true
    }

    visited[r][c] = false
    path.pop()
    return false
  }

  const startR = Math.floor(Math.random() * size)
  const startC = Math.floor(Math.random() * size)
  return backtrack(startR, startC) ? path : null
}

function fallbackSnakePath(size) {
  const path = []
  for (let r = 0; r < size; r++) {
    if (r % 2 === 0) for (let c = 0; c < size; c++) path.push([r, c])
    else for (let c = size - 1; c >= 0; c--) path.push([r, c])
  }
  return path
}

export function buildPuzzle(size, dotCount) {
  let path = null
  for (let attempt = 0; attempt < 40 && !path; attempt++) {
    path = generateHamiltonianPath(size)
  }
  if (!path) path = fallbackSnakePath(size)

  const total = size * size
  const count = Math.max(2, Math.min(dotCount, total))
  const dotIndices = Array.from(
    new Set(
      Array.from({ length: count }, (_, i) => Math.round((i * (total - 1)) / (count - 1)))
    )
  )

  const dots = {}
  dotIndices.forEach((idx, i) => {
    const [r, c] = path[idx]
    dots[key(r, c)] = i + 1
  })

  return { dots, solutionPath: path }
}
