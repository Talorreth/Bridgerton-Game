import { motion } from 'framer-motion'
import { Sparkles, ScrollText } from 'lucide-react'
import { ACTIVITY_ICONS } from '../ui/activityIcons'
import { FeatherSeal } from '../ui/illustrations'

const petalPositions = Array.from({ length: 14 }, (_, i) => ({
  left: `${(i * 37) % 100}%`,
  delay: i * 0.06,
  duration: 2.4 + (i % 5) * 0.3,
}))

export default function UnlockOverlay({ activity, clue, onClose }) {
  const Icon = activity ? ACTIVITY_ICONS[activity.icon] : null

  return (
    <motion.div
      className="fixed inset-0 z-[60] flex items-center justify-center overflow-hidden bg-ink/60 px-6 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {petalPositions.map((p, i) => (
        <motion.span
          key={i}
          className="pointer-events-none absolute top-0 h-2.5 w-2.5 rounded-full bg-rose/80"
          style={{ left: p.left }}
          initial={{ y: -20, opacity: 0, rotate: 0 }}
          animate={{ y: '110vh', opacity: [0, 1, 1, 0], rotate: 180 }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: 'linear' }}
        />
      ))}

      <motion.div
        initial={{ scale: 0.85, y: 30, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 220, damping: 20 }}
        className="relative w-full max-w-sm overflow-hidden rounded-3xl border border-gold/50 bg-cream p-7 text-center shadow-regency-lg"
      >
        <FeatherSeal className="pointer-events-none absolute -right-5 -top-5 h-24 w-24 text-gold-dark/10" />

        <motion.div
          initial={{ scale: 0, rotate: -30 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 14, delay: 0.15 }}
          className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full wax-seal"
        >
          <Sparkles size={26} className="text-cream" />
        </motion.div>

        {activity ? (
          <>
            <p className="font-body text-xs uppercase tracking-[0.3em] text-gold-dark">
              Activité débloquée
            </p>
            <div className="mt-2 flex items-center justify-center gap-2">
              {Icon && <Icon size={18} className="text-royal-blue-dark" />}
              <h3 className="font-display text-lg font-semibold text-ink">{activity.title}</h3>
            </div>
            <p className="mt-1 font-body text-sm text-ink/60">{activity.place}</p>
          </>
        ) : (
          <>
            <p className="font-body text-xs uppercase tracking-[0.3em] text-gold-dark">
              Feuillet révélé
            </p>
            <h3 className="mt-2 font-display text-lg font-semibold text-ink">
              Il reste à percer le mystère…
            </h3>
            <p className="mt-1 font-body text-sm text-ink/60">
              La dernière activité du séjour se dévoilera une fois le coupable démasqué.
            </p>
          </>
        )}

        <div className="my-5 gilded-rule" />

        <div className="rounded-2xl bg-royal-blue/15 p-4 text-left">
          <div className="mb-1.5 flex items-center gap-1.5 font-body text-[11px] uppercase tracking-[0.2em] text-royal-blue-dark">
            <ScrollText size={13} />
            {clue?.title}
          </div>
          <p className="font-body text-sm italic leading-relaxed text-ink/80">{clue?.text}</p>
        </div>

        <button
          onClick={onClose}
          className="mt-6 w-full rounded-full bg-ink px-6 py-3 font-display text-sm tracking-wide text-cream shadow-regency transition-transform duration-150 ease-out-regency active:scale-[0.98]"
        >
          Merci, Lady Whistledown
        </button>
      </motion.div>
    </motion.div>
  )
}
