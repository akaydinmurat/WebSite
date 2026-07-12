import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

function skipUnlessProject(projectName: string, expectedProjectName: string) {
  test.skip(
    projectName !== expectedProjectName,
    `This scenario belongs to the ${expectedProjectName} project.`,
  );
}

async function dismissHomeIntro(page: import("@playwright/test").Page) {
  const skipButton = page.getByRole("button", { name: "Girişi atla" });
  if (await skipButton.isVisible()) await skipButton.click();
}

test.describe("core visitor journeys", () => {
  test("loads key routes without browser or hydration errors", async ({ page }, testInfo) => {
    skipUnlessProject(testInfo.project.name, "chromium");
    const browserErrors: string[] = [];

    page.on("console", (message) => {
      if (message.type() === "error" && !message.text().includes("/_next/webpack-hmr")) {
        browserErrors.push(message.text());
      }
    });
    page.on("pageerror", (error) => browserErrors.push(error.message));

    for (const path of ["/", "/projects", "/projects/bm-evi-mutfak", "/packages", "/contact"]) {
      await page.goto(path);
      await expect(page.locator("main h1").first()).toBeVisible();
    }

    expect(browserErrors).toEqual([]);
  });

  test("loads the home page with its primary content and skip link", async ({ page }, testInfo) => {
    skipUnlessProject(testInfo.project.name, "chromium");
    await page.emulateMedia({ reducedMotion: "reduce" });

    await page.goto("/");

    await expect(
      page.getByRole("heading", {
        level: 1,
        name: "Mekân, yaşamla anlam kazanır.",
      }),
    ).toBeVisible();
    await expect(page.getByRole("link", { name: "Ana içeriğe geç" })).toHaveAttribute(
      "href",
      "#main-content",
    );
    await expect(page.locator("html")).toHaveAttribute("lang", "tr");
    const socialNavigation = page.getByRole("navigation", { name: "Sosyal medya" });
    await expect(socialNavigation.getByRole("link", { name: "Instagram" })).toBeVisible();
    await expect(socialNavigation.getByRole("link", { name: "LinkedIn" })).toBeVisible();
    await expect(page.locator("body")).toHaveAttribute("data-showroom-active", "true");
    await expect(page.locator("[data-site-footer]")).toBeHidden();
    await expect(page.locator('.showroom-card[data-active="true"]')).toHaveCount(1);
    await expect(page.locator(".immersive-showroom .showroom-core-fallback")).toBeVisible();
    await expect(page.locator(".showroom-canvas")).toHaveCount(0);
    expect(await page.evaluate(() => window.scrollY)).toBe(0);

    const accessibilityScan = await new AxeBuilder({ page }).analyze();
    const seriousOrCriticalViolations = accessibilityScan.violations.filter(
      (violation) => violation.impact === "serious" || violation.impact === "critical",
    );
    expect(seriousOrCriticalViolations).toEqual([]);
  });

  test("keeps the cinematic intro skippable and restores the page", async ({ page }, testInfo) => {
    skipUnlessProject(testInfo.project.name, "chromium");
    await page.goto("/");

    const intro = page.locator(".intro-overlay");
    const homeContent = page.locator("[data-home-content]");

    await expect(page.getByRole("button", { name: "Girişi atla" })).toBeVisible();
    await expect(intro).toHaveAttribute("data-state", "active");
    await expect(homeContent).toHaveAttribute("inert", "");
    await expect(page.locator("[data-site-footer]")).toHaveAttribute("inert", "");

    await page.keyboard.press("Escape");

    await expect(intro).toBeHidden();
    await expect(homeContent).not.toHaveAttribute("inert", "");
    await expect(page.locator("[data-site-footer]")).toHaveAttribute("inert", "");
    await expect(page.locator("main#main-content")).toBeFocused();
  });

  test("changes showroom scenes without scrolling or remounting the world", async ({
    page,
  }, testInfo) => {
    skipUnlessProject(testInfo.project.name, "chromium");
    await page.goto("/");
    await dismissHomeIntro(page);

    const navigation = page.getByTestId("desktop-navigation");
    const world = page.locator(".showroom-world");
    await expect(navigation).toBeVisible();
    await expect(world).toBeVisible();
    await navigation.getByRole("link", { name: "Projeler" }).click();

    await expect(page).toHaveURL(/\/?\?scene=projects$/);
    await expect(
      page.getByRole("heading", {
        level: 1,
        name: "Her proje, kendi yaşam biçiminin izini taşır.",
      }),
    ).toBeVisible();
    await expect(page.locator("body")).toHaveAttribute("data-showroom-scene", "projects");
    await expect(
      page.getByRole("heading", { level: 2, name: "B.M. Evi Mutfak Projesi" }),
    ).toBeVisible();
    await expect(page.getByRole("link", { name: "Proje arşivini aç" })).toHaveAttribute(
      "href",
      "/projects",
    );
    expect(await page.evaluate(() => window.scrollY)).toBe(0);
    await expect(
      page.getByTestId("desktop-navigation").getByRole("link", { name: "Projeler" }),
    ).toHaveAttribute("aria-current", "page");

    await page.goBack();
    await expect(page).toHaveURL(/\/$/);
    await expect(
      page.getByRole("heading", { level: 1, name: "Mekân, yaşamla anlam kazanır." }),
    ).toBeVisible();
    await expect(world).toBeVisible();
  });

  test("filters the project collection and opens a project detail", async ({ page }, testInfo) => {
    skipUnlessProject(testInfo.project.name, "chromium");
    await page.goto("/projects");

    const categoryFilter = page.getByRole("group", { name: "Proje kategorileri" });
    const kitchenFilter = categoryFilter.getByRole("button", {
      name: "Mutfak",
      exact: true,
    });

    await expect(page.locator("main article")).toHaveCount(8);
    await kitchenFilter.click();

    await expect(kitchenFilter).toHaveAttribute("aria-pressed", "true");
    await expect(page.locator("[data-active-slug]")).toHaveAttribute(
      "data-active-slug",
      "bm-evi-mutfak",
    );
    await expect(page.locator("main article")).toHaveCount(2);
    await expect(
      page.getByRole("heading", { level: 2, name: "B.M. Evi Mutfak Projesi" }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { level: 2, name: "E.S. Evi Banyo Projesi" }),
    ).toHaveCount(0);

    const projectAccessibilityScan = await new AxeBuilder({ page })
      .include(".project-archive")
      .analyze();
    expect(
      projectAccessibilityScan.violations.filter(
        (violation) => violation.impact === "serious" || violation.impact === "critical",
      ),
    ).toEqual([]);

    await page.getByRole("link", { name: "B.M. Evi Mutfak Projesi projesini incele" }).click();

    await expect(page).toHaveURL(/\/projects\/bm-evi-mutfak\/?$/);
    await expect(
      page.getByRole("heading", { level: 1, name: "B.M. Evi Mutfak Projesi" }),
    ).toBeVisible();
    await expect(page.getByText("Arşiv notu:", { exact: true })).toBeVisible();
    await expect(page.getByRole("link", { name: /Proje seçkisi/i })).toHaveAttribute(
      "href",
      "/projects",
    );
  });

  test("responds to a fine pointer and exposes the enhanced cursor", async ({ page }, testInfo) => {
    skipUnlessProject(testInfo.project.name, "chromium");
    await page.goto("/");
    await dismissHomeIntro(page);

    const documentRoot = page.locator("html");
    const customCursor = page.locator(".custom-cursor");
    await expect(customCursor).toHaveAttribute("data-ready", "true");
    await page.mouse.move(40, 40);
    await page.mouse.move(240, 220, { steps: 4 });

    await expect(customCursor).toHaveAttribute("data-visible", "true");
    await expect(page.locator(".immersive-showroom")).toHaveAttribute("data-webgl-ready", "true");
    const showroomCanvas = page.locator(".showroom-canvas canvas");
    await expect(showroomCanvas).toBeVisible();
    await expect
      .poll(() =>
        documentRoot.evaluate((element) => element.style.getPropertyValue("--pointer-nx")),
      )
      .not.toBe("0.0000");

    await page.getByRole("button", { name: "Sahneyi aç" }).hover();
    await expect(customCursor).toHaveAttribute("data-active", "true");

    await showroomCanvas.dispatchEvent("webglcontextlost");
    await expect(page.locator(".immersive-showroom")).toHaveAttribute("data-webgl-ready", "false");
    await expect(page.locator(".immersive-showroom .showroom-core-fallback")).toBeVisible();
  });

  test("rotates service cards with controls, wheel and keyboard while the page stays fixed", async ({
    page,
  }, testInfo) => {
    skipUnlessProject(testInfo.project.name, "chromium");
    await page.goto("/?scene=services");
    await dismissHomeIntro(page);

    const activeCard = page.locator('.showroom-card[data-active="true"]');
    await expect(
      activeCard.getByRole("heading", { level: 2, name: "Mimarlık ve İç Mekân Tasarımı" }),
    ).toBeVisible();
    await expect(page.locator('.showroom-card[data-active="false"]').first()).toHaveAttribute(
      "inert",
      "",
    );

    await page.getByRole("button", { name: "Sonraki kart" }).click();
    await expect(
      activeCard.getByRole("heading", { level: 2, name: "Konut Tasarımı" }),
    ).toBeVisible();

    await page.mouse.wheel(0, 120);
    await expect(
      activeCard.getByRole("heading", { level: 2, name: "Ofis ve Ticari Mekân Tasarımı" }),
    ).toBeVisible();

    await page.keyboard.press("ArrowLeft");
    await expect(
      activeCard.getByRole("heading", { level: 2, name: "Konut Tasarımı" }),
    ).toBeVisible();
    await expect(page.locator(".showroom-live-status")).toContainText("02 / 05 — Konut Tasarımı");

    await page.mouse.move(250, 160);
    await page.mouse.down();
    await page.mouse.move(170, 160, { steps: 5 });
    await page.mouse.up();
    await expect(
      activeCard.getByRole("heading", { level: 2, name: "Ofis ve Ticari Mekân Tasarımı" }),
    ).toBeVisible();
    expect(await page.evaluate(() => window.scrollY)).toBe(0);
  });

  test("announces contact form validation errors without serious accessibility violations", async ({
    page,
  }, testInfo) => {
    skipUnlessProject(testInfo.project.name, "chromium");
    await page.goto("/contact");

    await page.getByRole("button", { name: "Proje talebini gönder" }).click();

    const contactForm = page.getByRole("form", { name: "Projenizi anlatın" });

    await expect(contactForm.getByText("Adınız en az 2 karakter olmalıdır.")).toBeVisible();
    await expect(contactForm.getByText("Geçerli bir e-posta adresi girin.")).toBeVisible();
    await expect(contactForm.getByText("Bir proje türü seçin.")).toBeVisible();
    await expect(contactForm.getByText("Bir bütçe aralığı seçin.")).toBeVisible();
    await expect(contactForm.getByText("Mesajınız en az 20 karakter olmalıdır.")).toBeVisible();
    await expect(
      contactForm.getByText("İletişim kurulabilmesi için onay vermelisiniz."),
    ).toBeVisible();
    await expect(contactForm.getByRole("textbox", { name: /Ad soyad/i })).toHaveAttribute(
      "aria-invalid",
      "true",
    );
    await expect(contactForm.getByRole("alert")).toHaveCount(6);

    const accessibilityScan = await new AxeBuilder({ page }).include("form").analyze();
    const seriousOrCriticalViolations = accessibilityScan.violations.filter(
      (violation) => violation.impact === "serious" || violation.impact === "critical",
    );

    expect(
      seriousOrCriticalViolations,
      JSON.stringify(
        seriousOrCriticalViolations.map(({ id, impact, nodes }) => ({
          id,
          impact,
          targets: nodes.map((node) => node.target),
        })),
        null,
        2,
      ),
    ).toEqual([]);
  });
});

test.describe("mobile journeys at 360px", () => {
  test.use({
    viewport: { width: 360, height: 800 },
  });

  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
  });

  test("opens and closes the menu with the keyboard, then navigates from it", async ({
    page,
  }, testInfo) => {
    skipUnlessProject(testInfo.project.name, "mobile-chromium");
    await page.goto("/");

    const menuTrigger = page.getByRole("button", { name: "Menüyü aç" });
    await menuTrigger.focus();
    await page.keyboard.press("Enter");

    const dialog = page.getByRole("dialog", { name: "Ana menü" });
    await expect(dialog).toBeVisible();
    await expect(menuTrigger).toHaveAttribute("aria-expanded", "true");
    await expect(page.locator("body")).toHaveAttribute("data-menu-open", "true");

    await page.keyboard.press("Escape");

    await expect(dialog).toBeHidden();
    await expect(menuTrigger).toHaveAttribute("aria-expanded", "false");
    await expect(menuTrigger).toBeFocused();
    await expect(page.locator("body")).not.toHaveAttribute("data-menu-open", "true");

    await menuTrigger.click();
    await dialog.getByRole("link", { name: /Projeler/i }).click();

    await expect(page).toHaveURL(/\/?\?scene=projects$/);
    await expect(
      page.getByRole("heading", {
        level: 1,
        name: "Her proje, kendi yaşam biçiminin izini taşır.",
      }),
    ).toBeVisible();
    await expect(page.locator("body")).toHaveAttribute("data-showroom-scene", "projects");
    expect(await page.evaluate(() => window.scrollY)).toBe(0);
  });

  test("keeps key pages within the 360px viewport", async ({ page }, testInfo) => {
    skipUnlessProject(testInfo.project.name, "mobile-chromium");

    for (const path of ["/", "/projects", "/projects/bm-evi-mutfak", "/packages", "/contact"]) {
      await page.goto(path);
      await expect(page.locator("main h1").first()).toBeVisible();

      await expect
        .poll(
          () =>
            page.evaluate(() => {
              const root = document.documentElement;
              const body = document.body;
              return Math.max(root.scrollWidth, body.scrollWidth) - root.clientWidth;
            }),
          { message: `${path} should not create horizontal overflow at 360px` },
        )
        .toBeLessThanOrEqual(1);
    }
  });
});
