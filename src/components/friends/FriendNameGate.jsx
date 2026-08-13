import { useState } from 'react'
import { ArrowRight } from 'lucide-react'
import Header from '../layout/Header'

export default function FriendNameGate({ onSubmit }) {
  const [name, setName] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) return
    onSubmit(trimmed)
  }

  return (
    <div className="pb-28">
      <Header
        eyebrow="Séance d'essai privée"
        title="Testez les épreuves"
        subtitle="Vos scores serviront de repère avant l'arrivée de l'invitée. Indiquez votre prénom pour commencer."
      />

      <form onSubmit={handleSubmit} className="mx-6 medallion-card rounded-2xl p-6 shadow-regency">
        <label className="block font-body text-xs uppercase tracking-[0.25em] text-royal-blue-dark">
          Votre prénom
        </label>
        <input
          type="text"
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ex. Camille"
          className="mt-2 w-full rounded-full border border-gold/40 bg-white px-5 py-3 text-center font-body text-sm text-ink outline-none transition focus:border-gold"
        />
        <button
          type="submit"
          disabled={!name.trim()}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-ink px-6 py-3 font-display text-sm tracking-wide text-cream shadow-regency transition-transform duration-150 ease-out-regency active:scale-[0.98] disabled:opacity-40"
        >
          Commencer
          <ArrowRight size={16} />
        </button>
      </form>
    </div>
  )
}
