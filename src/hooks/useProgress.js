import { useCallback, useEffect, useState } from 'react'
import { GAMES, UNLOCK_DELAY_DAYS } from '../data/gamesConfig'

const STORAGE_KEY = 'chateau_louise_progress_v1'
const DAY_MS = 24 * 60 * 60 * 1000
const DEBUG_MODE = import.meta.env.VITE_DEBUG_UNLOCK_ALL_GAMES === 'true'

const defaultState = () => {
  const baseState = {
    // { [gameIndex]: { score, completedAt (ISO string) } }
    completedGames: {},
    // ids des activités débloquées
    unlockedActivities: [],
    // ids des jeux dont le déblocage n'a pas encore été "vu" (pour l'animation)
    pendingReveal: null,
    // grille de déduction du Bureau d'Enquête : { [suspectId-columnId]: 'check' | 'cross' }
    deductionGrid: {},
    // tentative finale résolue avec succès
    mysterySolved: false,
    // une accusation ratée a été faite : la grille classique est verrouillée,
    // seule la dernière chance (mot de passe) reste ouverte
    lastChanceUsed: false,
    // indices des jeux dont le compteur d'attente a été ignoré — réservé au mode administrateur
    unlockOverrides: [],
  }

  // Mode debug : déverrouille tous les jeux
  if (DEBUG_MODE) {
    const now = new Date().toISOString()
    const completedGames = {}
    const unlockedActivities = []
    
    GAMES.forEach((game) => {
      completedGames[game.index] = { score: 1000, completedAt: now }
      unlockedActivities.push(game.activityId)
    })
    
    return {
      ...baseState,
      completedGames,
      unlockedActivities: Array.from(new Set(unlockedActivities)),
    }
  }

  return baseState
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultState()
    const parsed = JSON.parse(raw)
    return { ...defaultState(), ...parsed }
  } catch (e) {
    return defaultState()
  }
}

function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch (e) {
    // stockage indisponible (mode privé, quota…) — on continue silencieusement
  }
}

export function useProgress() {
  const [state, setState] = useState(loadState)

  useEffect(() => {
    saveState(state)
  }, [state])

  const completedCount = Object.keys(state.completedGames).length

  // Index du prochain jeu à jouer (0 à 5), ou null si tout est terminé
  const nextGameIndex = completedCount < GAMES.length ? completedCount : null

  const getGameStatus = useCallback(
    (gameIndex) => {
      const alreadyDone = state.completedGames[gameIndex]
      if (alreadyDone) {
        return { status: 'completed', ...alreadyDone }
      }
      // L'enquête résolue lève toute restriction d'ordre et d'attente : les
      // épreuves non encore réussies restent jouables librement.
      if (state.mysterySolved) {
        return { status: 'available' }
      }
      if (gameIndex !== nextGameIndex) {
        return { status: 'locked' }
      }
      if (gameIndex === 0) {
        return { status: 'available' }
      }
      const previous = state.completedGames[gameIndex - 1]
      if (!previous) return { status: 'locked' }

      const unlockAt = new Date(previous.completedAt).getTime() + UNLOCK_DELAY_DAYS * DAY_MS
      const now = Date.now()
      if (now >= unlockAt || state.unlockOverrides.includes(gameIndex)) {
        return { status: 'available' }
      }
      return { status: 'waiting', unlockAt }
    },
    [state.completedGames, state.unlockOverrides, state.mysterySolved, nextGameIndex]
  )

  const completeGame = useCallback((gameIndex, score) => {
    setState((prev) => {
      if (prev.completedGames[gameIndex]) return prev // déjà validé, on n'écrase pas
      const game = GAMES.find((g) => g.index === gameIndex)
      const nowIso = new Date().toISOString()
      return {
        ...prev,
        completedGames: {
          ...prev.completedGames,
          [gameIndex]: { score, completedAt: nowIso },
        },
        unlockedActivities: game
          ? Array.from(new Set([...prev.unlockedActivities, game.activityId]))
          : prev.unlockedActivities,
        unlockOverrides: prev.unlockOverrides.filter((idx) => idx !== gameIndex),
        pendingReveal: gameIndex,
      }
    })
  }, [])

  // Ignore le compteur d'attente d'un jeu pour le rendre jouable immédiatement — réservé au mode administrateur.
  const skipWait = useCallback((gameIndex) => {
    setState((prev) => ({
      ...prev,
      unlockOverrides: Array.from(new Set([...prev.unlockOverrides, gameIndex])),
    }))
  }, [])

  const clearPendingReveal = useCallback(() => {
    setState((prev) => ({ ...prev, pendingReveal: null }))
  }, [])

  // Débloque un jeu (et son activité) sans passer par l'épreuve — réservé au mode administrateur.
  const unlockGame = useCallback((gameIndex, { silent = false } = {}) => {
    setState((prev) => {
      const game = GAMES.find((g) => g.index === gameIndex)
      if (!game || prev.completedGames[gameIndex]) return prev
      const nowIso = new Date().toISOString()
      return {
        ...prev,
        completedGames: {
          ...prev.completedGames,
          [gameIndex]: { score: game.highScore, completedAt: nowIso },
        },
        unlockedActivities: Array.from(new Set([...prev.unlockedActivities, game.activityId])),
        unlockOverrides: prev.unlockOverrides.filter((idx) => idx !== gameIndex),
        pendingReveal: silent ? prev.pendingReveal : gameIndex,
      }
    })
  }, [])

  // Reverrouille un jeu et retire l'activité associée — réservé au mode administrateur.
  const lockGame = useCallback((gameIndex) => {
    setState((prev) => {
      const game = GAMES.find((g) => g.index === gameIndex)
      if (!game) return prev
      const completedGames = { ...prev.completedGames }
      delete completedGames[gameIndex]
      return {
        ...prev,
        completedGames,
        unlockedActivities: prev.unlockedActivities.filter((id) => id !== game.activityId),
        unlockOverrides: prev.unlockOverrides.filter((idx) => idx !== gameIndex),
      }
    })
  }, [])

  // Débloque tous les jeux et toutes les activités d'un coup — réservé au mode administrateur.
  const unlockAllGames = useCallback(() => {
    setState((prev) => {
      const nowIso = new Date().toISOString()
      const completedGames = { ...prev.completedGames }
      const unlockedActivities = new Set(prev.unlockedActivities)
      GAMES.forEach((game) => {
        if (!completedGames[game.index]) {
          completedGames[game.index] = { score: game.highScore, completedAt: nowIso }
        }
        unlockedActivities.add(game.activityId)
      })
      return {
        ...prev,
        completedGames,
        unlockedActivities: Array.from(unlockedActivities),
      }
    })
  }, [])

  const setDeductionCell = useCallback((cellKey, value) => {
    setState((prev) => ({
      ...prev,
      deductionGrid: { ...prev.deductionGrid, [cellKey]: value },
    }))
  }, [])

  // Résoudre l'enquête débloque instantanément toutes les activités du
  // séjour, mais laisse les épreuves non réussies jouables (voir
  // getGameStatus) — ce n'est pas un raccourci qui prive l'invitée du jeu.
  const solveMystery = useCallback(() => {
    setState((prev) => ({
      ...prev,
      mysterySolved: true,
      unlockedActivities: Array.from(
        new Set([...prev.unlockedActivities, ...GAMES.map((g) => g.activityId)])
      ),
    }))
  }, [])

  // Une accusation ratée : referme la grille classique, n'ouvre plus que la
  // dernière chance (mot de passe).
  const triggerLastChance = useCallback(() => {
    setState((prev) => ({ ...prev, lastChanceUsed: true }))
  }, [])

  const resetProgress = useCallback(() => {
    const fresh = defaultState()
    setState(fresh)
  }, [])

  // Réinitialise uniquement le Bureau d'Enquête (grille de déduction et
  // accusation) — réservé au mode administrateur. Les jeux et activités
  // débloqués ne sont pas affectés.
  const resetInvestigation = useCallback(() => {
    setState((prev) => ({ ...prev, deductionGrid: {}, mysterySolved: false, lastChanceUsed: false }))
  }, [])

  const unlockedClues = Object.keys(state.completedGames)
    .map(Number)
    .sort((a, b) => a - b)
    .map((idx) => GAMES.find((g) => g.index === idx)?.clue)
    .filter(Boolean)

  return {
    state,
    completedCount,
    nextGameIndex,
    getGameStatus,
    completeGame,
    clearPendingReveal,
    setDeductionCell,
    solveMystery,
    triggerLastChance,
    resetProgress,
    resetInvestigation,
    unlockGame,
    lockGame,
    unlockAllGames,
    skipWait,
    unlockedClues,
  }
}
