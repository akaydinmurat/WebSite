export function SectionDivider({ index, label }: { index: string; label: string }) {
  return (
    <div className="site-shell flex items-center gap-5 border-t border-[var(--color-border)] pt-4 text-[0.65rem] font-semibold tracking-[0.16em] text-[var(--color-muted)] uppercase">
      <span>{index}</span>
      <span className="h-px flex-1 bg-[var(--color-border)]" />
      <span>{label}</span>
    </div>
  );
}
