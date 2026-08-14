import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

// Session du mode de test caché "amies" — stockage totalement séparé de
// 'chateau_louise_progress_v1' (useProgress.js) pour ne jamais interférer
// avec la progression réelle de l'invitée.
const STORAGE_KEY = 'chateau_louise_friends_v1'

const defaultState = () => ({
  playerName: '',
  // { [gameIndex]: { time (secondes), submittedAt (ISO string), synced } }
  completed: {},
})

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultState()
    return { ...defaultState(), ...JSON.parse(raw) }
  } catch (e) {
    return defaultState()
  }
}

function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch (e) {
    // stockage indisponible — on continue silencieusement
  }
}

// Note : la colonne Supabase s'appelle "score" pour des raisons historiques,
// mais elle contient désormais un temps en secondes.
async function submitTime({ playerName, gameIndex, time }) {
  if (!supabase) return false
  const { error } = await supabase
    .from('scores')
    .insert({ player_name: playerName, game_index: gameIndex, score: time, source: 'amie' })
  return !error
}

export function useFriendSession() {
  const [state, setState] = useState(loadState)

  useEffect(() => {
    saveState(state)
  }, [state])

  const setPlayerName = useCallback((name) => {
    setState((prev) => ({ ...prev, playerName: name }))
  }, [])

  const recordCompletion = useCallback(
    (gameIndex, time) => {
      const submittedAt = new Date().toISOString()
      setState((prev) => ({
        ...prev,
        completed: {
          ...prev.completed,
          [gameIndex]: { time, submittedAt, synced: false },
        },
      }))

      submitTime({ playerName: state.playerName, gameIndex, time }).then((ok) => {
        if (!ok) return
        setState((cur) => ({
          ...cur,
          completed: {
            ...cur.completed,
            [gameIndex]: { ...cur.completed[gameIndex], synced: true },
          },
        }))
      })
    },
    [state.playerName]
  )

  // Retente la synchronisation des temps restés en attente (ex. après une
  // coupure réseau pendant la session).
  useEffect(() => {
    Object.entries(state.completed).forEach(([gameIndex, entry]) => {
      if (entry.synced) return
      submitTime({ playerName: state.playerName, gameIndex: Number(gameIndex), time: entry.time }).then(
        (ok) => {
          if (!ok) return
          setState((cur) => ({
            ...cur,
            completed: {
              ...cur.completed,
              [gameIndex]: { ...cur.completed[gameIndex], synced: true },
            },
          }))
        }
      )
    })
    // Ne s'exécute qu'au montage : un nouvel essai à chaque frappe/état serait inutile.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return {
    playerName: state.playerName,
    setPlayerName,
    completed: state.completed,
    recordCompletion,
  }
}
