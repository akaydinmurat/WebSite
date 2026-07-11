import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

import { FadeIn } from "@/components/animation/fade-in";
import { siteConfig } from "@/config/site";

export function PhilosophySection() {
  const copy = siteConfig.copy.philosophy;

  return (
    <section className="section-space relative overflow-hidden bg-[var(--color-night)] text-[var(--color-paper)]">
      <div className="pointer-events-none absolute top-[-16rem] right-[-8rem] size-[42rem] rounded-full bg-[radial-gradient(circle,rgba(201,156,114,.24),transparent_68%)]" />
      <div className="site-shell relative">
        <div className="editorial-grid gap-y-12">
          <p className="eyebrow col-span-12 text-white/60 md:col-span-3">{copy.eyebrow}</p>
          <div className="col-span-12 md:col-span-9 md:col-start-4">
            <FadeIn>
              <h2 className="section-title max-w-[14ch]">{copy.title}</h2>
            </FadeIn>
            <div className="mt-16 grid gap-10 border-t border-white/20 pt-6 md:grid-cols-2 md:gap-20">
              <p className="body-large text-white/72">{copy.description}</p>
              <div className="space-y-10">
                <blockquote className="font-serif text-[clamp(1.5rem,2.5vw,2.8rem)] leading-[1.06] tracking-[-0.03em] text-white/92">
                  “Işık bir yüzeye değdiğinde, plan atmosfer kazanmaya başlar.”
                </blockquote>
                <Link href="/about" className="text-link">
                  {copy.actionLabel} <ArrowUpRight aria-hidden="true" size={15} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
