import type { ReactNode } from "react";

import { SiteJsonLd } from "@/components/seo";
import { siteMetadata } from "@/lib/seo";

import "./globals.css";

export const metadata = siteMetadata;

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="tr">
      <body>
        <SiteJsonLd />
        {children}
      </body>
    </html>
  );
}
