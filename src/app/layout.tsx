import type { ReactNode } from "react";

import { SmoothScroll } from "@/components/animation/smooth-scroll";
import { ScrollProgress } from "@/components/animation/scroll-progress";
import { SiteJsonLd } from "@/components/seo";
import { CustomCursor } from "@/components/ui/custom-cursor";
import { siteMetadata } from "@/lib/seo";

import "./globals.css";

export const metadata = siteMetadata;

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="tr">
      <body>
        <SiteJsonLd />
        <ScrollProgress />
        <CustomCursor />
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
