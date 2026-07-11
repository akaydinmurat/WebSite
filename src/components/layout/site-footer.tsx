import Link from "next/link";

import { navigationConfig } from "@/config/navigation";
import { siteConfig } from "@/config/site";

export function SiteFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-[var(--color-border-light)] bg-[var(--color-night)] text-[var(--color-paper)]">
      <div className="site-shell">
        <div className="grid gap-14 py-[clamp(4.5rem,9vw,9rem)] md:grid-cols-12 md:gap-8">
          <div className="md:col-span-7 lg:col-span-8">
            <p className="eyebrow text-[var(--color-paper)]/55">Birlikte tasarlayalım</p>
            <p className="mt-7 max-w-4xl font-serif text-[clamp(2.5rem,5vw,6.4rem)] leading-[0.98] tracking-[-0.045em] text-balance">
              {siteConfig.positioningStatement}
            </p>
            <Link
              className="text-link mt-9 border-[var(--color-border-light)] text-[var(--color-paper)] sm:mt-12"
              href={navigationConfig.contactAction.href}
            >
              {navigationConfig.contactAction.label}
              <span aria-hidden="true">↗</span>
            </Link>
          </div>

          <div className="grid gap-10 sm:grid-cols-2 md:col-span-5 md:pl-6 lg:col-span-4">
            <nav aria-label="Alt bilgi navigasyonu">
              <h2 className="text-[0.66rem] font-semibold tracking-[0.16em] text-[var(--color-paper)]/50 uppercase">
                Sayfalar
              </h2>
              <ul className="mt-5">
                {navigationConfig.footer.map((item) => (
                  <li key={item.id}>
                    <Link
                      className="flex min-h-11 items-center text-sm text-[var(--color-paper)]/75 transition-colors duration-[var(--duration-fast)] hover:text-[var(--color-paper)] motion-reduce:transition-none"
                      href={item.href}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div>
              <h2 className="text-[0.66rem] font-semibold tracking-[0.16em] text-[var(--color-paper)]/50 uppercase">
                Stüdyo
              </h2>
              <p className="mt-6 text-sm leading-relaxed text-[var(--color-paper)]/75">
                {siteConfig.copy.footer.statement}
              </p>
              <p className="mt-5 text-sm text-[var(--color-paper)]/55">
                {siteConfig.contact.location}
              </p>
              <p className="mt-5 text-sm leading-relaxed text-[var(--color-paper)]/55">
                {siteConfig.contact.availabilityText}
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-5 border-t border-[var(--color-border-light)] py-6 text-[0.65rem] leading-relaxed tracking-[0.08em] text-[var(--color-paper)]/45 uppercase md:grid-cols-12">
          <p className="md:col-span-4">
            © {currentYear} {siteConfig.name}. Tüm hakları saklıdır.
          </p>
          <p className="max-w-3xl md:col-span-8 md:text-right">
            {siteConfig.copy.footer.contentNotice}
          </p>
        </div>
      </div>
    </footer>
  );
}
