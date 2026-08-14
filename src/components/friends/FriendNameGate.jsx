import { useState } from 'react'
import { ArrowRight } from 'lucide-react'
import Header from '../layout/Header'

const NOBLE_TITLE_GROUPS = [
  { label: 'Dames', titles: ['Duchesse', 'Marquise', 'Comtesse', 'Vicomtesse', 'Baronne', 'Dame'] },
  { label: 'Messieurs', titles: ['Duc', 'Marquis', 'Comte', 'Vicomte', 'Baron', 'Chevalier'] },
]

export default function FriendNameGate({ onSubmit }) {
  const [name, setName] = useState('')
  const [title, setTitle] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed || !title) return
    onSubmit(`${title} ${trimmed}`)
  }

  return (
    <div className="pb-28">
      <Header
        eyebrow="Séance d'essai privée"
        title="Testez les épreuves"
        subtitle="Vos temps serviront de repère avant l'arrivée de l'invitée. Choisissez votre rang et votre nom pour commencer."
      />

      <form onSubmit={handleSubmit} className="mx-6 medallion-card rounded-2xl p-6 shadow-regency">
        <label className="block font-body text-xs uppercase tracking-[0.25em] text-royal-blue-dark">
          Votre titre de noblesse
        </label>

        {NOBLE_TITLE_GROUPS.map((group) => (
          <div key={group.label} className="mt-2">
            <p className="mb-1.5 font-body text-[11px] italic text-ink/50">{group.label}</p>
            <div className="grid grid-cols-2 gap-2">
              {group.titles.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTitle(t)}
                  className={`rounded-full border px-4 py-2 font-body text-sm transition-transform duration-150 ease-out-regency active:scale-95 ${
                    title === t
                      ? 'border-gold bg-gold font-semibold text-ink shadow-regency'
                      : 'border-gold/40 bg-white text-ink/70'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        ))}

        <label className="mt-5 block font-body text-xs uppercase tracking-[0.25em] text-royal-blue-dark">
          Votre nom
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ex. Camille"
          className="mt-2 w-full rounded-full border border-gold/40 bg-white px-5 py-3 text-center font-body text-sm text-ink outline-none transition focus:border-gold"
        />
        <button
          type="submit"
          disabled={!name.trim() || !title}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-ink px-6 py-3 font-display text-sm tracking-wide text-cream shadow-regency transition-transform duration-150 ease-out-regency active:scale-[0.98] disabled:opacity-40"
        >
          Commencer
          <ArrowRight size={16} />
        </button>
      </form>
    </div>
  )
}
