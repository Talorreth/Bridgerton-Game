import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, RotateCcw, Sparkles, Frown } from 'lucide-react'
import QueensGame from './QueensGame'
import TangoGame from './TangoGame'
import ZipGame from './ZipGame'
import { PUZZLES } from '../../data/puzzles'

function computeScore({ elapsedSeconds, errors }) {
  const raw = 1000 - elapsedSeconds * 4 - errors * 30
  return Math.max(0, Math.round(raw))
}

export default function GameShell({ game, winThreshold, onClose, onWin }) {
  const [phase, setPhase] = useState('playing') // 'playing' | 'result'
  const [attempt, setAttempt] = useState(0) // clé de remontage pour "réessayer"
  const [errors, setErrors] = useState(0)
  const [finalScore, setFinalScore] = useState(0)
  const startRef = useRef(Date.now())

  useEffect(() => {
    startRef.current = Date.now()
    setErrors(0)
  }, [attempt])

  const handleError = () => setErrors((e) => e + 1)

  const handleSolved = () => {
    const elapsedSeconds = Math.round((Date.now() - startRef.current) / 1000)
    const score = computeScore({ elapsedSeconds, errors })
    setFinalScore(score)
    setPhase('result')
  }

  const threshold = winThreshold ?? game.highScore
  const won = finalScore >= threshold

  const GameComponent = useMemo(() => {
    if (game.type === 'queens') return QueensGame
    if (game.type === 'tango') return TangoGame
    if (game.type === 'zip') return ZipGame
    return null
  }, [game.type])

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-end justify-center bg-ink/50 backdrop-blur-sm sm:items-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={(e) => e.target === e.currentTarget && phase === 'result' && onClose()}
    >
      <motion.div
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 60, opacity: 0 }}
        transition={{ type: 'spring', damping: 26, stiffness: 260 }}
        className="max-h-[92vh] w-full max-w-md overflow-y-auto rounded-t-3xl bg-cream shadow-regency-lg sm:rounded-3xl"
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gold/25 bg-cream/95 px-5 py-4 backdrop-blur">
          <div>
            <p className="font-body text-[11px] uppercase tracking-[0.25em] text-royal-blue-dark">
              Épreuve {game.index + 1}
            </p>
            <h2 className="font-display text-base font-semibold text-ink">{game.title}</h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-ink/50 transition hover:bg-royal-blue/15"
            aria-label="Fermer"
          >
            <X size={18} />
          </button>
        </div>

        <div className="px-5 py-5">
          <AnimatePresence mode="wait">
            {phase === 'playing' && GameComponent && (
              <motion.div
                key={`playing-${attempt}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <p className="mb-4 text-center font-body text-sm italic text-ink/60">
                  {game.tagline}
                </p>
                <GameComponent
                  gridSize={game.gridSize}
                  dotCount={game.dotCount}
                  puzzle={PUZZLES[game.index]}
                  onSolved={handleSolved}
                  onError={handleError}
                />
              </motion.div>
            )}

            {phase === 'result' && (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center py-4 text-center"
              >
                <motion.div
                  initial={{ scale: 0, rotate: -20 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 16, delay: 0.1 }}
                  className={`mb-4 flex h-16 w-16 items-center justify-center rounded-full ${
                    won ? 'wax-seal' : 'bg-royal-blue/30'
                  }`}
                >
                  {won ? (
                    <Sparkles size={26} className="text-cream" />
                  ) : (
                    <Frown size={26} className="text-ink/60" />
                  )}
                </motion.div>

                <h3 className="font-display text-xl font-semibold text-ink">
                  {won ? 'Épreuve remportée !' : 'Pas tout à fait, chère invitée…'}
                </h3>
                <p className="mt-2 font-body text-sm text-ink/60">
                  Votre score : <strong className="text-ink">{finalScore}</strong> — requis :{' '}
                  <strong className="text-ink">{threshold}</strong>
                </p>

                {won ? (
                  <button
                    onClick={() => onWin(finalScore)}
                    className="mt-6 w-full rounded-full bg-ink px-6 py-3 font-display text-sm tracking-wide text-cream shadow-regency transition-transform duration-150 ease-out-regency active:scale-[0.98]"
                  >
                    Révéler ma récompense
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setAttempt((a) => a + 1)
                      setPhase('playing')
                    }}
                    className="mt-6 flex items-center gap-2 rounded-full border border-gold/50 bg-white px-6 py-3 font-display text-sm tracking-wide text-ink shadow-sm transition-transform duration-150 ease-out-regency active:scale-[0.98]"
                  >
                    <RotateCcw size={15} />
                    Retenter l'épreuve
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  )
}
