// Script one-off : génère les 6 puzzles (un par épreuve) et les fige dans
// src/data/puzzles.js, pour que toutes les joueuses (amies et invitée)
// résolvent exactement la même grille par épreuve.
//
// Usage : node scripts/generatePuzzles.mjs

import { writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { buildPuzzle as buildQueens } from '../src/components/games/queensPuzzle.js'
import { buildPuzzle as buildTango } from '../src/components/games/tangoPuzzle.js'
import { buildPuzzle as buildZip } from '../src/components/games/zipPuzzle.js'
import { GAMES } from '../src/data/gamesConfig.js'

const puzzles = {}

for (const game of GAMES) {
  if (game.type === 'queens') {
    puzzles[game.index] = buildQueens(game.gridSize)
  } else if (game.type === 'tango') {
    const size = game.gridSize % 2 === 0 ? game.gridSize : game.gridSize + 1
    puzzles[game.index] = buildTango(size)
  } else if (game.type === 'zip') {
    puzzles[game.index] = buildZip(game.gridSize, game.dotCount)
  }
}

const body = `// Généré par scripts/generatePuzzles.mjs — voir ce fichier pour regénérer.
// Ces puzzles sont figés volontairement : toutes les joueuses (amies et
// invitée) doivent résoudre exactement la même grille par épreuve pour que
// les scores soient comparables.
export const PUZZLES = ${JSON.stringify(puzzles, null, 2)}
`

const outPath = fileURLToPath(new URL('../src/data/puzzles.js', import.meta.url))
writeFileSync(outPath, body)
console.log(`src/data/puzzles.js écrit avec ${Object.keys(puzzles).length} puzzles.`)
