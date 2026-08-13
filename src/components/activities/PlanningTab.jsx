import Header from '../layout/Header'
import { ACTIVITIES } from '../../data/activities'
import ActivityCard from './ActivityCard'

export default function PlanningTab({ unlockedActivities }) {
  return (
    <div className="pb-28">
      <Header
        eyebrow="Votre planning"
        title="Le programme du séjour"
        subtitle="Chaque épreuve remportée dévoile un moment de votre séjour au Château."
      />
      <ul className="mx-6 flex flex-col gap-4">
        {ACTIVITIES.map((activity, index) => (
          <ActivityCard
            key={activity.id}
            activity={activity}
            index={index}
            unlocked={unlockedActivities.includes(activity.id)}
          />
        ))}
      </ul>
    </div>
  )
}
