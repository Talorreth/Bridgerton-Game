import { useEffect } from 'react'
import { motion } from 'framer-motion'

// Écran d'arrivée : une enveloppe scellée à la cire se brise, s'ouvre et
// laisse glisser la lettre d'invitation avant de révéler l'accueil.
// Ne joue qu'une fois par arrivée sur le site (montée du composant App).
const HOLD_MS = 4400

export default function EnvelopeLoader({ onDone }) {
  useEffect(() => {
    const timer = setTimeout(() => onDone?.(), HOLD_MS)
    return () => clearTimeout(timer)
  }, [onDone])

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-7 bg-cream"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.06 }}
      transition={{ duration: 0.45, ease: [0.23, 1, 0.32, 1] }}
    >
      <motion.div
        className="relative"
        style={{ width: 172, height: 118 }}
        initial={{ opacity: 0, scale: 0.88 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
      >
        {/* Corps de l'enveloppe */}
        <div
          className="absolute inset-0 rounded-md shadow-regency"
          style={{
            background: 'linear-gradient(180deg, #FFFFFF 0%, #FCFAF6 100%)',
            border: '1px solid rgba(212,175,55,0.5)',
          }}
        />

        {/* Pans inférieurs de la pochette */}
        <div
          className="absolute inset-0 overflow-hidden rounded-md"
          style={{ clipPath: 'inset(0 round 6px)' }}
        >
          <div
            className="absolute inset-0"
            style={{
              clipPath: 'polygon(0% 100%, 50% 44%, 100% 100%)',
              background: 'rgba(164,195,210,0.18)',
            }}
          />
        </div>

        {/* Lettre qui glisse hors de l'enveloppe */}
        <motion.div
          className="absolute left-1/2 top-3 flex h-[132px] w-[220px] items-center rounded-[2px] bg-cream px-4 shadow-md"
          style={{ border: '1px solid rgba(212,175,55,0.35)', zIndex: 1 }}
          initial={{ x: '-50%', y: 4, opacity: 0 }}
          animate={{ x: '-50%', y: -86, opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1], delay: 1.1 }}
        >
          <motion.p
            className="font-body text-[13px] italic leading-snug text-ink"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.9 }}
          >
            Le Vicomte Lindemans, épris, vous courtise en vous conviant dans son humble demeure pour un 
            week-end extraordinaire
          </motion.p>
        </motion.div>

        {/* Rabat qui se soulève et s'estompe pour révéler la lettre */}
        <motion.div
          className="absolute left-0 top-0 h-[62px] w-full"
          style={{
            transformOrigin: 'top center',
            clipPath: 'polygon(0% 0%, 100% 0%, 50% 100%)',
            background: 'linear-gradient(165deg, #F7EFD9 0%, #ECDDB6 100%)',
            border: '1.5px solid rgba(166,134,42,0.55)',
            boxShadow: '0 3px 8px rgba(58,58,60,0.12)',
            zIndex: 2,
          }}
          initial={{ scaleY: 1, opacity: 1 }}
          animate={{ scaleY: 0.05, opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.77, 0, 0.175, 1], delay: 0.7 }}
        />

        {/* Cachet de cire qui se brise */}
        <motion.div
          className="wax-seal absolute left-1/2 top-[40px] h-8 w-8 rounded-full shadow-regency"
          style={{ zIndex: 3 }}
          initial={{ x: '-50%', opacity: 1, scale: 1 }}
          animate={{ x: '-50%', opacity: [1, 1, 0], scale: [1, 1.2, 0.3] }}
          transition={{ duration: 0.4, times: [0, 0.4, 1], delay: 0.55 }}
        />
      </motion.div>

      <motion.p
        className="font-body text-[11px] uppercase tracking-[0.35em] text-gold-dark"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        Château Louise de la Vallière
      </motion.p>
    </motion.div>
  )
}
