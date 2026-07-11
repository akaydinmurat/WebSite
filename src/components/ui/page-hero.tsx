import type { ReactNode } from "react";

export function PageHero({
  eyebrow,
  title,
  description,
  aside,
}: {
  eyebrow: string;
  title: string;
  description: string;
  aside?: ReactNode;
}) {
  return (
    <header className="site-shell section-frame pt-40 pb-20 md:pt-52 md:pb-28">
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
    </header>
  );
}
