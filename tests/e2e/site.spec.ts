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

    for (const path of ["/", "/projects", "/projects/bm-evi-mutfak", "/contact"]) {
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
        name: "Mekânı, yaşamla birlikte tasarlıyorum.",
      }),
    ).toBeVisible();
    await expect(page.getByRole("link", { name: "Ana içeriğe geç" })).toHaveAttribute(
      "href",
      "#main-content",
    );
    await expect(page.locator("html")).toHaveAttribute("lang", "tr");

    const accessibilityScan = await new AxeBuilder({ page }).analyze();
    const seriousOrCriticalViolations = accessibilityScan.violations.filter(
      (violation) => violation.impact === "serious" || violation.impact === "critical",
    );
    expect(seriousOrCriticalViolations).toEqual([]);
  });

  test("uses the desktop navigation to open the project collection", async ({ page }, testInfo) => {
    skipUnlessProject(testInfo.project.name, "chromium");
    await page.goto("/");

    const navigation = page.getByTestId("desktop-navigation");
    await expect(navigation).toBeVisible();
    await navigation.getByRole("link", { name: "Projeler" }).click();

    await expect(page).toHaveURL(/\/projects\/?$/);
    await expect(
      page.getByRole("heading", {
        level: 1,
        name: "Her mekân, kendi yaşam biçiminden doğar.",
      }),
    ).toBeVisible();
    await expect(
      page.getByTestId("desktop-navigation").getByRole("link", { name: "Projeler" }),
    ).toHaveAttribute("aria-current", "page");
  });

  test("filters the project collection and opens a project detail", async ({ page }, testInfo) => {
    skipUnlessProject(testInfo.project.name, "chromium");
    await page.goto("/projects");

    const categoryToolbar = page.getByRole("toolbar", { name: "Proje kategorileri" });
    const kitchenFilter = categoryToolbar.getByRole("button", {
      name: "Mutfak",
      exact: true,
    });

    await expect(page.locator("main article")).toHaveCount(8);
    await kitchenFilter.click();

    await expect(kitchenFilter).toHaveAttribute("aria-pressed", "true");
    await expect(page.locator("main article")).toHaveCount(2);
    await expect(
      page.getByRole("heading", { level: 2, name: "B.M. Evi Mutfak Projesi" }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { level: 2, name: "E.S. Evi Banyo Projesi" }),
    ).toHaveCount(0);

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

    const heroStage = page.locator(".hero-stage");
    const customCursor = page.locator(".custom-cursor");
    await page.mouse.move(40, 40);
    await page.mouse.move(240, 220, { steps: 4 });

    await expect(customCursor).toHaveAttribute("data-visible", "true");
    await expect
      .poll(() => heroStage.evaluate((element) => element.style.getPropertyValue("--pointer-x")))
      .not.toBe("");

    await page.getByRole("link", { name: "Projeleri keşfet" }).hover();
    await expect(customCursor).toHaveAttribute("data-active", "true");
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

    await expect(page).toHaveURL(/\/projects\/?$/);
    await expect(
      page.getByRole("heading", {
        level: 1,
        name: "Her mekân, kendi yaşam biçiminden doğar.",
      }),
    ).toBeVisible();
  });

  test("keeps key pages within the 360px viewport", async ({ page }, testInfo) => {
    skipUnlessProject(testInfo.project.name, "mobile-chromium");

    for (const path of ["/", "/projects", "/projects/bm-evi-mutfak", "/contact"]) {
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
