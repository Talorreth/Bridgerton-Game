import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, X, Gavel, KeyRound } from 'lucide-react'
import { SUSPECTS, LIEUX, OBJETS, SOLUTION } from '../../data/investigation'
import { FeatherSeal } from '../ui/illustrations'
import { LIEU_ICONS, OBJET_ICONS } from '../ui/investigationIcons'
import MysteryCelebration from './MysteryCelebration'
import LastChanceOverlay from './LastChanceOverlay'

const CYCLE = [null, 'check', 'cross']
const LAST_CHANCE_PASSWORD = 'luciejetaime'

function CellMark({ state }) {
  if (state === 'check') return <Check size={14} className="text-royal-blue-dark" strokeWidth={3} />
  if (state === 'cross') return <X size={14} className="text-rose-dark" strokeWidth={3} />
  return null
}

export default function DeductionGrid({
  deductionGrid,
  setDeductionCell,
  mysterySolved,
  solveMystery,
  lastChanceUsed,
  triggerLastChance,
  allCluesRevealed,
}) {
  const columns = [...LIEUX, ...OBJETS]
  const [accusation, setAccusation] = useState({ suspectId: '', lieuId: '', objetId: '' })
  const [showCelebration, setShowCelebration] = useState(false)
  const [showLastChanceOverlay, setShowLastChanceOverlay] = useState(false)
  const [password, setPassword] = useState('')
  const [passwordError, setPasswordError] = useState(false)

  const cycleCell = (suspectId, colId) => {
    const key = `${suspectId}__${colId}`
    const current = deductionGrid[key] || null
    const currentIndex = CYCLE.indexOf(current)
    const next = CYCLE[(currentIndex + 1) % CYCLE.length]
    setDeductionCell(key, next)
  }

  const canAccuse = accusation.suspectId && accusation.lieuId && accusation.objetId

  const handleAccuse = () => {
    const correct =
      accusation.suspectId === SOLUTION.suspectId &&
      accusation.lieuId === SOLUTION.lieuId &&
      accusation.objetId === SOLUTION.objetId
    if (correct) {
      solveMystery()
      setShowCelebration(true)
    } else {
      triggerLastChance()
      setShowLastChanceOverlay(true)
    }
  }

  const handlePasswordSubmit = (e) => {
    e.preventDefault()
    if (password.trim().toLowerCase() === LAST_CHANCE_PASSWORD.toLowerCase()) {
      setPasswordError(false)
      solveMystery()
      setShowCelebration(true)
    } else {
      setPasswordError(true)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h3 className="mb-1 font-display text-base font-semibold text-ink">Grille de déduction</h3>
        <p className="mb-3 font-body text-xs text-ink/50">
          Touchez une case pour l'annoter : ✓ probable, ✗ écarté. Croisez suspects, lieux et
          objets à la lumière des feuillets révélés.
        </p>

        <div className="overflow-x-auto rounded-xl border border-gold/30 bg-white">
          <table className="w-full border-collapse text-center">
            <thead>
              <tr>
                <th className="sticky left-0 z-10 bg-white p-2" />
                {columns.map((col) => (
                  <th
                    key={col.id}
                    className="min-w-[64px] border-l border-gold/15 p-1.5 font-body text-[9px] font-semibold uppercase leading-tight text-ink/60"
                  >
                    {col.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {SUSPECTS.map((s) => (
                <tr key={s.id} className="border-t border-gold/15">
                  <th className="sticky left-0 z-10 max-w-[92px] bg-white p-2 text-left font-body text-[11px] font-semibold text-ink/80">
                    {s.name}
                  </th>
                  {columns.map((col) => {
                    const key = `${s.id}__${col.id}`
                    const state = deductionGrid[key] || null
                    return (
                      <td key={col.id} className="border-l border-gold/15 p-0">
                        <button
                          onClick={() => cycleCell(s.id, col.id)}
                          className="flex h-9 w-full items-center justify-center"
                        >
                          <CellMark state={state} />
                        </button>
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="medallion-card rounded-2xl p-5">
        <h3 className="mb-1 flex items-center gap-2 font-display text-base font-semibold text-ink">
          <Gavel size={16} className="text-gold-dark" />
          L'accusation finale
        </h3>
        <p className="mb-4 font-body text-xs text-ink/50">
          Qui, où, avec quoi ? Une seule tentative compte vraiment — choisissez avec soin.
        </p>

        {mysterySolved ? (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
            className="relative overflow-hidden rounded-xl bg-royal-blue/15 p-4"
          >
            <FeatherSeal className="pointer-events-none absolute -right-4 -top-4 h-20 w-20 text-royal-blue-dark/10" />
            <p className="relative font-body text-sm italic leading-relaxed text-ink/85">
              {SOLUTION.reveal}
            </p>
          </motion.div>
        ) : lastChanceUsed ? (
          <motion.form
            onSubmit={handlePasswordSubmit}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
            className="flex flex-col gap-3"
          >
            <p className="font-body text-xs italic text-ink/50">
              La grille classique est refermée. Il ne reste que le mot de passe — à vous de le
              lui soutirer.
            </p>
            <label className="block">
              <span className="mb-1 flex items-center gap-1.5 font-body text-xs font-semibold uppercase tracking-wide text-royal-blue-dark">
                <KeyRound size={12} />
                Mot de passe
              </span>
              <input
                type="text"
                autoFocus
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  setPasswordError(false)
                }}
                placeholder="Chuchotez-le ici…"
                className={`w-full rounded-lg border bg-white px-3 py-2.5 font-body text-sm text-ink outline-none transition ${
                  passwordError ? 'border-rose-dark' : 'border-gold/40 focus:border-gold'
                }`}
              />
            </label>

            <button
              type="submit"
              disabled={!password.trim()}
              className="mt-1 rounded-full bg-ink px-6 py-3 font-display text-sm tracking-wide text-cream shadow-regency transition-[opacity,transform] duration-150 ease-out-regency disabled:opacity-30 active:scale-[0.98]"
            >
              Dévoiler la vérité
            </button>

            {passwordError && (
              <p className="text-center font-body text-xs text-rose-dark">
                Ce n'est pas encore le bon mot. Reposez-lui la question, petit cœur.
              </p>
            )}
          </motion.form>
        ) : (
          <div className="flex flex-col gap-5">
            <div>
              <span className="mb-2 block font-body text-xs font-semibold uppercase tracking-wide text-royal-blue-dark">
                Le suspect
              </span>
              <div className="flex flex-col gap-2">
                {SUSPECTS.map((s) => (
                  <SuspectCard
                    key={s.id}
                    suspect={s}
                    selected={accusation.suspectId === s.id}
                    onClick={() => setAccusation((a) => ({ ...a, suspectId: s.id }))}
                  />
                ))}
              </div>
            </div>

            <div>
              <span className="mb-2 block font-body text-xs font-semibold uppercase tracking-wide text-royal-blue-dark">
                Le lieu
              </span>
              <div className="grid grid-cols-2 gap-2">
                {LIEUX.map((l) => (
                  <OptionCard
                    key={l.id}
                    label={l.name}
                    Icon={LIEU_ICONS[l.icon]}
                    selected={accusation.lieuId === l.id}
                    onClick={() => setAccusation((a) => ({ ...a, lieuId: l.id }))}
                  />
                ))}
              </div>
            </div>

            <div>
              <span className="mb-2 block font-body text-xs font-semibold uppercase tracking-wide text-royal-blue-dark">
                L'objet
              </span>
              <div className="grid grid-cols-2 gap-2">
                {OBJETS.map((o) => (
                  <OptionCard
                    key={o.id}
                    label={o.name}
                    Icon={OBJET_ICONS[o.icon]}
                    selected={accusation.objetId === o.id}
                    onClick={() => setAccusation((a) => ({ ...a, objetId: o.id }))}
                  />
                ))}
              </div>
            </div>

            <button
              onClick={handleAccuse}
              disabled={!canAccuse}
              className="mt-2 rounded-full bg-ink px-6 py-3 font-display text-sm tracking-wide text-cream shadow-regency transition-[opacity,transform] duration-150 ease-out-regency disabled:opacity-30 active:scale-[0.98]"
            >
              Accuser solennellement
            </button>
          </div>
        )}
      </div>

      <AnimatePresence>
        {showLastChanceOverlay && (
          <LastChanceOverlay onClose={() => setShowLastChanceOverlay(false)} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showCelebration && (
          <MysteryCelebration onClose={() => setShowCelebration(false)} />
        )}
      </AnimatePresence>
    </div>
  )
}

function SuspectCard({ suspect, selected, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative flex items-center gap-3 rounded-xl border p-2.5 text-left transition-[border-color,background-color,transform] duration-150 ease-out-regency active:scale-[0.98] ${
        selected ? 'border-gold bg-gold/10 shadow-regency' : 'border-gold/25 bg-white'
      }`}
    >
      <img
        src={suspect.portrait}
        alt=""
        draggable={false}
        className={`h-11 w-11 shrink-0 rounded-full object-cover ring-2 ${
          selected ? 'ring-gold' : 'ring-gold/30'
        }`}
      />
      <span className="min-w-0">
        <span className="block font-body text-[13px] font-semibold leading-tight text-ink/85">
          {suspect.name}
        </span>
        <span className="mt-0.5 block truncate font-body text-[10px] italic text-ink/45">
          {suspect.hint}
        </span>
      </span>
      {selected && (
        <span className="ml-auto flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gold text-cream">
          <Check size={11} strokeWidth={3} />
        </span>
      )}
    </button>
  )
}

function OptionCard({ label, Icon, selected, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative flex flex-col items-center gap-2 rounded-xl border p-3 text-center transition-[border-color,background-color,transform] duration-150 ease-out-regency active:scale-[0.97] ${
        selected ? 'border-gold bg-gold/10 shadow-regency' : 'border-gold/25 bg-white'
      }`}
    >
      {selected && (
        <span className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-gold text-cream">
          <Check size={10} strokeWidth={3} />
        </span>
      )}
      <span
        className={`flex h-11 w-11 items-center justify-center rounded-full ${
          selected ? 'wax-seal' : 'bg-royal-blue/15'
        }`}
      >
        {Icon && (
          <Icon size={24} className={selected ? 'text-cream' : 'text-royal-blue-dark'} />
        )}
      </span>
      <span className="font-body text-[11px] font-semibold leading-tight text-ink/80">{label}</span>
    </button>
  )
}
