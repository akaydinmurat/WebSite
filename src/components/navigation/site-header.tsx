import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

import { SocialIconLinks } from "@/components/ui/social-icon-links";
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
        className="luminous-site-header fixed top-0 z-[var(--z-header)] w-full border-b backdrop-blur-xl"
        data-cursor-theme="light"
        data-testid="site-header"
      >
        <div className="site-shell luminous-header-shell">
          <SiteBrandLink />

          <DesktopNavigation items={navigationConfig.primary} />

          <div className="luminous-header-actions">
            <SocialIconLinks className="luminous-header-socials" label="Sosyal medya profilleri" />
            <div className="hidden xl:block">
              <Link
                className="luminous-dream-action"
                href={navigationConfig.contactAction.href}
                data-cursor-kind="action"
                data-cursor-label="İlk çizgiyi atalım"
              >
                <span className="luminous-dream-action-index" aria-hidden="true">
                  07
                </span>
                <span className="luminous-dream-action-copy">
                  <small>Yeni proje</small>
                  <strong>{navigationConfig.contactAction.label}</strong>
                </span>
                <ArrowUpRight aria-hidden="true" size={17} strokeWidth={1.8} />
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
