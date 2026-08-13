import { useState } from 'react'
import { motion } from 'framer-motion'
import { KeyRound, X, LockOpen, Lock, ShieldCheck, Crown, TimerReset, RotateCcw } from 'lucide-react'
import { GAMES } from '../../data/gamesConfig'
import { ACTIVITIES } from '../../data/activities'

const ADMIN_PASSWORD = 'luciejetaime'

export default function AdminPanel({
  onClose,
  getGameStatus,
  unlockGame,
  lockGame,
  unlockAllGames,
  skipWait,
  resetInvestigation,
}) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)
  const [authenticated, setAuthenticated] = useState(false)
  const [confirmReset, setConfirmReset] = useState(false)

  const handleResetInvestigation = () => {
    if (!confirmReset) {
      setConfirmReset(true)
      return
    }
    resetInvestigation()
    setConfirmReset(false)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (password === ADMIN_PASSWORD) {
      setAuthenticated(true)
      setError(false)
    } else {
      setError(true)
    }
  }

  return (
    <motion.div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-ink/60 px-6 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 240, damping: 22 }}
        onClick={(e) => e.stopPropagation()}
        className="relative max-h-[85vh] w-full max-w-sm overflow-y-auto rounded-3xl border border-gold/50 bg-cream p-7 shadow-regency-lg"
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-ink/40 transition hover:text-ink"
          aria-label="Fermer"
        >
          <X size={18} />
        </button>

        {!authenticated ? (
          <form onSubmit={handleSubmit} className="text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full wax-seal">
              <KeyRound size={22} className="text-cream" />
            </div>
            <p className="font-body text-xs uppercase tracking-[0.3em] text-gold-dark">
              Cabinet privé
            </p>
            <h3 className="mt-1 font-display text-lg font-semibold text-ink">
              Accès réservé à la maîtresse de maison
            </h3>
            <div className="my-4 gilded-rule" />
            <input
              type="password"
              autoFocus
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                setError(false)
              }}
              placeholder="Mot de passe"
              className={`w-full rounded-full border bg-white px-5 py-3 text-center font-body text-sm text-ink outline-none transition ${
                error ? 'border-rose-dark' : 'border-gold/40 focus:border-gold'
              }`}
            />
            {error && (
              <p className="mt-2 font-body text-xs italic text-rose-dark">
                Ce mot de passe n'ouvre aucune porte de ce Château.
              </p>
            )}
            <button
              type="submit"
              className="mt-5 w-full rounded-full bg-ink px-6 py-3 font-display text-sm tracking-wide text-cream shadow-regency transition-transform duration-150 ease-out-regency active:scale-[0.98]"
            >
              Entrer
            </button>
          </form>
        ) : (
          <div>
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full wax-seal">
              <ShieldCheck size={22} className="text-cream" />
            </div>
            <p className="text-center font-body text-xs uppercase tracking-[0.3em] text-gold-dark">
              Mode administrateur
            </p>
            <h3 className="mt-1 text-center font-display text-lg font-semibold text-ink">
              Ouvrir les portes du Château
            </h3>

            <div className="my-4 gilded-rule" />

            <button
              onClick={unlockAllGames}
              className="mb-2.5 flex w-full items-center justify-center gap-2 rounded-full bg-gold px-5 py-3 font-display text-sm font-semibold tracking-wide text-ink shadow-regency transition-transform duration-150 ease-out-regency active:scale-[0.98]"
            >
              <Crown size={16} />
              Tout déverrouiller
            </button>

            <button
              onClick={handleResetInvestigation}
              onBlur={() => setConfirmReset(false)}
              className={`mb-4 flex w-full items-center justify-center gap-2 rounded-full border px-5 py-3 font-display text-sm font-semibold tracking-wide shadow-regency transition-[background-color,color,transform] duration-150 ease-out-regency active:scale-[0.98] ${
                confirmReset
                  ? 'border-rose-dark bg-rose-dark text-cream'
                  : 'border-rose-dark/40 bg-rose/20 text-rose-dark'
              }`}
            >
              <RotateCcw size={16} />
              {confirmReset ? 'Confirmer la réinitialisation' : "Réinitialiser l'enquête"}
            </button>

            <ul className="flex flex-col gap-2.5">
              {GAMES.map((game) => {
                const activity = ACTIVITIES.find((a) => a.id === game.activityId)
                const status = getGameStatus(game.index).status
                const unlocked = status === 'completed'
                const waiting = status === 'waiting'
                return (
                  <li
                    key={game.index}
                    className="medallion-card flex items-center justify-between gap-3 rounded-2xl px-4 py-3"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-body text-[13px] font-semibold text-ink">
                        {game.index + 1}. {game.title}
                      </p>
                      {activity && (
                        <p className="truncate font-body text-[11px] italic text-ink/50">
                          {activity.place}
                        </p>
                      )}
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-1.5">
                      <button
                        onClick={() =>
                          unlocked ? lockGame(game.index) : unlockGame(game.index, { silent: true })
                        }
                        className={`flex items-center gap-1 rounded-full px-3 py-1.5 font-body text-[11px] font-semibold tracking-wide transition-[background-color,transform] duration-150 ease-out-regency active:scale-95 ${
                          unlocked
                            ? 'bg-royal-blue/25 text-royal-blue-dark'
                            : 'bg-ink text-cream'
                        }`}
                      >
                        {unlocked ? <Lock size={12} /> : <LockOpen size={12} />}
                        {unlocked ? 'Reverrouiller' : 'Déverrouiller'}
                      </button>
                      {waiting && (
                        <button
                          onClick={() => skipWait(game.index)}
                          className="flex items-center gap-1 rounded-full bg-gold/25 px-3 py-1.5 font-body text-[11px] font-semibold tracking-wide text-gold-dark transition-transform duration-150 ease-out-regency active:scale-95"
                        >
                          <TimerReset size={12} />
                          Ignorer le compteur
                        </button>
                      )}
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}
