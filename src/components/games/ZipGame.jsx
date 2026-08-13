import { useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Eraser } from 'lucide-react'
import HintButton from './HintButton'
import { buildPuzzle, key } from './zipPuzzle'

function isAdjacent(a, b) {
  if (!a || !b) return false
  const dr = Math.abs(a[0] - b[0])
  const dc = Math.abs(a[1] - b[1])
  return (dr === 1 && dc === 0) || (dr === 0 && dc === 1)
}

export default function ZipGame({ gridSize = 5, dotCount = 5, puzzle: puzzleProp, onSolved, onError }) {
  const size = gridSize
  const puzzle = useMemo(() => puzzleProp ?? buildPuzzle(size, dotCount), [size, dotCount, puzzleProp])
  const [path, setPath] = useState([])
  const [feedback, setFeedback] = useState(null)
  const drawingRef = useRef(false)

  useEffect(() => {
    const stop = () => {
      drawingRef.current = false
    }
    window.addEventListener('pointerup', stop)
    window.addEventListener('pointercancel', stop)
    return () => {
      window.removeEventListener('pointerup', stop)
      window.removeEventListener('pointercancel', stop)
    }
  }, [])

  const pathIndex = useMemo(() => {
    const map = new Map()
    path.forEach(([r, c], i) => map.set(key(r, c), i))
    return map
  }, [path])

  const startCellKey = useMemo(() => {
    const entry = Object.entries(puzzle.dots).find(([, n]) => n === 1)
    return entry?.[0]
  }, [puzzle])

  const extendTo = (r, c) => {
    setPath((prev) => {
      if (prev.length === 0) return prev
      const existingIndex = prev.findIndex(([pr, pc]) => pr === r && pc === c)
      if (existingIndex !== -1) {
        return prev.slice(0, existingIndex + 1)
      }
      const last = prev[prev.length - 1]
      if (!isAdjacent(last, [r, c])) {
        onError?.()
        return prev
      }
      const next = [...prev, [r, c]]
      if (next.length === size * size) {
        const dotOrder = Object.entries(puzzle.dots)
          .map(([ck, num]) => ({ num, idx: next.findIndex(([nr, nc]) => key(nr, nc) === ck) }))
          .sort((a, b) => a.num - b.num)
        const orderOk = dotOrder.every((d, i) => i === 0 || d.idx > dotOrder[i - 1].idx)
        if (orderOk) {
          setFeedback('ok')
          setTimeout(() => onSolved?.(), 350)
        } else {
          setFeedback('ko')
          onError?.()
        }
      }
      return next
    })
  }

  const handlePointerDown = (r, c) => {
    const k = key(r, c)
    if (path.length === 0) {
      if (k === startCellKey) {
        drawingRef.current = true
        setPath([[r, c]])
        setFeedback(null)
      }
      return
    }
    drawingRef.current = true
    setFeedback(null)
    extendTo(r, c)
  }

  const handlePointerEnter = (r, c) => {
    if (!drawingRef.current) return
    extendTo(r, c)
  }

  const clearPath = () => {
    setPath([])
    setFeedback(null)
  }

  // Prolonge le tracé jusqu'à la prochaine case du chemin solution, en
  // corrigeant au passage tout écart déjà commis par le joueur.
  const revealHint = () => {
    setPath((prev) => {
      let matchLen = 0
      while (
        matchLen < prev.length &&
        matchLen < puzzle.solutionPath.length &&
        prev[matchLen][0] === puzzle.solutionPath[matchLen][0] &&
        prev[matchLen][1] === puzzle.solutionPath[matchLen][1]
      ) {
        matchLen++
      }
      if (matchLen >= puzzle.solutionPath.length) return prev
      const next = puzzle.solutionPath.slice(0, matchLen + 1)
      if (next.length === size * size) {
        setTimeout(() => onSolved?.(), 350)
      }
      return next
    })
    setFeedback(null)
  }

  const cells = Array.from({ length: size * size }, (_, i) => i)

  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-center font-body text-xs text-ink/50">
        Glissez le doigt, sans le lever, pour tracer un chemin qui traverse chaque case une seule
        fois en reliant les chiffres dans l'ordre.
      </p>

      <HintButton onUse={revealHint} />

      <div
        className="relative rounded-lg border border-gold/40 bg-white p-[3px] shadow-inner"
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))`,
          gap: '3px',
          width: '100%',
          maxWidth: 340,
          touchAction: 'none',
        }}
      >
        <svg
          className="pointer-events-none absolute"
          viewBox={`0 0 ${size} ${size}`}
          preserveAspectRatio="none"
          style={{ left: 3, top: 3, width: 'calc(100% - 6px)', height: 'calc(100% - 6px)' }}
        >
          {path.length > 1 && (
            <polyline
              points={path.map(([r, c]) => `${c + 0.5},${r + 0.5}`).join(' ')}
              fill="none"
              stroke="#A6862A"
              strokeWidth={0.16}
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity={0.85}
            />
          )}
        </svg>

        {cells.map((i) => {
          const r = Math.floor(i / size)
          const c = i % size
          const k = key(r, c)
          const dotNumber = puzzle.dots[k]
          const onPath = pathIndex.has(k)
          const isAlt = (r + c) % 2 === 0

          return (
            <button
              key={k}
              onPointerDown={(e) => {
                e.preventDefault()
                handlePointerDown(r, c)
              }}
              onPointerEnter={() => handlePointerEnter(r, c)}
              className="relative flex aspect-square items-center justify-center rounded-[3px]"
              style={{ backgroundColor: isAlt ? '#FADADD40' : '#A4C3D226' }}
            >
              {onPath && (
                <span
                  className="absolute inset-1 rounded-[2px]"
                  style={{ backgroundColor: '#D4AF3733' }}
                />
              )}
              {dotNumber && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="relative flex h-6 w-6 items-center justify-center rounded-full font-display text-xs font-semibold"
                  style={{
                    backgroundColor: onPath ? '#A6862A' : '#3A3A3C',
                    color: '#FAFAFA',
                  }}
                >
                  {dotNumber}
                </motion.div>
              )}
            </button>
          )
        })}
      </div>

      <p className="font-body text-xs text-ink/40">
        {path.length} / {size * size} cases tracées
      </p>

      <button
        onClick={clearPath}
        className="flex items-center gap-2 rounded-full border border-gold/50 bg-white px-5 py-2 font-display text-xs tracking-wide text-ink shadow-sm transition-transform duration-150 ease-out-regency active:scale-95"
      >
        <Eraser size={13} />
        Effacer le chemin
      </button>

      {feedback === 'ko' && (
        <p className="font-body text-xs text-rose-dark">
          Le chemin ne relie pas les chiffres dans le bon ordre. Recommencez.
        </p>
      )}
    </div>
  )
}
