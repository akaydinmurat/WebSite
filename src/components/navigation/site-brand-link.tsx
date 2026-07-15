"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { siteConfig } from "@/config/site";

export function SiteBrandLink() {
  const pathname = usePathname() ?? "/";
  const isHomeExperience = pathname === "/";

  return (
    <Link
      aria-label={`${siteConfig.name} ana sayfa`}
      className="flex min-h-11 shrink-0 items-center gap-2.5 text-current"
      href="/"
    >
      <span className="font-serif text-[1.08rem] leading-none tracking-[-0.025em]">
        {siteConfig.shortName}
      </span>
      <span aria-hidden="true" className="hidden h-4 w-px bg-current/25 sm:block" />
      <span className="hidden text-[0.58rem] font-semibold tracking-[0.18em] text-current/65 uppercase sm:block">
        {isHomeExperience ? "Mekânsal Tasarım" : "Yüksek Mimar"}
      </span>
    </Link>
  );
}
