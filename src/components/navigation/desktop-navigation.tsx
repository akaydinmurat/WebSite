"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense } from "react";

import type { NavigationItem } from "@/types";

import { isNavigationItemActive } from "./navigation-state";

interface DesktopNavigationProps {
  items: readonly NavigationItem[];
}

export function DesktopNavigation({ items }: DesktopNavigationProps) {
  const pathname = usePathname() ?? "/";

  return (
    <Suspense fallback={<DesktopNavigationList items={items} pathname={pathname} />}>
      <DesktopNavigationWithScene items={items} pathname={pathname} />
    </Suspense>
  );
}

interface DesktopNavigationWithSceneProps extends DesktopNavigationProps {
  pathname: string;
}

function DesktopNavigationWithScene({ items, pathname }: DesktopNavigationWithSceneProps) {
  const searchParams = useSearchParams();

  return <DesktopNavigationList items={items} pathname={pathname} searchParams={searchParams} />;
}

interface DesktopNavigationListProps extends DesktopNavigationWithSceneProps {
  searchParams?: Pick<URLSearchParams, "get">;
}

function DesktopNavigationList({ items, pathname, searchParams }: DesktopNavigationListProps) {
  return (
    <nav
      aria-label="Ana navigasyon"
      className="hidden items-center xl:flex"
      data-testid="desktop-navigation"
    >
      <ul className="flex items-center gap-1">
        {items.map((item) => {
          const isActive = isNavigationItemActive(pathname, item, searchParams);

          return (
            <li key={item.id}>
              <Link
                aria-current={isActive ? "page" : undefined}
                className="group relative flex min-h-11 items-center px-3 text-[0.68rem] font-semibold tracking-[0.14em] text-white/65 uppercase transition-colors duration-[var(--duration-fast)] ease-out hover:text-white focus-visible:text-white motion-reduce:transition-none"
                data-active={isActive ? "true" : "false"}
                href={item.href}
              >
                <span>{item.label}</span>
                <span
                  aria-hidden="true"
                  className={`absolute right-3 bottom-1.5 left-3 h-px origin-left bg-[var(--color-accent-warm)] transition-transform duration-[var(--duration-medium)] ease-[var(--ease-out)] motion-reduce:transition-none ${
                    isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                  }`}
                />
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
