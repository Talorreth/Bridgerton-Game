import { useFriendSession } from '../../hooks/useFriendSession'
import FriendNameGate from './FriendNameGate'
import FriendGameList from './FriendGameList'

// Point d'entrée du mode de test caché, accessible uniquement via l'URL
// secrète ?mode=amies (voir App.jsx). Totalement séparé de l'expérience et
// de la progression normales de l'invitée.
export default function FriendsMode() {
  const { playerName, setPlayerName, completed, recordCompletion } = useFriendSession()

  return (
    <div className="mx-auto min-h-screen max-w-md bg-cream">
      {playerName ? (
        <FriendGameList playerName={playerName} completed={completed} recordCompletion={recordCompletion} />
      ) : (
        <FriendNameGate onSubmit={setPlayerName} />
      )}
    </div>
  )
}
