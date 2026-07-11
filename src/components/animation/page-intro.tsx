export function PageIntro() {
  return (
    <div
      className="intro-overlay pointer-events-none fixed inset-0 z-[var(--z-intro)] overflow-hidden bg-[var(--color-night)] text-[var(--color-paper)]"
      aria-hidden="true"
    >
      <span className="intro-panel intro-panel-left" />
      <span className="intro-panel intro-panel-right" />
      <div className="intro-signature absolute inset-0 grid place-items-center">
        <div className="text-center">
          <span className="intro-monogram mx-auto mb-5 grid size-16 place-items-center border border-white/35 font-serif text-2xl italic">
            GU
          </span>
          <span className="block text-[0.62rem] font-semibold tracking-[0.24em] uppercase">
            Göknur Uygur Akaydın
          </span>
          <span className="mt-3 block text-[0.55rem] tracking-[0.2em] text-white/48 uppercase">
            Mimarlık · İç Mekân
          </span>
        </div>
      </div>
    </div>
  );
}
