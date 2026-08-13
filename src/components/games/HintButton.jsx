import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Lightbulb } from 'lucide-react'

const SIZE = 44
const RADIUS = 19
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

// Bouton d'indice à recharge : un anneau doré se remplit pendant le délai
// d'attente, puis le bouton s'illumine et pulse dès qu'un indice est prêt.
export default function HintButton({ onUse, cooldownMs = 5000, disabled = false }) {
  const [readyAt, setReadyAt] = useState(() => Date.now() + cooldownMs)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let raf
    const tick = () => {
      const now = Date.now()
      const remaining = Math.max(0, readyAt - now)
      const pct = Math.min(1, 1 - remaining / cooldownMs)
      setProgress(pct)
      if (pct < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [readyAt, cooldownMs])

  const ready = progress >= 1 && !disabled

  const handleClick = () => {
    if (!ready) return
    onUse?.()
    setProgress(0)
    setReadyAt(Date.now() + cooldownMs)
  }

  return (
    <div className="flex flex-col items-center gap-1">
      <motion.button
        type="button"
        onClick={handleClick}
        disabled={!ready}
        aria-label="Obtenir un indice"
        whileTap={ready ? { scale: 0.9 } : undefined}
        animate={
          ready
            ? {
                scale: [1, 1.07, 1],
                boxShadow: [
                  '0 0 0 0 rgba(212,175,55,0.45)',
                  '0 0 0 9px rgba(212,175,55,0)',
                  '0 0 0 0 rgba(212,175,55,0)',
                ],
              }
            : { scale: 1, boxShadow: '0 0 0 0 rgba(212,175,55,0)' }
        }
        transition={ready ? { duration: 1.5, repeat: Infinity, ease: 'easeInOut' } : { duration: 0.2 }}
        className={`relative flex shrink-0 items-center justify-center rounded-full transition-colors ${
          ready ? 'bg-gold text-ink' : 'bg-royal-blue/15 text-royal-blue-dark/50'
        } ${disabled ? 'opacity-40' : ''}`}
        style={{ height: SIZE, width: SIZE }}
      >
        <svg className="absolute inset-0 -rotate-90" viewBox={`0 0 ${SIZE} ${SIZE}`}>
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            fill="none"
            stroke="rgba(58,58,60,0.12)"
            strokeWidth="3"
          />
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            fill="none"
            stroke="#A6862A"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={CIRCUMFERENCE * (1 - progress)}
          />
        </svg>
        <Lightbulb size={17} strokeWidth={1.75} fill={ready ? '#3A3A3C' : 'none'} />
      </motion.button>
      <span className="font-body text-[9px] uppercase tracking-[0.2em] text-gold-dark">
        Indice
      </span>
    </div>
  )
}
