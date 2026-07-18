import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { SocialIconLinks } from "@/components/ui/social-icon-links";
import { siteConfig } from "@/config/site";

describe("SocialIconLinks", () => {
  it("renders the configured profiles as accessible external links", () => {
    render(<SocialIconLinks />);

    expect(screen.getByRole("navigation", { name: "Sosyal medya bağlantıları" })).toBeVisible();

    for (const socialLink of siteConfig.socialLinks) {
      expect(
        screen.getByRole("link", {
          name: `${socialLink.label} profilini yeni sekmede aç`,
        }),
      ).toMatchObject({
        href: socialLink.href,
        target: "_blank",
        rel: "noopener noreferrer",
      });
    }

    expect(
      screen
        .getByRole("link", { name: "Instagram profilini yeni sekmede aç" })
        .querySelector("svg"),
    ).toHaveClass("instagram-mark");
  });
});
