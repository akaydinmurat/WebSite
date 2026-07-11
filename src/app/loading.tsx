export default function Loading() {
  return (
    <div
      className="site-shell flex min-h-[70svh] items-center justify-center"
      role="status"
      aria-live="polite"
    >
      <div className="flex items-center gap-4 text-[0.66rem] font-semibold tracking-[0.17em] text-[var(--color-muted)] uppercase">
        <span className="h-px w-12 animate-pulse bg-current" /> Mekân hazırlanıyor
      </div>
    </div>
  );
}
