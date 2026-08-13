import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Crown } from 'lucide-react'
import HintButton from './HintButton'
import { buildPuzzle } from './queensPuzzle'

// Palette des régions colorées, façon Régence.
const REGION_COLORS = ['#A4C3D2', '#FADADD', '#E6CB6E', '#C7B8E0', '#B8D8BE', '#F2B9C1']

// Règle : une couronne par ligne, une par colonne, une par région colorée,
// et deux couronnes ne peuvent jamais se toucher (y compris en diagonale).
function isConflicting(crownKeys, r, c, regions) {
  const targetRegion = regions[r][c]
  for (const key of crownKeys) {
    const [cr, cc] = key.split('-').map(Number)
    if (cr === r || cc === c) return true
    if (Math.abs(cr - r) <= 1 && Math.abs(cc - c) <= 1) return true
    if (regions[cr][cc] === targetRegion) return true
  }
  return false
}

export default function QueensGame({ gridSize = 5, puzzle: puzzleProp, onSolved, onError }) {
  const puzzle = useMemo(() => puzzleProp ?? buildPuzzle(gridSize), [gridSize, puzzleProp])
  const [cellStates, setCellStates] = useState(() => new Map())
  const [shakeKey, setShakeKey] = useState(null)

  const cells = Array.from({ length: gridSize * gridSize }, (_, i) => i)
  const crownCount = [...cellStates.values()].filter((v) => v === 'crown').length

  const handleClick = (r, c) => {
    const key = `${r}-${c}`
    setCellStates((prev) => {
      const current = prev.get(key) || 'empty'
      const next = new Map(prev)

      if (current === 'empty') {
        next.set(key, 'x')
        return next
      }

      if (current === 'x') {
        const crowns = [...prev.entries()].filter(([, v]) => v === 'crown').map(([k]) => k)
        if (isConflicting(crowns, r, c, puzzle.regions)) {
          onError?.()
          setShakeKey(key)
          setTimeout(() => setShakeKey(null), 400)
          return prev
        }
        next.set(key, 'crown')
        const newCrownCount = crowns.length + 1
        if (newCrownCount === gridSize) {
          setTimeout(() => onSolved?.(), 350)
        }
        return next
      }

      next.delete(key)
      return next
    })
  }

  // Révèle une couronne correcte sur une ligne encore vide, et retire les
  // couronnes du joueur qui entreraient en conflit avec elle.
  const revealHint = () => {
    setCellStates((prev) => {
      const crownRows = new Set()
      prev.forEach((v, k) => {
        if (v === 'crown') crownRows.add(Number(k.split('-')[0]))
      })
      const targetRow = puzzle.solutionCols.findIndex((_, r) => !crownRows.has(r))
      if (targetRow === -1) return prev

      const targetCol = puzzle.solutionCols[targetRow]
      const targetKey = `${targetRow}-${targetCol}`
      const next = new Map(prev)

      for (const [k, v] of prev.entries()) {
        if (v !== 'crown' || k === targetKey) continue
        const [cr, cc] = k.split('-').map(Number)
        if (isConflicting([targetKey], cr, cc, puzzle.regions)) {
          next.delete(k)
        }
      }
      next.set(targetKey, 'crown')

      const newCrownCount = [...next.values()].filter((v) => v === 'crown').length
      if (newCrownCount === gridSize) {
        setTimeout(() => onSolved?.(), 350)
      }
      return next
    })
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-center font-body text-xs text-ink/50">
        Une couronne par ligne, par colonne et par couleur — jamais deux côte à côte. Touchez une
        fois pour marquer, deux fois pour couronner.
      </p>

      <HintButton onUse={revealHint} />

      <div
        className="grid gap-[3px] rounded-lg border border-gold/40 bg-white p-[3px] shadow-inner"
        style={{ gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`, width: '100%', maxWidth: 340 }}
      >
        {cells.map((i) => {
          const r = Math.floor(i / gridSize)
          const c = i % gridSize
          const key = `${r}-${c}`
          const state = cellStates.get(key) || 'empty'
          const regionColor = REGION_COLORS[puzzle.regions[r][c] % REGION_COLORS.length]

          return (
            <button
              key={key}
              onClick={() => handleClick(r, c)}
              className="relative flex aspect-square items-center justify-center rounded-[3px]"
              style={{ backgroundColor: regionColor }}
            >
              <AnimatePresence>
                {state === 'crown' && (
                  <motion.div
                    initial={{ scale: 0, rotate: -30 }}
                    animate={{
                      scale: 1,
                      rotate: 0,
                      x: shakeKey === key ? [0, -4, 4, -4, 0] : 0,
                    }}
                    exit={{ scale: 0 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 18 }}
                  >
                    <Crown size={gridSize > 5 ? 16 : 20} className="text-ink" fill="#3A3A3C" />
                  </motion.div>
                )}
                {state === 'x' && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="font-display text-sm font-semibold text-ink/50"
                  >
                    ×
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          )
        })}
      </div>
      <p className="font-body text-xs text-ink/40">
        {crownCount} / {gridSize} couronnes placées
      </p>
    </div>
  )
}
