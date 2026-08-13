import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Sun, Moon, CheckCircle } from 'lucide-react'
import HintButton from './HintButton'
import { buildPuzzle, EMPTY, SUN, MOON } from './tangoPuzzle'

function isValidComplete(values, size, constraints) {
  const half = size / 2
  const hasTriple = (arr) => {
    for (let i = 0; i < arr.length - 2; i++) {
      if (arr[i] !== EMPTY && arr[i] === arr[i + 1] && arr[i + 1] === arr[i + 2]) return true
    }
    return false
  }

  for (let r = 0; r < size; r++) {
    const row = values[r]
    if (row.includes(EMPTY)) return false
    if (row.filter((v) => v === SUN).length !== half) return false
    if (hasTriple(row)) return false
  }
  for (let c = 0; c < size; c++) {
    const col = values.map((row) => row[c])
    if (col.filter((v) => v === SUN).length !== half) return false
    if (hasTriple(col)) return false
  }
  for (const constraint of constraints) {
    const a = values[constraint.r1][constraint.c1]
    const b = values[constraint.r2][constraint.c2]
    if (constraint.type === 'eq' && a !== b) return false
    if (constraint.type === 'diff' && a === b) return false
  }
  return true
}

export default function TangoGame({ gridSize = 6, puzzle: puzzleProp, onSolved, onError }) {
  const size = gridSize % 2 === 0 ? gridSize : gridSize + 1
  const puzzle = useMemo(() => puzzleProp ?? buildPuzzle(size), [size, puzzleProp])
  const [values, setValues] = useState(() => puzzle.values.map((row) => [...row]))
  const [feedback, setFeedback] = useState(null)

  const toggleCell = (r, c) => {
    if (puzzle.fixed[r][c]) return
    setValues((prev) => {
      const next = prev.map((row) => [...row])
      next[r][c] = (next[r][c] + 1) % 3
      return next
    })
    setFeedback(null)
  }

  const handleVerify = () => {
    if (isValidComplete(values, size, puzzle.constraints)) {
      setFeedback('ok')
      setTimeout(() => onSolved?.(), 350)
    } else {
      setFeedback('ko')
      onError?.()
    }
  }

  const filledCount = values.flat().filter((v) => v !== EMPTY).length
  const cellPercent = 100 / size

  // Corrige une case (vide ou erronée) qui n'est pas déjà imposée au départ.
  const revealHint = () => {
    setValues((prev) => {
      const wrongOrEmpty = []
      for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
          if (!puzzle.fixed[r][c] && prev[r][c] !== puzzle.solution[r][c]) {
            wrongOrEmpty.push([r, c])
          }
        }
      }
      if (wrongOrEmpty.length === 0) return prev
      const [r, c] = wrongOrEmpty[Math.floor(Math.random() * wrongOrEmpty.length)]
      const next = prev.map((row) => [...row])
      next[r][c] = puzzle.solution[r][c]
      return next
    })
    setFeedback(null)
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-center font-body text-xs text-ink/50">
        Autant de Soleils que de Lunes par ligne et colonne. Jamais trois symboles identiques
        d'affilée. Le signe = impose la même figure, le signe × des figures opposées.
      </p>

      <HintButton onUse={revealHint} />

      <div className="relative" style={{ width: '100%', maxWidth: 340 }}>
        <div
          className="grid gap-[3px] rounded-lg border border-gold/40 bg-white p-[3px] shadow-inner"
          style={{ gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))` }}
        >
          {values.map((row, r) =>
            row.map((value, c) => {
              const isFixed = puzzle.fixed[r][c]
              const isAlt = (r + c) % 2 === 0
              return (
                <button
                  key={`${r}-${c}`}
                  onClick={() => toggleCell(r, c)}
                  disabled={isFixed}
                  className="flex aspect-square items-center justify-center rounded-[3px]"
                  style={{
                    backgroundColor: isFixed ? '#D4AF3733' : isAlt ? '#A4C3D233' : '#FADADD40',
                  }}
                >
                  {value === SUN && (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                      <Sun size={16} className={isFixed ? 'text-gold-dark' : 'text-gold-dark/90'} />
                    </motion.div>
                  )}
                  {value === MOON && (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                      <Moon size={16} className={isFixed ? 'text-royal-blue-dark' : 'text-royal-blue-dark/90'} />
                    </motion.div>
                  )}
                </button>
              )
            })
          )}
        </div>

        <div className="pointer-events-none absolute inset-0">
          {puzzle.constraints.map((constraint, i) => {
            const isHorizontal = constraint.r1 === constraint.r2
            const leftPct = isHorizontal ? constraint.c2 * cellPercent : (constraint.c1 + 0.5) * cellPercent
            const topPct = isHorizontal ? (constraint.r1 + 0.5) * cellPercent : constraint.r2 * cellPercent
            return (
              <span
                key={i}
                className="absolute flex h-4 w-4 items-center justify-center rounded-full border border-gold/60 bg-cream font-display text-[9px] font-bold text-ink shadow-sm"
                style={{ left: `${leftPct}%`, top: `${topPct}%`, transform: 'translate(-50%, -50%)' }}
              >
                {constraint.type === 'eq' ? '=' : '×'}
              </span>
            )
          })}
        </div>
      </div>

      <p className="font-body text-xs text-ink/40">
        {filledCount} / {size * size} cases remplies
      </p>

      <button
        onClick={handleVerify}
        className="flex items-center gap-2 rounded-full bg-ink px-6 py-2.5 font-display text-sm tracking-wide text-cream shadow-regency transition-transform duration-150 ease-out-regency active:scale-95"
      >
        <CheckCircle size={15} />
        Vérifier l'équilibre
      </button>

      {feedback === 'ko' && (
        <p className="font-body text-xs text-rose-dark">
          L'équilibre n'y est pas encore. Observez les lignes, les colonnes et les signes.
        </p>
      )}
    </div>
  )
}
