import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import TabBar from './components/layout/TabBar'
import HomeTab from './components/HomeTab'
import GameHub from './components/games/GameHub'
import PlanningTab from './components/activities/PlanningTab'
import BureauEnquete from './components/investigation/BureauEnquete'
import UnlockOverlay from './components/activities/UnlockOverlay'
import EnvelopeLoader from './components/ui/EnvelopeLoader'
import FriendsMode from './components/friends/FriendsMode'
import { useProgress } from './hooks/useProgress'
import { ACTIVITIES } from './data/activities'
import { GAMES } from './data/gamesConfig'

export default function App() {
  // Lien secret réservé aux amies testeuses (?mode=amies), jamais atteignable
  // depuis la navigation normale — voir src/components/friends/FriendsMode.jsx.
  const isFriendsMode = new URLSearchParams(window.location.search).get('mode') === 'amies'
  if (isFriendsMode) return <FriendsMode />

  const [tab, setTab] = useState('accueil')
  const [loading, setLoading] = useState(true)
  const {
    state,
    completedCount,
    getGameStatus,
    completeGame,
    clearPendingReveal,
    setDeductionCell,
    solveMystery,
    triggerLastChance,
    unlockGame,
    lockGame,
    unlockAllGames,
    skipWait,
    unlockedClues,
    resetInvestigation,
  } = useProgress()

  const pendingGame = state.pendingReveal !== null ? GAMES.find((g) => g.index === state.pendingReveal) : null
  const pendingActivity = pendingGame ? ACTIVITIES.find((a) => a.id === pendingGame.activityId) : null

  return (
    <div className="mx-auto min-h-screen max-w-md bg-cream">
      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -12 }}
          transition={{ duration: 0.22 }}
        >
          {tab === 'accueil' && (
            <HomeTab
              completedCount={completedCount}
              totalGames={GAMES.length}
              onStart={() => setTab('jeux')}
              getGameStatus={getGameStatus}
              unlockGame={unlockGame}
              lockGame={lockGame}
              unlockAllGames={unlockAllGames}
              skipWait={skipWait}
              resetInvestigation={resetInvestigation}
            />
          )}
          {tab === 'jeux' && (
            <GameHub getGameStatus={getGameStatus} completeGame={completeGame} />
          )}
          {tab === 'planning' && <PlanningTab unlockedActivities={state.unlockedActivities} />}
          {tab === 'enquete' && (
            <BureauEnquete
              unlockedClues={unlockedClues}
              deductionGrid={state.deductionGrid}
              setDeductionCell={setDeductionCell}
              mysterySolved={state.mysterySolved}
              solveMystery={solveMystery}
              lastChanceUsed={state.lastChanceUsed}
              triggerLastChance={triggerLastChance}
            />
          )}
        </motion.div>
      </AnimatePresence>

      <TabBar active={tab} onChange={setTab} />

      <AnimatePresence>
        {pendingGame && pendingActivity && (
          <UnlockOverlay
            activity={pendingActivity}
            clue={pendingGame.clue}
            onClose={() => {
              clearPendingReveal()
              setTab('planning')
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>{loading && <EnvelopeLoader onDone={() => setLoading(false)} />}</AnimatePresence>
    </div>
  )
}
