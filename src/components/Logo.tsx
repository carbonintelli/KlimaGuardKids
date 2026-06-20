interface LogoProps {
  size?: number;
  showText?: boolean;
  className?: string;
}

export function Logo({ size = 40, showText = true, className = "" }: LogoProps) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
        className="shrink-0 drop-shadow-sm"
      >
        <defs>
          <linearGradient id="kg-shield" x1="8" y1="4" x2="56" y2="60" gradientUnits="userSpaceOnUse">
            <stop stopColor="#0ea5e9" />
            <stop offset="0.5" stopColor="#38bdf8" />
            <stop offset="1" stopColor="#4ade80" />
          </linearGradient>
          <linearGradient id="kg-sun" x1="20" y1="16" x2="44" y2="40" gradientUnits="userSpaceOnUse">
            <stop stopColor="#fbbf24" />
            <stop offset="1" stopColor="#f97316" />
          </linearGradient>
          <filter id="kg-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <path
          d="M32 4L54 14v18c0 14.4-9.8 24.8-22 28C19.8 56.8 10 46.4 10 32V14L32 4z"
          fill="url(#kg-shield)"
          stroke="#0284c7"
          strokeWidth="1.5"
        />
        <circle cx="32" cy="22" r="10" fill="url(#kg-sun)" filter="url(#kg-glow)" opacity="0.95" />
        <path
          d="M32 14v4M32 26v4M24 22h4M36 22h4M26.3 16.3l2.8 2.8M34.9 24.9l2.8 2.8M26.3 27.7l2.8-2.8M34.9 19.1l2.8-2.8"
          stroke="#fff"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M22 38c2 3 6 5 10 5s8-2 10-5"
          stroke="#fff"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
        <circle cx="26" cy="36" r="2" fill="#fff" />
        <circle cx="38" cy="36" r="2" fill="#fff" />
        <path
          d="M28 42c1.5 1 3 1.5 4 1.5s2.5-.5 4-1.5"
          stroke="#fff"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M18 48c4 2 8 3 14 3s10-1 14-3"
          stroke="#4ade80"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
          opacity="0.8"
        />
      </svg>
      {showText && (
        <span className="text-lg font-extrabold tracking-tight">
          <span className="text-ocean">Klima</span>
          <span className="text-leaf">Guard</span>
          <span className="text-ink"> Kids</span>
        </span>
      )}
    </span>
  );
}
