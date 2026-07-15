import type { ReactNode } from "react";

export function PageHero({
  eyebrow,
  title,
  description,
  aside,
  tone = "sky",
}: {
  eyebrow: string;
  title: string;
  description: string;
  aside?: ReactNode;
  tone?: "celadon" | "coral" | "sky" | "sun";
}) {
  return (
    <header className="luminous-page-hero" data-tone={tone}>
      <div className="luminous-page-hero-planes" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <div className="site-shell section-frame relative z-10 pt-40 pb-20 md:pt-52 md:pb-28">
        <div className="editorial-grid gap-y-10">
          <p className="eyebrow col-span-12 md:col-span-3">{eyebrow}</p>
          <div className="col-span-12 md:col-span-9 md:col-start-4">
            <h1 className="page-title max-w-[14ch]">{title}</h1>
            <div className="mt-10 grid gap-8 border-t border-[var(--color-border)] pt-6 md:grid-cols-2">
              <p className="body-large max-w-[34rem]">{description}</p>
              {aside ? <div className="md:justify-self-end">{aside}</div> : null}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
