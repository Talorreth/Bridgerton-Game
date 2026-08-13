import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Lock, CheckCircle2, Play, ChevronDown, Users } from 'lucide-react'
import Header from '../layout/Header'
import CountdownBadge from '../ui/CountdownBadge'
import { GAMES } from '../../data/gamesConfig'
import { ACTIVITIES } from '../../data/activities'
import { supabase } from '../../lib/supabaseClient'
import GameShell from './GameShell'

const TYPE_LABELS = {
  queens: 'Les Couronnes',
  tango: 'L’Équilibre Céleste',
  zip: 'Le Sentier Dérobé',
}

// Agrège les scores "amie" par jeu : meilleur score par prénom, trié
// décroissant, pour l'affichage du classement détaillé.
function groupFriendScoresByGame(rows) {
  const byGame = {}
  for (const row of rows) {
    const bucket = (byGame[row.game_index] ??= new Map())
    const prevBest = bucket.get(row.player_name) ?? -Infinity
    if (row.score > prevBest) bucket.set(row.player_name, row.score)
  }
  const result = {}
  for (const [gameIndex, bestByPlayer] of Object.entries(byGame)) {
    const entries = [...bestByPlayer.entries()]
      .map(([name, score]) => ({ name, score }))
      .sort((a, b) => b.score - a.score)
    result[gameIndex] = { entries, best: entries[0].score }
  }
  return result
}

// Le score des amies remplace le seuil fixe du jeu dès qu'au moins une amie
// l'a joué ; sinon on retombe sur le highScore statique de gamesConfig.js.
function getEffectiveThreshold(game, friendStatsByGame) {
  const friendBest = friendStatsByGame[game.index]?.best
  return friendBest != null ? friendBest : game.highScore
}

export default function GameHub({ getGameStatus, completeGame }) {
  const [openGameIndex, setOpenGameIndex] = useState(null)
  const [expandedGame, setExpandedGame] = useState(null)
  const [friendScores, setFriendScores] = useState([])

  useEffect(() => {
    let cancelled = false
    async function loadFriendScores() {
      if (!supabase) return
      const { data, error } = await supabase.from('scores').select('player_name, game_index, score').eq('source', 'amie')
      if (!cancelled && !error && data) setFriendScores(data)
    }
    loadFriendScores()
    return () => {
      cancelled = true
    }
  }, [])

  const friendStatsByGame = useMemo(() => groupFriendScoresByGame(friendScores), [friendScores])

  return (
    <div className="pb-28">
      <Header
        eyebrow="Les épreuves de la Cour"
        title="Six défis à relever"
        subtitle="Une épreuve à la fois. Égalez ou dépassez le score exigé pour être digne de la suite."
      />

      <ol className="mx-6 flex flex-col gap-4">
        {GAMES.map((game) => {
          const status = getGameStatus(game.index)
          const activity = ACTIVITIES.find((a) => a.id === game.activityId)
          const friendStats = friendStatsByGame[game.index]
          const threshold = getEffectiveThreshold(game, friendStatsByGame)
          const isExpanded = expandedGame === game.index

          return (
            <motion.li
              key={game.index}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: game.index * 0.05 }}
              className={`medallion-card relative rounded-2xl p-5 shadow-regency ${
                status.status === 'locked' ? 'opacity-50' : ''
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-body text-xs uppercase tracking-[0.25em] text-royal-blue-dark">
                    Épreuve {game.index + 1} · {TYPE_LABELS[game.type]}
                  </p>
                  <h3 className="mt-1 font-display text-lg font-semibold text-ink">
                    {game.title}
                  </h3>
                  <p className="mt-1 font-body text-sm text-ink/60">{game.tagline}</p>
                  {activity && (
                    <p className="mt-2 font-body text-xs italic text-gold-dark">
                      Débloque : {activity.title}
                    </p>
                  )}
                </div>
                <StatusIcon status={status.status} />
              </div>

              <div className="mt-4 flex items-center justify-between">
                <span className="font-body text-xs text-ink/50">
                  Score exigé : <strong className="text-ink/70">{threshold}</strong>
                </span>

                {status.status === 'available' && (
                  <button
                    onClick={() => setOpenGameIndex(game.index)}
                    className="flex items-center gap-1.5 rounded-full bg-gold px-4 py-2 font-display text-xs font-semibold tracking-wide text-ink shadow-regency transition-transform duration-150 ease-out-regency active:scale-95"
                  >
                    <Play size={13} fill="currentColor" />
                    Jouer
                  </button>
                )}

                {status.status === 'waiting' && (
                  <CountdownBadge targetTimestamp={status.unlockAt} />
                )}

                {status.status === 'completed' && (
                  <span className="font-body text-xs font-semibold text-royal-blue-dark">
                    Score : {status.score}
                  </span>
                )}
              </div>

              {friendStats && friendStats.entries.length > 0 && (
                <div className="mt-3 border-t border-gold/20 pt-3">
                  <button
                    onClick={() => setExpandedGame(isExpanded ? null : game.index)}
                    className="flex w-full items-center justify-between font-body text-xs text-royal-blue-dark"
                  >
                    <span className="flex items-center gap-1.5">
                      <Users size={13} />
                      Scores des amies ({friendStats.entries.length})
                    </span>
                    <ChevronDown
                      size={14}
                      className={`transition-transform duration-150 ${isExpanded ? 'rotate-180' : ''}`}
                    />
                  </button>
                  {isExpanded && (
                    <ul className="mt-2 flex flex-col gap-1">
                      {friendStats.entries.map((entry) => (
                        <li
                          key={entry.name}
                          className="flex items-center justify-between font-body text-xs text-ink/60"
                        >
                          <span>{entry.name}</span>
                          <span className="font-semibold text-ink/80">{entry.score}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </motion.li>
          )
        })}
      </ol>

      {openGameIndex !== null && (
        <GameShell
          game={GAMES.find((g) => g.index === openGameIndex)}
          winThreshold={getEffectiveThreshold(GAMES.find((g) => g.index === openGameIndex), friendStatsByGame)}
          onClose={() => setOpenGameIndex(null)}
          onWin={(score) => {
            completeGame(openGameIndex, score)
          }}
        />
      )}
    </div>
  )
}

function StatusIcon({ status }) {
  if (status === 'completed') {
    return <CheckCircle2 size={20} className="mt-1 shrink-0 text-royal-blue-dark" />
  }
  if (status === 'locked' || status === 'waiting') {
    return <Lock size={18} className="mt-1 shrink-0 text-ink/30" />
  }
  return (
    <span className="mt-1 flex h-2.5 w-2.5 shrink-0 animate-pulse rounded-full bg-gold" />
  )
}
