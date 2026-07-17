/* Minimal inline icon set. Directional icons mirror under RTL via
   the rtl:-scale-x-100 utility applied at the call site. */

export const IconChevron = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className={className}>
    <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const IconStar = ({ className = "w-3.5 h-3.5" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.9 6.1 20.5l1.2-6.5L2.5 9.4l6.6-.9L12 2.5Z" />
  </svg>
);

/* Twin laurel branches, an allys.mu style trust mark */
export const Laurel = ({ className = "w-9 h-9" }: { className?: string }) => (
  <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.4" className={className} strokeLinecap="round">
    <path d="M32 8v48" opacity="0.35" />
    {[16, 24, 32, 40].map((y) => (
      <g key={y}>
        <path d={`M24 ${y}c-6 1-9 5-9 9 5 0 9-3 9-9Z`} />
        <path d={`M40 ${y}c6 1 9 5 9 9-5 0-9-3-9-9Z`} />
      </g>
    ))}
    <path d="M20 54c4 3 8 4 12 4s8-1 12-4" opacity="0.6" />
  </svg>
);

export const IconSearch = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className={className}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.8-3.8" strokeLinecap="round" />
  </svg>
);

export const IconSpark = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 2c.6 5.4 4.6 9.4 10 10-5.4.6-9.4 4.6-10 10-.6-5.4-4.6-9.4-10-10 5.4-.6 9.4-4.6 10-10Z" />
  </svg>
);

export const IconArrow = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className={className}>
    <path d="M4 12h16m0 0-6-6m6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const IconCheck = ({ className = "w-3 h-3" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" className={className}>
    <path d="m5 13 4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const IconPin = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className={className}>
    <path d="M12 17v5M7 4h10l-1.2 6.2 2.7 3.3H5.5l2.7-3.3L7 4Z" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const IconGrip = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <circle cx="9" cy="6" r="1.4" />
    <circle cx="15" cy="6" r="1.4" />
    <circle cx="9" cy="12" r="1.4" />
    <circle cx="15" cy="12" r="1.4" />
    <circle cx="9" cy="18" r="1.4" />
    <circle cx="15" cy="18" r="1.4" />
  </svg>
);
