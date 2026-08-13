import { motion } from 'framer-motion'
import { Lock } from 'lucide-react'
import { ACTIVITY_ICONS } from '../ui/activityIcons'

export default function ActivityCard({ activity, unlocked, index }) {
  const Icon = ACTIVITY_ICONS[activity.icon]

  return (
    <motion.li
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1], delay: index * 0.06 }}
      className={`medallion-card relative flex gap-4 overflow-hidden rounded-2xl p-5 shadow-regency ${
        unlocked ? '' : 'opacity-55'
      }`}
    >
      {!unlocked && (
        <img
          src="/lady.png"
          alt=""
          aria-hidden="true"
          draggable={false}
          className="pointer-events-none absolute -right-4 -top-4 h-24 w-24 object-contain opacity-[0.07]"
        />
      )}
      <div
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${
          unlocked ? 'wax-seal' : 'bg-royal-blue/25'
        }`}
      >
        {unlocked ? (
          Icon && <Icon size={20} className="text-cream" strokeWidth={1.5} />
        ) : (
          <Lock size={16} className="text-ink/40" />
        )}
      </div>

      <div className="min-w-0">
        <p className="font-body text-[11px] uppercase tracking-[0.2em] text-royal-blue-dark">
          Activité {index + 1}
        </p>
        <h3 className="mt-0.5 font-display text-[15px] font-semibold leading-snug text-ink">
          {unlocked ? activity.title : '??? — épreuve non résolue'}
        </h3>
        {unlocked && (
          <>
            <p className="mt-1 font-body text-xs font-semibold text-gold-dark">{activity.place}</p>
            <p className="mt-1.5 font-body text-sm leading-snug text-ink/70">
              {activity.description}
            </p>
          </>
        )}
        {!unlocked && (
          <p className="mt-1.5 font-body text-sm italic text-ink/45">
            Réussissez l'épreuve correspondante pour révéler ce moment de votre séjour.
          </p>
        )}
      </div>
    </motion.li>
  )
}
