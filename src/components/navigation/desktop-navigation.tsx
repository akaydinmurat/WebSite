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
      className="luminous-desktop-navigation hidden items-center xl:flex"
      data-testid="desktop-navigation"
    >
      <ul className="luminous-navigation-cluster">
        {items.map((item, index) => {
          const isActive = isNavigationItemActive(pathname, item, searchParams);

          return (
            <li key={item.id}>
              <Link
                aria-current={isActive ? "page" : undefined}
                className="luminous-navigation-link group relative flex items-center transition-colors duration-[var(--duration-fast)] ease-out motion-reduce:transition-none"
                data-active={isActive ? "true" : "false"}
                href={item.href}
              >
                <span className="luminous-navigation-index" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span>{item.label}</span>
                <span
                  aria-hidden="true"
                  className={`luminous-navigation-underline absolute h-px origin-left transition-transform duration-[var(--duration-medium)] ease-[var(--ease-out)] motion-reduce:transition-none ${
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
