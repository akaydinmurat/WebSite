import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

function skipUnlessProject(projectName: string, expectedProjectName: string) {
  test.skip(
    projectName !== expectedProjectName,
    `This scenario belongs to the ${expectedProjectName} project.`,
  );
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

  test("loads the premium home experience with its brand and accessible content", async ({
    page,
  }, testInfo) => {
    skipUnlessProject(testInfo.project.name, "chromium");
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");

    await expect(
      page.getByRole("heading", {
        level: 1,
        name: "Mekân, yaşamla anlam kazanır.",
      }),
    ).toBeVisible();
    await expect(page.getByRole("link", { name: "Göknur Uygur Akaydın ana sayfa" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Ana içeriğe geç" })).toHaveAttribute(
      "href",
      "#main-content",
    );
    await expect(page.locator("html")).toHaveAttribute("lang", "tr");
    await expect(page.locator("body")).toHaveAttribute("data-home-experience", "true");
    await expect(page.locator("body")).toHaveAttribute("data-experience-phase", "intro");
    await expect(page.locator(".spatial-home")).toHaveAttribute("data-webgl-ready", "false");
    await expect(page.locator(".experience-canvas")).toHaveCount(0);
    await expect(page.locator(".experience-project-meta-title")).toContainText(
      "B.M. Evi Mutfak Projesi",
    );
    await expect(page.locator(".experience-stage-list li")).toHaveCount(5);
    expect(await page.evaluate(() => window.scrollY)).toBe(0);

    const accessibilityScan = await new AxeBuilder({ page }).include("main").analyze();
    const seriousOrCriticalViolations = accessibilityScan.violations.filter(
      (violation) => violation.impact === "serious" || violation.impact === "critical",
    );
    expect(seriousOrCriticalViolations).toEqual([]);
  });

  test("renders the cinematic WebGL experience by default on a capable desktop", async ({
    page,
  }, testInfo) => {
    skipUnlessProject(testInfo.project.name, "chromium");
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.goto("/?scene=projects");

    const hasFineDesktopPointer = await page.evaluate(
      () => window.matchMedia("(min-width: 768px) and (hover: hover) and (pointer: fine)").matches,
    );

    expect(hasFineDesktopPointer).toBe(true);
    await expect(page.locator(".experience-canvas canvas")).toHaveCount(1);
    await expect(page.locator(".spatial-home")).toHaveAttribute("data-webgl-ready", "true", {
      timeout: 15_000,
    });
    await expect(page.locator(".experience-fallback")).toHaveCSS("opacity", "0");
  });

  test("navigates to Projects without remounting the home experience", async ({
    page,
  }, testInfo) => {
    skipUnlessProject(testInfo.project.name, "chromium");
    await page.goto("/");

    const navigation = page.getByTestId("site-header").getByTestId("desktop-navigation");
    const experience = page.locator(".spatial-home");
    await expect(navigation).toBeVisible();
    await expect(experience).toBeVisible();
    await navigation.getByRole("link", { name: "Projeler" }).click();

    await expect(page).toHaveURL(/\/?\?scene=projects$/);
    await expect(page.locator("body")).toHaveAttribute("data-experience-phase", "works");
    await expect(page.getByRole("heading", { level: 2, name: "Seçili projeler" })).toBeAttached();
    await expect(page.locator(".experience-project-meta-title")).toBeVisible();
    await expect(page.getByRole("link", { name: "Tüm projeler" })).toHaveAttribute(
      "href",
      "/projects",
    );
    await expect(navigation.getByRole("link", { name: "Projeler" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(await page.evaluate(() => window.scrollY)).toBeGreaterThan(0);

    await page.goBack();
    await expect(page).toHaveURL(/\/$/);
    await expect(page.locator("body")).toHaveAttribute("data-experience-phase", "intro");
    await expect(experience).toBeVisible();
  });

  test("keeps Process media, metadata and reverse scroll in sync", async ({ page }, testInfo) => {
    skipUnlessProject(testInfo.project.name, "chromium");
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/?scene=services");

    const processSection = page.locator("#experience-showcase");
    const activeStage = page.locator('.experience-stage-list [aria-current="step"]');
    const processHeading = page.locator(".experience-showcase-copy h2");

    await expect(page.locator("body")).toHaveAttribute("data-experience-phase", "showcase");
    await expect(activeStage).toHaveCount(1);
    await expect(activeStage).toContainText("Konsept");
    await expect(processHeading).toHaveText("Atmosferi tanımlayan ilk fikir");
    await expect(page.locator(".experience-fallback-process-visual")).toBeVisible();
    await expect(page.locator(".experience-fallback-process-visual")).toHaveCSS(
      "background-image",
      /01-concept-sketch\.webp/,
    );

    const processHeaderColors = await page.getByTestId("site-header").evaluate((element) => ({
      background: getComputedStyle(element).backgroundColor,
      color: getComputedStyle(element).color,
    }));
    expect(processHeaderColors.color).toBe("rgb(38, 37, 34)");
    expect(processHeaderColors.background).not.toBe("rgba(30, 30, 28, 0.72)");

    await processSection.evaluate((element) => {
      const section = element as HTMLElement;
      const scrollDistance = Math.max(0, section.offsetHeight - window.innerHeight);
      window.scrollTo({ top: section.offsetTop + scrollDistance * 0.56, behavior: "instant" });
    });

    await expect(activeStage).toContainText("Malzeme");
    await expect(processHeading).toHaveText("Işıkla değişen yüzey dili");

    await processSection.evaluate((element) => {
      window.scrollTo({ top: (element as HTMLElement).offsetTop, behavior: "instant" });
    });

    await expect(activeStage).toContainText("Konsept");
    await expect(processHeading).toHaveText("Atmosferi tanımlayan ilk fikir");
  });

  test("presents Packages as a framed cinematic track with an accessible fallback", async ({
    page,
  }, testInfo) => {
    skipUnlessProject(testInfo.project.name, "chromium");
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/?scene=packages");

    const packageTrack = page.locator("[data-package-track]");
    const packageCards = page.locator("[data-package-card]");

    await expect(page.locator("body")).toHaveAttribute("data-experience-phase", "outro");
    await expect(packageTrack).toBeVisible();
    await expect(packageTrack.getByRole("heading", { level: 2 })).toHaveText(
      "Kapsamı aç. Mekânı dönüştür.",
    );
    await expect(packageCards).toHaveCount(5);
    await expect(packageCards.first().locator(".experience-package-corners i")).toHaveCount(4);
    await expect(packageCards.first().getByRole("link", { name: "Görüşelim" })).toBeVisible();
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
    expect(seriousOrCriticalViolations).toEqual([]);
  });
});

test.describe("mobile journeys at 360px", () => {
  test.use({ viewport: { width: 360, height: 800 } });

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
    await expect(page.locator("body")).toHaveAttribute("data-experience-phase", "works");
    await expect(page.locator(".experience-project-meta-title")).toBeVisible();
    expect(await page.evaluate(() => window.scrollY)).toBeGreaterThan(0);
  });

  test("keeps key pages and home chapters within the 360px viewport", async ({
    page,
  }, testInfo) => {
    skipUnlessProject(testInfo.project.name, "mobile-chromium");

    for (const path of [
      "/",
      "/?scene=projects",
      "/?scene=services",
      "/?scene=packages",
      "/projects",
      "/projects/bm-evi-mutfak",
      "/packages",
      "/contact",
    ]) {
      await page.goto(path);
      await expect(page.locator("main")).toBeVisible();

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
