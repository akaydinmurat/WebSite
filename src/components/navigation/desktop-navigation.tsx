"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import type { NavigationItem } from "@/types";

import { isNavigationItemActive } from "./navigation-state";

interface DesktopNavigationProps {
  items: readonly NavigationItem[];
}

export function DesktopNavigation({ items }: DesktopNavigationProps) {
  const pathname = usePathname() ?? "/";

  return (
    <nav
      aria-label="Ana navigasyon"
      className="hidden items-center xl:flex"
      data-testid="desktop-navigation"
    >
      <ul className="flex items-center gap-1">
        {items.map((item) => {
          const isActive = isNavigationItemActive(pathname, item);

          return (
            <li key={item.id}>
              <Link
                aria-current={isActive ? "page" : undefined}
                className="group relative flex min-h-11 items-center px-3 text-[0.68rem] font-semibold tracking-[0.14em] text-[var(--color-ink-soft)] uppercase transition-colors duration-[var(--duration-fast)] ease-out hover:text-[var(--color-ink)] focus-visible:text-[var(--color-ink)] motion-reduce:transition-none"
                data-active={isActive ? "true" : "false"}
                href={item.href}
              >
                <span>{item.label}</span>
                <span
                  aria-hidden="true"
                  className={`absolute right-3 bottom-1.5 left-3 h-px origin-left bg-[var(--color-accent)] transition-transform duration-[var(--duration-medium)] ease-[var(--ease-out)] motion-reduce:transition-none ${
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
