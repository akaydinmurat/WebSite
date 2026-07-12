import Link from "next/link";

import { navigationConfig } from "@/config/navigation";
import { siteConfig } from "@/config/site";

import { DesktopNavigation } from "./desktop-navigation";
import { MobileNavigation } from "./mobile-navigation";
import { SiteBrandLink } from "./site-brand-link";

export function SiteHeader() {
  return (
    <>
      <a className="skip-link" href="#main-content">
        Ana içeriğe geç
      </a>
      <header
        className="fixed top-0 z-[var(--z-header)] w-full border-b border-white/15 bg-[rgba(14,18,19,.78)] text-[var(--color-paper)] backdrop-blur-xl"
        data-cursor-theme="dark"
        data-testid="site-header"
      >
        <div className="site-shell flex min-h-[4.75rem] items-center justify-between gap-5">
          <SiteBrandLink />

          <div className="ml-auto flex items-center gap-4 xl:gap-6">
            <DesktopNavigation items={navigationConfig.primary} />
            <div className="hidden xl:block">
              <Link
                className="pill-button shrink-0 border-white/45 text-[var(--color-paper)] hover:bg-[var(--color-paper)] hover:text-[var(--color-night)]"
                href={navigationConfig.contactAction.href}
              >
                {navigationConfig.contactAction.label}
              </Link>
            </div>
            <MobileNavigation
              contactAction={navigationConfig.contactAction}
              items={navigationConfig.primary}
              siteName={siteConfig.name}
            />
          </div>
        </div>
      </header>
    </>
  );
}
