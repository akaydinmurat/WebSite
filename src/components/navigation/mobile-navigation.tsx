"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";

import type { NavigationItem } from "@/types";

import { isNavigationItemActive } from "./navigation-state";

const focusableSelector = [
  "a[href]",
  "button:not([disabled])",
  "[tabindex]:not([tabindex='-1'])",
].join(",");

interface MobileNavigationProps {
  contactAction: NavigationItem;
  items: readonly NavigationItem[];
  siteName: string;
}

export function MobileNavigation({ contactAction, items, siteName }: MobileNavigationProps) {
  const pathname = usePathname() ?? "/";
  const [isOpen, setIsOpen] = useState(false);
  const menuId = useId();
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const hasOpenedRef = useRef(false);

  useEffect(() => {
    if (!isOpen) {
      if (hasOpenedRef.current) {
        triggerRef.current?.focus();
        hasOpenedRef.current = false;
      }

      return;
    }

    hasOpenedRef.current = true;
    const body = document.body;
    const previousMenuState = body.getAttribute("data-menu-open");
    body.setAttribute("data-menu-open", "true");
    closeButtonRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        setIsOpen(false);
        return;
      }

      if (event.key !== "Tab") {
        return;
      }

      const dialog = dialogRef.current;
      const focusableElements = dialog
        ? Array.from(dialog.querySelectorAll<HTMLElement>(focusableSelector)).filter(
            (element) => !element.hasAttribute("disabled") && element.tabIndex !== -1,
          )
        : [];

      if (focusableElements.length === 0) {
        event.preventDefault();
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements.at(-1);
      const activeElement = document.activeElement;

      if (event.shiftKey && (activeElement === firstElement || !dialog?.contains(activeElement))) {
        event.preventDefault();
        lastElement?.focus();
      } else if (!event.shiftKey && activeElement === lastElement) {
        event.preventDefault();
        firstElement?.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);

      if (previousMenuState === null) {
        body.removeAttribute("data-menu-open");
      } else {
        body.setAttribute("data-menu-open", previousMenuState);
      }
    };
  }, [isOpen]);

  function closeMenu() {
    setIsOpen(false);
  }

  return (
    <div className="xl:hidden">
      <button
        ref={triggerRef}
        aria-controls={menuId}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        aria-label="Menüyü aç"
        className="group flex min-h-11 min-w-11 items-center justify-center text-[var(--color-paper)]"
        onClick={() => setIsOpen(true)}
        type="button"
      >
        <span aria-hidden="true" className="flex w-6 flex-col gap-1.5">
          <span className="h-px w-full bg-current transition-transform duration-[var(--duration-fast)] group-hover:translate-x-1 motion-reduce:transition-none" />
          <span className="h-px w-4 self-end bg-current transition-transform duration-[var(--duration-fast)] group-hover:-translate-x-1 motion-reduce:transition-none" />
        </span>
      </button>

      <div
        ref={dialogRef}
        aria-hidden={!isOpen}
        aria-label="Ana menü"
        aria-modal={isOpen ? "true" : undefined}
        className={`fixed inset-0 z-[var(--z-menu)] overflow-y-auto overscroll-contain bg-[var(--color-night)] text-[var(--color-paper)] transition-[opacity,visibility] duration-[var(--duration-medium)] ease-[var(--ease-out)] motion-reduce:transition-none ${
          isOpen ? "visible opacity-100" : "invisible opacity-0"
        }`}
        data-state={isOpen ? "open" : "closed"}
        id={menuId}
        inert={!isOpen}
        role="dialog"
      >
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute inset-0 transition-transform duration-[var(--duration-slow)] ease-[var(--ease-out)] motion-reduce:transition-none ${
            isOpen ? "translate-y-0" : "-translate-y-full"
          }`}
        >
          <span className="absolute top-0 right-[18%] h-full w-px bg-[var(--color-border-light)]" />
          <span className="absolute top-[32%] right-0 left-0 h-px bg-[var(--color-border-light)]" />
          <span className="absolute -right-24 bottom-0 size-72 rounded-full border border-[var(--color-border-light)] sm:size-[30rem]" />
        </div>

        <div className="site-shell relative flex min-h-full flex-col">
          <div className="flex min-h-[4.75rem] items-center justify-between border-b border-[var(--color-border-light)]">
            <Link
              aria-label={`${siteName} ana sayfa`}
              className="flex min-h-11 items-center font-serif text-[1.05rem] tracking-[-0.02em]"
              href="/"
              onClick={closeMenu}
            >
              {siteName}
            </Link>

            <button
              ref={closeButtonRef}
              aria-label="Menüyü kapat"
              className="group flex min-h-11 min-w-11 items-center justify-center"
              onClick={closeMenu}
              type="button"
            >
              <span aria-hidden="true" className="relative block size-6">
                <span className="absolute top-1/2 left-0 h-px w-full rotate-45 bg-current transition-transform duration-[var(--duration-fast)] group-hover:rotate-[135deg] motion-reduce:transition-none" />
                <span className="absolute top-1/2 left-0 h-px w-full -rotate-45 bg-current transition-transform duration-[var(--duration-fast)] group-hover:rotate-45 motion-reduce:transition-none" />
              </span>
            </button>
          </div>

          <div
            className={`flex flex-1 flex-col justify-center py-10 transition-[transform,opacity] duration-[var(--duration-slow)] ease-[var(--ease-out)] motion-reduce:transition-none sm:py-14 ${
              isOpen ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
            data-testid="mobile-menu-content"
          >
            <p className="eyebrow text-[var(--color-paper)]/60 before:bg-current">Navigasyon</p>
            <nav aria-label="Mobil navigasyon" className="mt-6 sm:mt-10">
              <ol className="divide-y divide-[var(--color-border-light)] border-y border-[var(--color-border-light)]">
                {items.map((item, index) => {
                  const isActive = isNavigationItemActive(pathname, item);

                  return (
                    <li key={item.id}>
                      <Link
                        aria-current={isActive ? "page" : undefined}
                        className="group grid min-h-16 grid-cols-[2.25rem_1fr_auto] items-center gap-3 py-3 sm:min-h-20 sm:grid-cols-[3rem_1fr_auto]"
                        data-active={isActive ? "true" : "false"}
                        href={item.href}
                        onClick={closeMenu}
                      >
                        <span
                          aria-hidden="true"
                          className="text-[0.62rem] tracking-[0.16em] text-[var(--color-paper)]/45"
                        >
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <span>
                          <span className="block font-serif text-[clamp(1.65rem,7vw,3.6rem)] leading-none tracking-[-0.035em] transition-colors duration-[var(--duration-fast)] group-hover:text-[var(--color-accent-warm)] group-focus-visible:text-[var(--color-accent-warm)] motion-reduce:transition-none">
                            {item.label}
                          </span>
                          {item.description ? (
                            <span className="mt-1 hidden text-[0.7rem] tracking-[0.04em] text-[var(--color-paper)]/55 sm:block">
                              {item.description}
                            </span>
                          ) : null}
                        </span>
                        <span
                          aria-hidden="true"
                          className={`text-xl transition-[transform,color] duration-[var(--duration-medium)] ease-[var(--ease-out)] group-hover:translate-x-1 group-hover:text-[var(--color-accent-warm)] motion-reduce:transition-none ${
                            isActive ? "text-[var(--color-accent-warm)]" : "text-current"
                          }`}
                        >
                          ↗
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ol>
            </nav>

            <div className="mt-8 flex flex-wrap items-center justify-between gap-5 sm:mt-10">
              <span className="text-[0.68rem] tracking-[0.14em] text-[var(--color-paper)]/55 uppercase">
                İç mimari · Görselleştirme
              </span>
              <Link
                className="pill-button border-[var(--color-border-light)] hover:bg-[var(--color-paper)] hover:text-[var(--color-night)]"
                href={contactAction.href}
                onClick={closeMenu}
              >
                {contactAction.label}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
