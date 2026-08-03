export function Logo({ className }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2.5 ${className ?? ""}`}>
      <div className="relative flex h-8 w-8 items-center justify-center rounded-[9px] bg-gradient-to-br from-accent to-accent-deep shadow-[0_0_20px_rgba(99,102,241,0.45)]">
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 3C7.02944 3 3 4.79086 3 7V17C3 19.2091 7.02944 21 12 21C16.9706 21 21 19.2091 21 17V7C21 4.79086 16.9706 3 12 3Z"
            stroke="#FAFAFA"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <path
            d="M3 7C3 9.20914 7.02944 11 12 11C16.9706 11 21 9.20914 21 7"
            stroke="#FAFAFA"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <path
            d="M3 12C3 14.2091 7.02944 16 12 16C16.9706 16 21 14.2091 21 12"
            stroke="#FAFAFA"
            strokeOpacity="0.7"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      </div>
      <span className="text-[15px] font-semibold tracking-tight text-foreground">QueryFlow</span>
    </div>
  );
}
