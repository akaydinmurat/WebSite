import { ArrowUpRight } from "lucide-react";

import { MagneticLink } from "@/components/animation/magnetic-link";
import { siteConfig } from "@/config/site";

export function ContactCta() {
  const copy = siteConfig.copy.contact;

  return (
    <section className="relative flex min-h-[82svh] items-end overflow-hidden bg-[var(--color-accent)] py-12 text-[var(--color-paper)] md:py-20">
      <div className="pointer-events-none absolute -top-48 -right-40 size-[44rem] rounded-full border border-white/20" />
      <div className="pointer-events-none absolute top-24 right-24 size-44 rounded-full bg-white/8 blur-2xl" />
      <div className="site-shell relative">
        <p className="eyebrow mb-10 text-white/68">{copy.eyebrow}</p>
        <h2 className="max-w-[12ch] font-serif text-[clamp(3.2rem,8vw,9rem)] leading-[0.9] font-normal tracking-[-0.055em]">
          {copy.title}
        </h2>
        <div className="mt-12 flex flex-col gap-8 border-t border-white/30 pt-6 md:flex-row md:items-end md:justify-between">
          <p className="max-w-xl text-lg text-white/76">{copy.description}</p>
          <MagneticLink
            href="/contact"
            className="grid size-28 shrink-0 place-items-center rounded-full border border-white/55 transition-colors hover:bg-white hover:text-[var(--color-accent)] md:size-36"
          >
            <span className="flex max-w-20 items-center gap-2 text-center text-[0.68rem] font-semibold tracking-[0.11em] uppercase">
              {copy.actionLabel} <ArrowUpRight aria-hidden="true" size={17} />
            </span>
          </MagneticLink>
        </div>
      </div>
    </section>
  );
}
