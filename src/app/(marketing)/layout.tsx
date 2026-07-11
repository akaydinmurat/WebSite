import type { ReactNode } from "react";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/navigation";

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <SiteHeader />
      <div id="main-content" tabIndex={-1}>
        {children}
      </div>
      <SiteFooter />
    </>
  );
}
