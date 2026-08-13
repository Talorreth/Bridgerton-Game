import { useId } from 'react'

// Illustrations décoratives façon Régence : silhouettes "cameo" (portraits
// papier découpé, tels qu'on les faisait à l'époque de Bridgerton), flourish
// floral et attributs de Lady Whistledown. Toutes en `currentColor` / classes
// Tailwind pour s'intégrer à la palette existante, et purement décoratives
// (aria-hidden) — elles ne portent aucune logique.

export function FloralCorner({ className = '', flip = false }) {
  return (
    <svg
      viewBox="0 0 80 80"
      className={className}
      style={flip ? { transform: 'scaleX(-1)' } : undefined}
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M4 4c18 0 10 18 24 20 14 2 8-14 22-12 10 1.3 7 12 16 11"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <path
        d="M12 10c6 3 4 10 11 12"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <circle cx="49" cy="13" r="2.4" fill="currentColor" />
      <path
        d="M27 22c2 4 6 4 7 9"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function FeatherSeal({ className = '' }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      <path
        d="M86 8C70 14 52 26 40 44 30 58 22 74 14 90"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <g stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
        <path d="M78 16c-4 2-7 6-8 10" />
        <path d="M68 26c-4 2-7 6-8 10" />
        <path d="M58 38c-4 2-7 6-8 10" />
        <path d="M48 50c-4 2-7 6-8 10" />
        <path d="M38 62c-4 2-7 6-8 10" />
      </g>
      <circle cx="76" cy="78" r="18" fill="currentColor" opacity="0.9" />
      <path
        d="M76 68c2.5 3 2.5 6 0 9 2.5 2 2.5 5 0 8"
        fill="none"
        stroke="#FAFAFA"
        strokeWidth="1.6"
        strokeLinecap="round"
        opacity="0.75"
      />
    </svg>
  )
}

// Portrait "cameo" style silhouette Régence, encadré d'un médaillon doré.
function Cameo({ children, className, ringColor = '#D4AF37' }) {
  const clipId = useId()
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      <circle cx="50" cy="50" r="48" fill="#FAFAFA" stroke={ringColor} strokeWidth="2.5" />
      <circle cx="50" cy="50" r="42" fill="none" stroke={ringColor} strokeWidth="1" opacity="0.55" />
      <g clipPath={`url(#${clipId})`}>{children}</g>
      <defs>
        <clipPath id={clipId}>
          <circle cx="50" cy="50" r="42" />
        </clipPath>
      </defs>
    </svg>
  )
}

export function LadyCameo({ className = '', figureColor = '#3A3A3C' }) {
  return (
    <Cameo className={className}>
      <path
        transform="translate(14 -2) scale(0.72)"
        d="M42 6c14-2 26 6 28 18 1 5 5 8 9 13 3 4-1 6-3 10-1 3 2 5 0 8-1 3-5 3-6 6-1 4-5 6-9 10-4 4-8 6-10 10l-3 19c14 8 28 12 40 24v16H6v-40c0-10 5-18 11-25 4-5 2-13 4-21-6-8-9-18-4-28C20 15 30 9 42 6Z"
        fill={figureColor}
      />
    </Cameo>
  )
}

export function GentlemanCameo({ className = '', figureColor = '#7FA6B9' }) {
  return (
    <Cameo className={className}>
      <path
        transform="translate(14 -2) scale(0.72)"
        d="M40 8c12-2 24 3 28 13 2 5 6 8 10 14 3 4-1 6-3 10-1 3 2 5 0 8-1 3-5 3-6 6-2 4-6 6-10 9 4 3 10 5 14 8-4 2-10 0-14-2-4-2-6 1-8 5l-2 17c14 6 28 10 42 20v20H6v-38c0-10 4-18 10-24-4-10-4-22 0-32 5-10 15-16 24-16Z"
        fill={figureColor}
      />
    </Cameo>
  )
}

// Silhouette du château façon Val de Loire — motif central de l'accueil.
export function ChateauSilhouette({ className = '' }) {
  return (
    <svg viewBox="0 0 220 140" className={className} aria-hidden="true">
      {/* ligne de sol */}
      <rect x="8" y="120" width="204" height="2.5" fill="currentColor" opacity="0.25" />

      {/* haies flanquantes */}
      <ellipse cx="17" cy="114" rx="11" ry="9" fill="currentColor" opacity="0.3" />
      <ellipse cx="203" cy="114" rx="11" ry="9" fill="currentColor" opacity="0.3" />

      {/* tour gauche */}
      <rect x="24" y="58" width="26" height="62" fill="currentColor" />
      <polygon points="37,32 20,58 54,58" fill="currentColor" />
      <rect x="33" y="72" width="7" height="11" fill="#FAFAFA" opacity="0.9" />
      <rect x="33" y="93" width="7" height="11" fill="#FAFAFA" opacity="0.9" />

      {/* tour droite */}
      <rect x="170" y="58" width="26" height="62" fill="currentColor" />
      <polygon points="183,32 166,58 200,58" fill="currentColor" />
      <rect x="180" y="72" width="7" height="11" fill="#FAFAFA" opacity="0.9" />
      <rect x="180" y="93" width="7" height="11" fill="#FAFAFA" opacity="0.9" />

      {/* corps principal, toit à faible pente */}
      <rect x="50" y="66" width="120" height="54" fill="currentColor" />
      <polygon points="110,44 46,66 174,66" fill="currentColor" />

      {/* oeil-de-boeuf au fronton */}
      <circle cx="110" cy="56" r="4.5" fill="#FAFAFA" opacity="0.9" />
      <circle cx="110" cy="56" r="4.5" fill="none" stroke="#D4AF37" strokeWidth="1" />

      {/* rangée de fenêtres */}
      <rect x="64" y="80" width="9" height="13" fill="#FAFAFA" opacity="0.9" />
      <rect x="89" y="80" width="9" height="13" fill="#FAFAFA" opacity="0.9" />
      <rect x="122" y="80" width="9" height="13" fill="#FAFAFA" opacity="0.9" />
      <rect x="147" y="80" width="9" height="13" fill="#FAFAFA" opacity="0.9" />

      {/* porte principale en arche */}
      <path d="M103 120v-19a7 7 0 0 1 14 0v19Z" fill="#FAFAFA" opacity="0.9" />

      {/* girouette dorée */}
      <line x1="110" y1="44" x2="110" y2="34" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="110" cy="32" r="2.2" fill="#D4AF37" />
    </svg>
  )
}
