export function SectionDivider({ index, label }: { index: string; label: string }) {
  return (
    <div className="chapter-divider" data-cursor-theme="dark">
      <div className="site-shell flex min-h-16 items-center gap-5 text-[0.62rem] font-semibold tracking-[0.18em] uppercase">
        <span className="text-[var(--color-accent-warm)]">{index}</span>
        <span className="chapter-divider-line" />
        <span className="text-white/68">{label}</span>
      </div>
    </div>
  );
}
