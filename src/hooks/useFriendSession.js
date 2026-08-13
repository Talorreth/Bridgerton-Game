import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

// Session du mode de test caché "amies" — stockage totalement séparé de
// 'chateau_louise_progress_v1' (useProgress.js) pour ne jamais interférer
// avec la progression réelle de l'invitée.
const STORAGE_KEY = 'chateau_louise_friends_v1'

const defaultState = () => ({
  playerName: '',
  // { [gameIndex]: { score, submittedAt (ISO string), synced } }
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

async function submitScore({ playerName, gameIndex, score }) {
  if (!supabase) return false
  const { error } = await supabase
    .from('scores')
    .insert({ player_name: playerName, game_index: gameIndex, score, source: 'amie' })
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
    (gameIndex, score) => {
      const submittedAt = new Date().toISOString()
      setState((prev) => ({
        ...prev,
        completed: {
          ...prev.completed,
          [gameIndex]: { score, submittedAt, synced: false },
        },
      }))

      submitScore({ playerName: state.playerName, gameIndex, score }).then((ok) => {
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

  // Retente la synchronisation des scores restés en attente (ex. après une
  // coupure réseau pendant la session).
  useEffect(() => {
    Object.entries(state.completed).forEach(([gameIndex, entry]) => {
      if (entry.synced) return
      submitScore({ playerName: state.playerName, gameIndex: Number(gameIndex), score: entry.score }).then(
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
