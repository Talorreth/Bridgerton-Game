import { useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2, Play } from 'lucide-react'
import Header from '../layout/Header'
import { GAMES } from '../../data/gamesConfig'
import { formatTime } from '../../utils/formatTime'
import GameShell from '../games/GameShell'

const TYPE_LABELS = {
  queens: 'Les Couronnes',
  tango: 'L’Équilibre Céleste',
  zip: 'Le Sentier Dérobé',
}

export default function FriendGameList({ playerName, completed, recordCompletion }) {
  const [openGameIndex, setOpenGameIndex] = useState(null)

  return (
    <div className="pb-28">
      <Header
        eyebrow={`Merci ${playerName} !`}
        title="Les 6 épreuves"
        subtitle="Enchaînez-les dans l'ordre de votre choix, sans attente. Vos temps sont enregistrés automatiquement."
      />

      <ol className="mx-6 flex flex-col gap-4">
        {GAMES.map((game) => {
          const done = completed[game.index]

          return (
            <motion.li
              key={game.index}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: game.index * 0.05 }}
              className="medallion-card relative rounded-2xl p-5 shadow-regency"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-body text-xs uppercase tracking-[0.25em] text-royal-blue-dark">
                    Épreuve {game.index + 1} · {TYPE_LABELS[game.type]}
                  </p>
                  <h3 className="mt-1 font-display text-lg font-semibold text-ink">{game.title}</h3>
                  <p className="mt-1 font-body text-sm text-ink/60">{game.tagline}</p>
                </div>
                {done && <CheckCircle2 size={20} className="mt-1 shrink-0 text-royal-blue-dark" />}
              </div>

              <div className="mt-4 flex items-center justify-between">
                <span className="font-body text-xs text-ink/50">
                  {done ? (
                    <>
                      Meilleur temps : <strong className="text-ink/70">{formatTime(done.time)}</strong>
                    </>
                  ) : (
                    <>
                      Temps requis : <strong className="text-ink/70">{formatTime(game.targetSeconds)}</strong>
                    </>
                  )}
                </span>

                <button
                  onClick={() => setOpenGameIndex(game.index)}
                  className="flex items-center gap-1.5 rounded-full bg-gold px-4 py-2 font-display text-xs font-semibold tracking-wide text-ink shadow-regency transition-transform duration-150 ease-out-regency active:scale-95"
                >
                  <Play size={13} fill="currentColor" />
                  {done ? 'Rejouer' : 'Jouer'}
                </button>
              </div>
            </motion.li>
          )
        })}
      </ol>

      {openGameIndex !== null && (
        <GameShell
          game={GAMES.find((g) => g.index === openGameIndex)}
          onClose={() => setOpenGameIndex(null)}
          onWin={(time) => {
            recordCompletion(openGameIndex, time)
          }}
        />
      )}
    </div>
  )
}
