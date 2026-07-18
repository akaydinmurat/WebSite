import AxeBuilder from "@axe-core/playwright";
import type { Locator, Page } from "@playwright/test";
import { expect, test } from "@playwright/test";

function skipUnlessProject(projectName: string, expectedProjectName: string) {
  test.skip(
    projectName !== expectedProjectName,
    `This scenario belongs to the ${expectedProjectName} project.`,
  );
}

async function expectHorizontallyContained(page: Page, locator: Locator, label: string) {
  await expect(locator).toBeVisible();

  await expect
    .poll(
      async () => {
        const box = await locator.boundingBox();
        const viewportWidth = await page.evaluate(() => document.documentElement.clientWidth);

        if (!box) return Number.POSITIVE_INFINITY;

        return Math.max(0, -box.x, box.x + box.width - viewportWidth);
      },
      { message: `${label} should stay fully inside the desktop viewport` },
    )
    .toBeLessThanOrEqual(1);
}

async function expectNoHorizontalOverflow(page: Page, label: string) {
  await expect
    .poll(
      () =>
        page.evaluate(() => {
          const root = document.documentElement;
          const body = document.body;
          return Math.max(root.scrollWidth, body.scrollWidth) - root.clientWidth;
        }),
      { message: `${label} should not create horizontal overflow` },
    )
    .toBeLessThanOrEqual(1);
}

async function waitForAnimationFrames(page: Page) {
  await page.evaluate(
    () =>
      new Promise<void>((resolve) => {
        requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
      }),
  );
}

async function expectNoSeriousOrCriticalAxeViolations(page: Page, include: string, label: string) {
  const accessibilityScan = await new AxeBuilder({ page }).include(include).analyze();
  const seriousOrCriticalViolations = accessibilityScan.violations.filter(
    (violation) => violation.impact === "serious" || violation.impact === "critical",
  );

  expect(
    seriousOrCriticalViolations,
    `${label} should have no serious accessibility violations`,
  ).toEqual([]);
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

    for (const path of [
      "/",
      "/about",
      "/projects",
      "/projects/bm-evi-mutfak",
      "/packages",
      "/contact",
    ]) {
      await page.goto(path);
      await expect(page.locator("main h1").first()).toBeVisible();
    }

    expect(browserErrors).toEqual([]);
  });

  test("keeps the luminous header and primary routes accessible", async ({ page }, testInfo) => {
    skipUnlessProject(testInfo.project.name, "chromium");
    await page.emulateMedia({ reducedMotion: "reduce" });

    for (const path of ["/", "/projects", "/services", "/packages", "/contact", "/about"]) {
      await page.goto(path);
      await expect(page.locator("main h1").first()).toBeVisible();

      const header = page.getByTestId("site-header");
      await expect(header).toHaveAttribute("data-cursor-theme", "light");

      const headerSurface = await header.evaluate((element) => {
        const rootStyles = getComputedStyle(document.documentElement);
        const styles = getComputedStyle(element);
        const backgroundChannels = styles.backgroundColor
          .match(/[\d.]+/g)
          ?.slice(0, 3)
          .map(Number) ?? [0, 0, 0];

        return {
          backgroundChannelAverage:
            backgroundChannels.reduce((total, channel) => total + channel, 0) /
            backgroundChannels.length,
          backgroundColor: styles.backgroundColor,
          color: styles.color,
          luminousInk: rootStyles.getPropertyValue("--luminous-ink").trim(),
        };
      });

      expect(headerSurface.luminousInk).toBe("#20292d");
      expect(headerSurface.color).toBe("rgb(32, 41, 45)");
      expect(headerSurface.backgroundColor).not.toBe("rgba(0, 0, 0, 0)");
      expect(headerSurface.backgroundChannelAverage).toBeGreaterThan(180);

      await expectNoSeriousOrCriticalAxeViolations(page, "body", path);
    }
  });

  test("keeps every luminous home chapter accessible", async ({ page }, testInfo) => {
    skipUnlessProject(testInfo.project.name, "chromium");
    await page.emulateMedia({ reducedMotion: "reduce" });

    const chapters = [
      ["projects", "#experience-projects", "works"],
      ["services", "#experience-showcase", "showcase"],
      ["packages", "#experience-packages", "outro"],
      ["reviews", "#experience-reviews", "outro"],
      ["about", "#experience-vision", "vision"],
      ["contact", "#experience-contact", "outro"],
    ] as const;

    await page.goto("/");
    const chapterOrder = await page
      .locator(
        "#experience-projects, #experience-showcase, #experience-packages, #experience-reviews, #experience-vision, #experience-contact",
      )
      .evaluateAll((elements) => elements.map((element) => element.id));
    expect(chapterOrder).toEqual([
      "experience-projects",
      "experience-showcase",
      "experience-packages",
      "experience-reviews",
      "experience-vision",
      "experience-contact",
    ]);

    for (const [scene, selector, phase] of chapters) {
      await page.goto(`/?scene=${scene}`);
      await expect(page.locator("body")).toHaveAttribute("data-experience-phase", phase);
      await expect(page.getByTestId("site-header")).toHaveAttribute("data-cursor-theme", "light");
      await expect(page.locator(selector)).toBeVisible();
      await expectNoSeriousOrCriticalAxeViolations(page, selector, scene);
    }
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

  test("keeps the accessible architectural fallback as the default desktop experience", async ({
    page,
  }, testInfo) => {
    skipUnlessProject(testInfo.project.name, "chromium");
    test.skip(
      process.env.PLAYWRIGHT_EXPECT_WEBGL === "true",
      "The fallback-only assertion runs against the default CSS experience.",
    );
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.goto("/?scene=projects");

    const hasFineDesktopPointer = await page.evaluate(
      () => window.matchMedia("(min-width: 768px) and (hover: hover) and (pointer: fine)").matches,
    );

    expect(hasFineDesktopPointer).toBe(true);
    await expect(page.locator(".experience-canvas canvas")).toHaveCount(0);
    await expect(page.locator(".spatial-home")).toHaveAttribute("data-webgl-ready", "false");
    await expect(page.locator(".experience-fallback")).toHaveCSS("opacity", "1");
    await expect(page.locator(".custom-cursor")).toHaveAttribute("aria-hidden", "true");
  });

  test("renders the opt-in WebGL project surface when explicitly enabled", async ({
    page,
  }, testInfo) => {
    skipUnlessProject(testInfo.project.name, "chromium");
    test.skip(
      process.env.PLAYWRIGHT_EXPECT_WEBGL !== "true",
      "The opt-in WebGL assertion only runs against an explicitly enabled server.",
    );

    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.goto("/");

    const experience = page.locator(".spatial-home");
    const canvas = page.locator(".experience-canvas canvas");
    await expect(experience).toHaveAttribute("data-webgl-ready", "true");
    await expect(canvas).toBeVisible();

    await page.getByTestId("desktop-navigation").getByRole("link", { name: "Projeler" }).click();
    await expect(page.locator("body")).toHaveAttribute("data-experience-phase", "works");
    await expect(page.locator(".experience-fallback")).toHaveAttribute(
      "data-fallback-phase",
      "works",
    );
    await page.mouse.move(240, 320);
    await page.mouse.move(980, 430);
    await expect(canvas).toBeVisible();
  });

  test("keeps the editorial hero readable while its material surface reacts to a fine pointer", async ({
    page,
  }, testInfo) => {
    skipUnlessProject(testInfo.project.name, "chromium");
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.goto("/");

    const hasFineDesktopPointer = await page.evaluate(
      () => window.matchMedia("(min-width: 768px) and (hover: hover) and (pointer: fine)").matches,
    );
    const fallback = page.locator(".experience-fallback");
    const materialField = fallback.locator(".experience-fallback-material-field");
    const lightField = fallback.locator(".experience-fallback-light-field");
    const rejectedHeroElements = fallback.locator(
      ".experience-fallback-portal, .experience-fallback-core, .experience-fallback-spectrum, .experience-fallback-refraction",
    );

    expect(hasFineDesktopPointer).toBe(true);
    await expect(fallback).toHaveAttribute("aria-hidden", "true");
    await expect(
      page.getByRole("heading", { level: 1, name: "Mekân, yaşamla anlam kazanır." }),
    ).toBeVisible();
    await expect(page.locator(".experience-intro-description")).toBeVisible();
    await expect(materialField).toHaveCount(1);
    await expect(materialField.locator("i")).toHaveCount(3);
    await expect(lightField).toHaveCount(1);
    await expect(materialField).toHaveCSS("pointer-events", "none");
    await expect(lightField).toHaveCSS("pointer-events", "none");
    await expect(lightField).toHaveCSS("opacity", "0.9");
    await expect(rejectedHeroElements).toHaveCount(0);

    await expect
      .poll(() =>
        page.evaluate(() => document.documentElement.style.getPropertyValue("--surface-shift-x")),
      )
      .not.toBe("");
    const initialSurfaceShift = await page.evaluate(() =>
      document.documentElement.style.getPropertyValue("--surface-shift-x"),
    );

    await page.mouse.move(137, 211);
    await expect
      .poll(() =>
        page.evaluate(() => ({
          x: document.documentElement.style.getPropertyValue("--pointer-vx"),
          y: document.documentElement.style.getPropertyValue("--pointer-vy"),
        })),
      )
      .toEqual({ x: "137px", y: "211px" });
    await expect
      .poll(() =>
        page.evaluate(() => document.documentElement.style.getPropertyValue("--surface-shift-x")),
      )
      .not.toBe(initialSurfaceShift);

    await page.getByTestId("desktop-navigation").getByRole("link", { name: "Projeler" }).click();
    await expect(page.locator("body")).toHaveAttribute("data-experience-phase", "works");
    await expect
      .poll(() => lightField.evaluate((element) => Number(getComputedStyle(element).opacity)))
      .toBeGreaterThan(0.95);
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

    await expect(page).toHaveURL(/\/?\?scene=projects#experience-projects$/);
    await expect(page.locator("body")).toHaveAttribute("data-experience-phase", "works");
    await expect(page.getByRole("heading", { level: 2, name: "Seçili projeler" })).toBeAttached();
    await expect(page.locator(".experience-project-meta-title")).toBeVisible();
    await expect(page.getByRole("link", { name: "Aktif projeyi incele" })).toHaveAttribute(
      "href",
      "/projects/bm-evi-mutfak",
    );
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
    await expect(page.getByTestId("site-header")).toHaveAttribute("data-cursor-theme", "light");

    await processSection.evaluate((element) => {
      const section = element as HTMLElement;
      const scrollDistance = Math.max(0, section.offsetHeight - window.innerHeight);
      window.scrollTo({ top: section.offsetTop + scrollDistance * 0.5, behavior: "instant" });
    });

    await expect(activeStage).toContainText("Malzeme");
    await expect(processHeading).toHaveText("Işıkla değişen yüzey dili");

    await processSection.evaluate((element) => {
      window.scrollTo({ top: (element as HTMLElement).offsetTop, behavior: "instant" });
    });

    await expect(activeStage).toContainText("Konsept");
    await expect(processHeading).toHaveText("Atmosferi tanımlayan ilk fikir");
  });

  test("presents the About monograph and keeps its full story accessible", async ({
    page,
  }, testInfo) => {
    skipUnlessProject(testInfo.project.name, "chromium");
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/?scene=about");

    const aboutSection = page.locator("#experience-vision");
    const folio = aboutSection.locator(".experience-about-folio");
    const credits = folio.locator(".experience-about-credits");
    const retiredAboutElements = aboutSection.locator(
      ".experience-about-aperture, .experience-about-depth-plane, .experience-about-panels, .experience-about-timeline, [data-about-panel]",
    );

    await expect(page.locator("body")).toHaveAttribute("data-experience-phase", "vision");
    await expect(
      aboutSection.getByRole("heading", {
        level: 2,
        name: "Mekânı, onu yaşayacak kişinin ritminden okurum.",
      }),
    ).toBeVisible();
    await expect(folio).toBeVisible();
    await expect(credits.locator("div")).toHaveCount(3);
    await expect(credits.locator("dd")).toHaveText([
      "Bağımsız mimarlık",
      "Ankara · Türkiye",
      "Konut · Ofis · Mağaza",
    ]);
    await expect(retiredAboutElements).toHaveCount(0);
    await expect(aboutSection.getByRole("link", { name: "Hikâyenin tamamı" })).toHaveAttribute(
      "href",
      "/about",
    );

    const homeAboutAccessibilityScan = await new AxeBuilder({ page })
      .include("#experience-vision")
      .analyze();
    expect(
      homeAboutAccessibilityScan.violations.filter(
        (violation) => violation.impact === "serious" || violation.impact === "critical",
      ),
    ).toEqual([]);

    await page.goto("/about");

    const chapters = page.locator("[data-about-chapter]");
    await expect(page.getByRole("heading", { level: 1, name: /Göknur\s+Uygur/ })).toBeVisible();
    await expect(chapters).toHaveCount(4);
    await expect(chapters).toContainText([
      "Atılım Üniversitesi",
      "TOBB ETÜ",
      "Özel Sektör",
      "Bağımsız Çalışma",
    ]);
    for (const chapter of await chapters.all()) await expect(chapter).toBeVisible();

    const aboutPageAccessibilityScan = await new AxeBuilder({ page })
      .include("main#main-content")
      .analyze();
    expect(
      aboutPageAccessibilityScan.violations.filter(
        (violation) => violation.impact === "serious" || violation.impact === "critical",
      ),
    ).toEqual([]);
  });

  test("keeps the About compositions inside the desktop viewport", async ({ page }, testInfo) => {
    skipUnlessProject(testInfo.project.name, "chromium");
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.goto("/?scene=about");

    const homeFolio = page.locator("#experience-vision .experience-about-folio");

    await expect(page.locator("body")).toHaveAttribute("data-experience-phase", "vision");
    await page.evaluate(() => document.fonts.ready);
    await page.addStyleTag({
      content: ".experience-about-folio { transition: none !important; }",
    });

    for (const x of [1, 1279]) {
      await page.mouse.move(x, 400);
      await waitForAnimationFrames(page);
      await expectHorizontallyContained(page, homeFolio, "Home About folio");
      await expectNoHorizontalOverflow(page, "Home About composition");
    }

    await page.goto("/about");
    await page.evaluate(() => document.fonts.ready);

    const coverTitle = page.locator("#about-page-title");
    const coverTitleLines = coverTitle.locator(":scope > span");
    const coverFolio = page.locator("[data-about-cover-folio]");

    await expect(coverTitleLines).toHaveCount(2);
    await expectHorizontallyContained(page, coverTitle, "About cover title");
    for (const titleLine of await coverTitleLines.all()) {
      await expectHorizontallyContained(page, titleLine, "About cover title line");
    }
    await expectHorizontallyContained(page, coverFolio, "About cover folio");
    await expectNoHorizontalOverflow(page, "About cover");
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
      "Fikri, yaşayacağınız mekâna dönüştüren kapsamlar.",
    );
    await expect(packageCards).toHaveCount(7);
    await expect(packageCards.first().getByRole("link", { name: "Teklif alın" })).toBeVisible();
    await expect(packageCards.first().getByRole("heading", { level: 3 })).toBeVisible();
    await expect(page.locator(".experience-package-benefit")).toHaveCount(7);
    await expect(page.locator(".experience-package-pricing")).toHaveCount(7);
    await expect(page.locator(".experience-package-grid")).toHaveCSS("display", "grid");
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

    await page.getByRole("button", { name: "Tasarım görüşmesini başlat" }).click();
    const contactForm = page.getByRole("form", {
      name: "Mekânınızın ilk brief’ini oluşturalım.",
    });

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
    await expect(page.getByTestId("site-header")).toHaveAttribute("data-cursor-theme", "light");

    const dialogSurface = await dialog.evaluate((element) => {
      const styles = getComputedStyle(element);

      return {
        backgroundColor: styles.backgroundColor,
        color: styles.color,
      };
    });

    expect(dialogSurface.backgroundColor).not.toBe("rgba(0, 0, 0, 0)");
    expect(dialogSurface.color).toBe("rgb(32, 41, 45)");
    await expectNoHorizontalOverflow(page, "Open mobile menu");
    await expectNoSeriousOrCriticalAxeViolations(page, '[role="dialog"]', "Open mobile menu");

    await page.keyboard.press("Escape");

    await expect(dialog).toBeHidden();
    await expect(menuTrigger).toHaveAttribute("aria-expanded", "false");
    await expect(menuTrigger).toBeFocused();
    await expect(page.locator("body")).not.toHaveAttribute("data-menu-open", "true");

    await menuTrigger.click();
    await dialog.getByRole("link", { name: /Projeler/i }).click();

    await expect(page).toHaveURL(/\/?\?scene=projects#experience-projects$/);
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
      "/?scene=about",
      "/about",
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
