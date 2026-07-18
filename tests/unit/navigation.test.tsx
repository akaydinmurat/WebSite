import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ComponentProps } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { SiteFooter } from "@/components/layout/site-footer";
import { isNavigationItemActive, SiteHeader } from "@/components/navigation";
import { navigationConfig, primaryNavigation } from "@/config/navigation";

const { mockedUsePathname, mockedUseSearchParams } = vi.hoisted(() => ({
  mockedUsePathname: vi.fn<() => string>(),
  mockedUseSearchParams: vi.fn<() => URLSearchParams>(),
}));

vi.mock("next/navigation", () => ({
  usePathname: () => mockedUsePathname(),
  useSearchParams: () => mockedUseSearchParams(),
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
  it("marks home active only when no showroom scene is selected", () => {
    const homeItem = primaryNavigation[0];
    const projectsItem = primaryNavigation[1];

    expect(isNavigationItemActive("/", homeItem)).toBe(true);
    expect(isNavigationItemActive("/projects", homeItem)).toBe(false);
    expect(isNavigationItemActive("/", homeItem, "scene=projects")).toBe(false);
    expect(isNavigationItemActive("/", projectsItem, "scene=projects")).toBe(true);
  });

  it("keeps direct archive and detail routes associated with their showroom scene", () => {
    const projectsItem = primaryNavigation[1];

    expect(isNavigationItemActive("/projects", projectsItem)).toBe(true);
    expect(isNavigationItemActive("/projects/demo-project/", projectsItem)).toBe(true);
    expect(isNavigationItemActive("/projects-archive", projectsItem)).toBe(false);
  });

  it("reads the scene from a pathname fallback or URLSearchParams", () => {
    const servicesItem = primaryNavigation[2];

    expect(isNavigationItemActive("/?scene=services", servicesItem)).toBe(true);
    expect(isNavigationItemActive("/", servicesItem, new URLSearchParams("scene=services"))).toBe(
      true,
    );
    expect(isNavigationItemActive("/?scene=projects", servicesItem)).toBe(false);
  });
});

describe("SiteHeader", () => {
  beforeEach(() => {
    mockedUsePathname.mockReturnValue("/projects/demo-project");
    mockedUseSearchParams.mockReturnValue(new URLSearchParams());
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

    const socialNavigation = screen.getByRole("navigation", { name: "Sosyal medya profilleri" });
    expect(
      within(socialNavigation).getByRole("link", {
        name: "Instagram profilini yeni sekmede aç",
      }),
    ).toBeVisible();
    expect(
      within(socialNavigation).getByRole("link", {
        name: "LinkedIn profilini yeni sekmede aç",
      }),
    ).toBeVisible();
  });

  it("exposes the selected showroom scene as the active route on home", () => {
    mockedUsePathname.mockReturnValue("/");
    mockedUseSearchParams.mockReturnValue(new URLSearchParams("scene=services"));

    render(<SiteHeader />);

    const desktopNavigation = screen.getByTestId("desktop-navigation");
    expect(within(desktopNavigation).getByRole("link", { name: "Hizmetler" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(within(desktopNavigation).getByRole("link", { name: "Ana Sayfa" })).not.toHaveAttribute(
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
      name: "Göknur Uygur Akaydın ana sayfa",
    });
    const contactLink = within(dialog).getByRole("link", {
      name: "Hayalinizi mekâna dönüştürelim",
    });

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
    expect(within(footerNavigation).getByRole("link", { name: "Projeler" })).toHaveAttribute(
      "href",
      "/projects",
    );
    expect(within(footerNavigation).getByRole("link", { name: "Hizmetler" })).toHaveAttribute(
      "href",
      "/services",
    );
    expect(within(footerNavigation).getByRole("link", { name: "Paketler" })).toHaveAttribute(
      "href",
      "/packages",
    );
    expect(within(footerNavigation).getByRole("link", { name: "Hakkımda" })).toHaveAttribute(
      "href",
      "/about",
    );
    expect(within(footerNavigation).getByRole("link", { name: "İletişim" })).toHaveAttribute(
      "href",
      "/contact",
    );
    expect(primaryNavigation.map((item) => item.href)).toEqual([
      "/",
      "/?scene=projects#experience-projects",
      "/?scene=services#experience-showcase",
      "/?scene=packages#experience-packages",
      "/?scene=reviews#experience-reviews",
      "/?scene=about#experience-vision",
    ]);
    expect(navigationConfig.contactAction.href).toBe("/?scene=contact#experience-contact");
    expect(screen.getByText(/Tüm hakları saklıdır/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Konut, ticari mekân ve online iç mimari danışmanlık/i),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Instagram" })).toHaveAttribute(
      "href",
      "https://www.instagram.com/mimargoknuruygur/",
    );
  });
});
