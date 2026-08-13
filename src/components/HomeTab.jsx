import { useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import Header from './layout/Header'
import AdminPanel from './admin/AdminPanel'
import QuillWriteTitle from './ui/QuillWriteTitle'

const SECRET_TAPS = 5
const SECRET_WINDOW_MS = 2500

export default function HomeTab({
  completedCount,
  totalGames,
  onStart,
  getGameStatus,
  unlockGame,
  lockGame,
  unlockAllGames,
  skipWait,
  resetInvestigation,
}) {
  const progressPct = Math.round((completedCount / totalGames) * 100)
  const [adminOpen, setAdminOpen] = useState(false)
  const tapsRef = useRef([])

  const handleSealTap = () => {
    const now = Date.now()
    tapsRef.current = [...tapsRef.current, now].filter((t) => now - t < SECRET_WINDOW_MS)
    if (tapsRef.current.length >= SECRET_TAPS) {
      tapsRef.current = []
      setAdminOpen(true)
    }
  }

  return (
    <div className="pb-28">
      <Header
        eyebrow="Château Louise de la Vallière"
        title={<QuillWriteTitle text="Le Secret de Lady Whistledown" />}
        subtitle="Un jeu de piste vous attend. Six épreuves. Six révélations. Un mystère à percer avant votre arrivée."
      />

      <div className="mx-6 mb-6 flex justify-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          onClick={handleSealTap}
          className="flex h-24 w-24 items-center justify-center rounded-full wax-seal shadow-regency"
        >
          <img
            src="/lady.png"
            alt="Lady Whistledown"
            className="h-[84px] w-[84px] rounded-full object-cover"
            draggable={false}
          />
        </motion.div>
      </div>

      <div className="mx-6 medallion-card rounded-2xl p-6 shadow-regency">
        <p className="font-body text-[17px] leading-relaxed text-ink/85">
          Chère invitée,
          <br />
          <br />
          Votre séjour au Château vous réserve six moments d'exception — mais la tradition
          de la maison veut qu'on les mérite. Relevez les épreuves de la Cour pour dévoiler,
          une à une, les activités de votre planning… et rassembler les indices qui
          confondront le coupable du <span className="italic text-gold-dark">Secret de Lady Whistledown</span>.
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.23, 1, 0.32, 1], delay: 0.15 }}
        className="mx-6 mt-5 flex justify-center"
      >
        <img
          src="/chateau.png"
          alt="Château Louise de la Vallière"
          className="w-full max-w-sm"
          draggable={false}
        />
      </motion.div>

      <p className="mx-6 mt-3 text-center font-body text-sm italic text-ink/60">
        Percez les secrets de Lady Whistledown au château pour débloquer toutes les
        activités de votre séjour !
      </p>

      <div className="mx-6 mt-6">
        <div className="mb-2 flex items-center justify-between font-body text-sm text-ink/70">
          <span>Votre progression</span>
          <span className="font-semibold text-gold-dark">
            {completedCount} / {totalGames} épreuves
          </span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-royal-blue/25">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPct}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="h-full rounded-full bg-gradient-to-r from-gold-dark to-gold"
          />
        </div>
      </div>

      <div className="mx-6 mt-8">
        <button
          onClick={onStart}
          className="group flex w-full items-center justify-center gap-2 rounded-full bg-ink px-6 py-3.5 font-display text-[15px] tracking-wide text-cream shadow-regency-lg transition-transform duration-150 ease-out-regency active:scale-[0.98]"
        >
          {completedCount === 0 ? 'Entrer dans le jeu de piste' : 'Reprendre le jeu de piste'}
          <ArrowRight
            size={16}
            className="transition-transform duration-150 ease-out-regency group-active:translate-x-1"
          />
        </button>
      </div>

      <p className="mx-6 mt-6 text-center font-body text-xs italic text-ink/40">
        Une épreuve est ouverte tous les 3 jours. Revenez souvent, l'aristocratie est patiente.
      </p>

      <AnimatePresence>
        {adminOpen && (
          <AdminPanel
            onClose={() => setAdminOpen(false)}
            getGameStatus={getGameStatus}
            unlockGame={unlockGame}
            lockGame={lockGame}
            unlockAllGames={unlockAllGames}
            skipWait={skipWait}
            resetInvestigation={resetInvestigation}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
