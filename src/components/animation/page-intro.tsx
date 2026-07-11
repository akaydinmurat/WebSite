export function PageIntro() {
  return (
    <div
      className="intro-overlay pointer-events-none fixed inset-0 z-[var(--z-intro)] flex items-center justify-center bg-[var(--color-night)] text-[var(--color-paper)]"
      aria-hidden="true"
    >
      <div className="flex items-center gap-4 text-[0.66rem] font-semibold tracking-[0.2em] uppercase">
        <span className="h-px w-12 bg-current opacity-50" />
        Murat Akaydın Studio
      </div>
    </div>
  );
}
