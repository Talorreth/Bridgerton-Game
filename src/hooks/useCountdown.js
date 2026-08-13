import { useEffect, useState } from 'react'

// Retourne le temps restant (ms) jusqu'à targetTimestamp, mis à jour chaque seconde.
export function useCountdown(targetTimestamp) {
  const [remaining, setRemaining] = useState(() =>
    targetTimestamp ? Math.max(0, targetTimestamp - Date.now()) : 0
  )

  useEffect(() => {
    if (!targetTimestamp) {
      setRemaining(0)
      return
    }
    const tick = () => setRemaining(Math.max(0, targetTimestamp - Date.now()))
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [targetTimestamp])

  const totalSeconds = Math.floor(remaining / 1000)
  const days = Math.floor(totalSeconds / 86400)
  const hours = Math.floor((totalSeconds % 86400) / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  return { remaining, days, hours, minutes, seconds, isOver: remaining <= 0 }
}
