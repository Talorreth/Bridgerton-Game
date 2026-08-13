import { motion } from 'framer-motion'
import { Feather } from 'lucide-react'

const CHAR_DELAY = 0.045
const CHAR_FADE = 0.12

// Fait apparaître un titre lettre par lettre, comme tracé par une plume qui
// glisse au-dessus du texte.
export default function QuillWriteTitle({ text, className = '' }) {
  const chars = Array.from(text)
  const writeDuration = chars.length * CHAR_DELAY + CHAR_FADE

  return (
    <span className={`relative inline-block ${className}`}>
      <motion.span
        className="pointer-events-none absolute -top-2.5 text-gold-dark"
        style={{ rotate: 40 }}
        initial={{ left: '0%', opacity: 0 }}
        animate={{ left: '100%', opacity: [0, 1, 1, 0] }}
        transition={{ duration: writeDuration, times: [0, 0.08, 0.92, 1], ease: 'linear' }}
      >
        <Feather size={15} className="-translate-x-1/2" />
      </motion.span>

      {chars.map((ch, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: CHAR_FADE, delay: i * CHAR_DELAY }}
        >
          {ch === ' ' ? ' ' : ch}
        </motion.span>
      ))}
    </span>
  )
}
