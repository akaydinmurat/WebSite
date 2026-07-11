import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ComponentProps } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { SiteFooter } from "@/components/layout/site-footer";
import { isNavigationItemActive, SiteHeader } from "@/components/navigation";
import { primaryNavigation } from "@/config/navigation";

const { mockedUsePathname } = vi.hoisted(() => ({
  mockedUsePathname: vi.fn<() => string>(),
}));

vi.mock("next/navigation", () => ({
  usePathname: () => mockedUsePathname(),
}));

vi.mock("next/link", () => ({
  default: ({ children, href, onClick, ...props }: ComponentProps<"a">) => (
    <a
      href={typeof href === "string" ? href : undefined}
      onClick={(event) => {
        event.preventDefault();
        onClick?.(event);
      }}
      {...props}
    >
      {children}
    </a>
  ),
}));

describe("navigation active state", () => {
  it("matches exact routes without marking child routes active", () => {
    const homeItem = primaryNavigation[0];

    expect(isNavigationItemActive("/", homeItem)).toBe(true);
    expect(isNavigationItemActive("/projects", homeItem)).toBe(false);
  });

  it("matches prefix routes only on complete path segments", () => {
    const projectsItem = primaryNavigation[1];

    expect(isNavigationItemActive("/projects", projectsItem)).toBe(true);
    expect(isNavigationItemActive("/projects/demo-project/", projectsItem)).toBe(true);
    expect(isNavigationItemActive("/projects-archive", projectsItem)).toBe(false);
  });

  it("ignores trailing slashes, search parameters, and fragments", () => {
    const servicesItem = primaryNavigation[2];

    expect(isNavigationItemActive("/services/?view=all#overview", servicesItem)).toBe(true);
  });
});

describe("SiteHeader", () => {
  beforeEach(() => {
    mockedUsePathname.mockReturnValue("/projects/demo-project");
  });

  afterEach(() => {
    document.body.removeAttribute("data-menu-open");
  });

  it("renders the skip link and exposes the active desktop route", () => {
    render(<SiteHeader />);

    expect(screen.getByRole("link", { name: "Ana içeriğe geç" })).toHaveAttribute(
      "href",
      "#main-content",
    );

    const desktopNavigation = screen.getByTestId("desktop-navigation");
    expect(within(desktopNavigation).getByRole("link", { name: "Projeler" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(within(desktopNavigation).getByRole("link", { name: "Hizmetler" })).not.toHaveAttribute(
      "aria-current",
    );
  });

  it("opens the menu, locks scrolling, and moves focus into the dialog", async () => {
    const user = userEvent.setup();
    render(<SiteHeader />);

    const trigger = screen.getByRole("button", { name: "Menüyü aç" });
    await user.click(trigger);

    const dialog = screen.getByRole("dialog", { name: "Ana menü" });
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(dialog).toHaveAttribute("data-state", "open");
    expect(document.body).toHaveAttribute("data-menu-open", "true");
    expect(within(dialog).getByRole("button", { name: "Menüyü kapat" })).toHaveFocus();
    expect(within(dialog).getByRole("link", { name: /Projeler/i })).toHaveAttribute(
      "aria-current",
      "page",
    );
  });

  it("traps forward and backward tab navigation inside the menu", async () => {
    const user = userEvent.setup();
    render(<SiteHeader />);

    await user.click(screen.getByRole("button", { name: "Menüyü aç" }));
    const dialog = screen.getByRole("dialog", { name: "Ana menü" });
    const closeButton = within(dialog).getByRole("button", { name: "Menüyü kapat" });
    const homeLink = within(dialog).getByRole("link", {
      name: "Murat Akaydın Studio ana sayfa",
    });
    const contactLink = within(dialog).getByRole("link", { name: "Bir proje başlat" });

    contactLink.focus();
    await user.tab();
    expect(homeLink).toHaveFocus();

    await user.tab({ shift: true });
    expect(contactLink).toHaveFocus();
    expect(closeButton).not.toHaveFocus();
  });

  it("closes with Escape, restores scrolling, and returns focus to the trigger", async () => {
    const user = userEvent.setup();
    render(<SiteHeader />);

    const trigger = screen.getByRole("button", { name: "Menüyü aç" });
    await user.click(trigger);
    await user.keyboard("{Escape}");

    const closedDialog = screen.getByRole("dialog", { hidden: true });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(closedDialog).toHaveAttribute("aria-hidden", "true");
    expect(document.body).not.toHaveAttribute("data-menu-open");
    expect(trigger).toHaveFocus();
  });

  it("closes after selecting a route and keeps reduced-motion fallbacks", async () => {
    const user = userEvent.setup();
    render(<SiteHeader />);

    const trigger = screen.getByRole("button", { name: "Menüyü aç" });
    await user.click(trigger);
    const dialog = screen.getByRole("dialog", { name: "Ana menü" });

    expect(dialog).toHaveClass("motion-reduce:transition-none");
    expect(screen.getByTestId("mobile-menu-content")).toHaveClass("motion-reduce:transition-none");

    await user.click(within(dialog).getByRole("link", { name: /Hizmetler/i }));
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(trigger).toHaveFocus();
  });
});

describe("SiteFooter", () => {
  it("renders Turkish studio content and configured navigation", () => {
    render(<SiteFooter />);

    const footerNavigation = screen.getByRole("navigation", {
      name: "Alt bilgi navigasyonu",
    });

    expect(within(footerNavigation).getByRole("link", { name: "Ana Sayfa" })).toHaveAttribute(
      "href",
      "/",
    );
    expect(screen.getByText(/Tüm hakları saklıdır/i)).toBeInTheDocument();
    expect(screen.getByText(/İç mimari ve 3D görselleştirme/i)).toBeInTheDocument();
  });
});
