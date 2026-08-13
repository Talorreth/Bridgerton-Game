import { motion } from 'framer-motion'
import { Heart, Sparkle } from 'lucide-react'
import { FeatherSeal } from '../ui/illustrations'

const heartPositions = Array.from({ length: 10 }, (_, i) => ({
  left: `${(i * 41 + 6) % 100}%`,
  delay: i * 0.18,
  duration: 3.2 + (i % 4) * 0.4,
  size: 12 + (i % 3) * 6,
}))

const sparklePositions = Array.from({ length: 16 }, (_, i) => ({
  left: `${(i * 23 + 11) % 100}%`,
  delay: i * 0.12,
  duration: 2.2 + (i % 5) * 0.25,
}))

export default function MysteryCelebration({ onClose }) {
  return (
    <motion.div
      className="fixed inset-0 z-[80] flex items-center justify-center overflow-hidden bg-ink/60 px-6 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {heartPositions.map((p, i) => (
        <motion.span
          key={`h-${i}`}
          className="pointer-events-none absolute top-0 text-rose-dark/70"
          style={{ left: p.left }}
          initial={{ y: -20, opacity: 0, rotate: -15 }}
          animate={{ y: '110vh', opacity: [0, 1, 1, 0], rotate: 15 }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: 'linear' }}
        >
          <Heart size={p.size} fill="currentColor" />
        </motion.span>
      ))}

      {sparklePositions.map((p, i) => (
        <motion.span
          key={`s-${i}`}
          className="pointer-events-none absolute top-0 text-gold"
          style={{ left: p.left }}
          initial={{ y: -20, opacity: 0, scale: 0.6 }}
          animate={{ y: '110vh', opacity: [0, 1, 0], scale: [0.6, 1, 0.6] }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: 'linear' }}
        >
          <Sparkle size={10} fill="currentColor" />
        </motion.span>
      ))}

      <motion.div
        initial={{ scale: 0.85, y: 30, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 220, damping: 20 }}
        className="relative w-full max-w-sm overflow-hidden rounded-3xl border border-gold/50 bg-cream p-7 text-center shadow-regency-lg"
      >
        <FeatherSeal className="pointer-events-none absolute -right-5 -top-5 h-24 w-24 text-rose-dark/10" />

        <motion.div
          initial={{ scale: 0, rotate: -30 }}
          animate={{ scale: [0, 1.15, 1], rotate: 0 }}
          transition={{ duration: 0.55, ease: [0.23, 1, 0.32, 1], delay: 0.15 }}
          className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full wax-seal"
        >
          <Heart size={26} className="text-cream" fill="currentColor" />
        </motion.div>

        <p className="font-body text-xs uppercase tracking-[0.3em] text-gold-dark">
          Le mystère est percé
        </p>
        <h3 className="mt-1 font-display text-lg font-semibold text-ink">
          Le Secret de Lady Whistledown
        </h3>

        <div className="my-5 gilded-rule" />

        <p className="font-body text-[19px] italic leading-relaxed text-ink/85">
          Bravo petit cœur, tu as réussi. Maintenant, profitons de ce séjour !
          <br />
          Je t'aime 💕
        </p>

        <button
          onClick={onClose}
          className="mt-6 w-full rounded-full bg-ink px-6 py-3 font-display text-sm tracking-wide text-cream shadow-regency transition-transform duration-150 ease-out-regency active:scale-[0.98]"
        >
          Profiter du séjour
        </button>
      </motion.div>
    </motion.div>
  )
}
