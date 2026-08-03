interface LogoMarkProps {
  size?: number;
  className?: string;
}

/**
 * Abstract geometric mark for QueryFlow — three offset arcs converging
 * into a single node, meant to suggest "many queries, one answer"
 * rather than a literal database cylinder.
 */
export function LogoMark({ size = 20, className = "" }: LogoMarkProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="12" cy="12" r="2.5" fill="currentColor" />
      <path
        d="M12 9.5V4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        opacity="0.9"
      />
      <path
        d="M14.2 10.8L18.5 6.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        opacity="0.65"
      />
      <path
        d="M9.8 10.8L5.5 6.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        opacity="0.65"
      />
      <path
        d="M14.2 13.2L18.5 17.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        opacity="0.4"
      />
      <path
        d="M9.8 13.2L5.5 17.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        opacity="0.4"
      />
    </svg>
  );
}
