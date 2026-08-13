import { Hourglass } from 'lucide-react'
import { useCountdown } from '../../hooks/useCountdown'

function pad(n) {
  return String(n).padStart(2, '0')
}

export default function CountdownBadge({ targetTimestamp, onElapsed }) {
  const { days, hours, minutes, seconds, isOver } = useCountdown(targetTimestamp)

  if (isOver) {
    if (onElapsed) onElapsed()
    return null
  }

  return (
    <div className="inline-flex items-center gap-2 rounded-full bg-royal-blue/25 px-3 py-1.5 text-ink">
      <Hourglass size={14} className="text-royal-blue-dark" />
      <span className="font-body text-sm tabular-nums tracking-wide">
        {days > 0 && `${days}j `}
        {pad(hours)}:{pad(minutes)}:{pad(seconds)}
      </span>
    </div>
  )
}
