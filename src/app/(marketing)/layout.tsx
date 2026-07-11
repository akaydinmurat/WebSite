import type { ReactNode } from "react";

import { ScrollProgress } from "@/components/animation/scroll-progress";
import { SmoothScroll } from "@/components/animation/smooth-scroll";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/navigation";
import { CustomCursor } from "@/components/ui/custom-cursor";

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <ScrollProgress />
      <CustomCursor />
      <SmoothScroll>
        <SiteHeader />
        <main id="main-content" tabIndex={-1}>
          {children}
        </main>
        <SiteFooter />
      </SmoothScroll>
    </>
  );
}
