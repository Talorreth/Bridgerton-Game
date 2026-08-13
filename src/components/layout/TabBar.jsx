import { motion } from 'framer-motion'
import { Crown, Gamepad2, ScrollText, Search } from 'lucide-react'

const TABS = [
  { id: 'accueil', label: 'Accueil', Icon: Crown },
  { id: 'jeux', label: 'Épreuves', Icon: Gamepad2 },
  { id: 'planning', label: 'Séjour', Icon: ScrollText },
  { id: 'enquete', label: 'Enquête', Icon: Search },
]

export default function TabBar({ active, onChange, badges = {} }) {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 mx-auto max-w-md border-t border-gold/30 bg-cream/95 backdrop-blur-md"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="gilded-rule" />
      <ul className="flex items-stretch justify-between px-2">
        {TABS.map(({ id, label, Icon }) => {
          const isActive = active === id
          const badgeCount = badges[id]
          return (
            <li key={id} className="flex-1">
              <button
                onClick={() => onChange(id)}
                className="relative flex w-full flex-col items-center gap-1 py-2.5 focus:outline-none"
              >
                {isActive && (
                  <motion.div
                    layoutId="tab-highlight"
                    className="absolute inset-x-3 -top-[1px] h-[2px] bg-gold"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <div className="relative">
                  <Icon
                    size={20}
                    strokeWidth={1.75}
                    className={isActive ? 'text-gold-dark' : 'text-royal-blue-dark/70'}
                  />
                  {!!badgeCount && (
                    <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-rose-dark text-[10px] font-body font-semibold text-ink">
                      {badgeCount}
                    </span>
                  )}
                </div>
                <span
                  className={`font-display text-[11px] tracking-wide ${
                    isActive ? 'text-ink font-semibold' : 'text-ink/50'
                  }`}
                >
                  {label}
                </span>
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
