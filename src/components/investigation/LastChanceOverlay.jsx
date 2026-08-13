import { motion } from 'framer-motion'
import { KeyRound } from 'lucide-react'
import { FeatherSeal } from '../ui/illustrations'

const ringCount = [0, 1, 2]

export default function LastChanceOverlay({ onClose }) {
  return (
    <motion.div
      className="fixed inset-0 z-[80] flex items-center justify-center overflow-hidden bg-ink/60 px-6 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        initial={{ scale: 0.85, y: 30, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 220, damping: 20 }}
        className="relative w-full max-w-sm overflow-hidden rounded-3xl border border-gold/50 bg-cream p-7 text-center shadow-regency-lg"
      >
        <FeatherSeal className="pointer-events-none absolute -right-5 -top-5 h-24 w-24 text-royal-blue-dark/10" />

        <div className="relative mx-auto mb-4 flex h-16 w-16 items-center justify-center">
          {ringCount.map((i) => (
            <motion.span
              key={i}
              className="absolute h-16 w-16 rounded-full border border-gold/50"
              initial={{ scale: 0.8, opacity: 0.6 }}
              animate={{ scale: 1.8, opacity: 0 }}
              transition={{ duration: 1.8, delay: i * 0.5, repeat: Infinity, ease: 'easeOut' }}
            />
          ))}
          <motion.div
            initial={{ rotate: -20, scale: 0 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 14, delay: 0.15 }}
            className="relative flex h-16 w-16 items-center justify-center rounded-full wax-seal"
          >
            <KeyRound size={24} className="text-cream" />
          </motion.div>
        </div>

        <p className="font-body text-xs uppercase tracking-[0.3em] text-gold-dark">
          Ce n'est pas le bon coupable
        </p>
        <h3 className="mt-1 font-display text-lg font-semibold text-ink">
          Une dernière chance
        </h3>

        <div className="my-5 gilded-rule" />

        <p className="font-body text-[17px] italic leading-relaxed text-ink/85">
          Malheureusement, ce n'est pas le bon coupable mon coeur. Mais pas de panique : je te
          laisse une dernière chance. Trouve le mot de passe… en me posant des questions !
        </p>

        <button
          onClick={onClose}
          className="mt-6 w-full rounded-full bg-ink px-6 py-3 font-display text-sm tracking-wide text-cream shadow-regency transition-transform duration-150 ease-out-regency active:scale-[0.98]"
        >
          Je relève le défi
        </button>
      </motion.div>
    </motion.div>
  )
}
