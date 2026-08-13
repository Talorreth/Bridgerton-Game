import { ScrollText } from 'lucide-react'

export default function CluesList({ clues }) {
  if (clues.length === 0) {
    return (
      <div className="medallion-card rounded-2xl p-6 text-center">
        <p className="font-body text-sm italic text-ink/50">
          Aucun feuillet n'a encore été révélé. Réussissez une épreuve pour lire les premières
          lignes de Lady Whistledown.
        </p>
      </div>
    )
  }

  return (
    <ul className="flex flex-col gap-3">
      {clues.map((clue, i) => (
        <li key={i} className="medallion-card rounded-2xl p-4">
          <div className="mb-1.5 flex items-center gap-1.5 font-body text-[11px] uppercase tracking-[0.2em] text-royal-blue-dark">
            <ScrollText size={13} />
            {clue.title}
          </div>
          <p className="font-body text-sm italic leading-relaxed text-ink/80">{clue.text}</p>
        </li>
      ))}
    </ul>
  )
}
