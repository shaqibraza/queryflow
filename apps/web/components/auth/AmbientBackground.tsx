export function AmbientBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 grid-pattern" />
      <div className="animate-drift-1 absolute -left-24 -top-24 h-[420px] w-[420px] rounded-full bg-accent/25 blur-[120px]" />
      <div className="animate-drift-2 absolute bottom-[-140px] right-[-100px] h-[460px] w-[460px] rounded-full bg-[#4F46E5]/20 blur-[130px]" />
      <div className="animate-pulse-glow absolute left-1/3 top-1/2 h-[280px] w-[280px] -translate-y-1/2 rounded-full bg-accent-soft/10 blur-[100px]" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />
    </div>
  );
}
