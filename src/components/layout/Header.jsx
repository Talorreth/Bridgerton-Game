import { FloralCorner } from '../ui/illustrations'

export default function Header({ eyebrow, title, subtitle }) {
  return (
    <header className="relative px-6 pb-4 pt-8 text-center">
      <FloralCorner className="pointer-events-none absolute left-2 top-2 h-9 w-9 text-gold/50 sm:h-11 sm:w-11" />
      <FloralCorner
        flip
        className="pointer-events-none absolute right-2 top-2 h-9 w-9 text-gold/50 sm:h-11 sm:w-11"
      />
      {eyebrow && (
        <p className="mb-1 font-body text-xs uppercase tracking-[0.35em] text-gold-dark">
          {eyebrow}
        </p>
      )}
      <h1 className="font-display text-2xl font-semibold leading-snug text-ink">{title}</h1>
      <div className="mx-auto mt-3 h-[2px] w-16 gilded-rule-thick" />
      {subtitle && (
        <p className="mx-auto mt-3 max-w-sm font-body text-base italic text-ink/70">{subtitle}</p>
      )}
    </header>
  )
}
