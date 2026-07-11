import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { ContactForm } from "@/components/forms/contact-form";

afterEach(() => {
  vi.unstubAllGlobals();
});

async function fillValidForm() {
  const user = userEvent.setup();

  await user.type(screen.getByRole("textbox", { name: /ad soyad/i }), "Ayşe Yılmaz");
  await user.type(screen.getByRole("textbox", { name: /e-posta/i }), "ayse@example.com");
  await user.selectOptions(
    screen.getByRole("combobox", { name: /proje türü/i }),
    "interior-architecture",
  );
  await user.type(screen.getByRole("textbox", { name: /yaklaşık alan/i }), "120");
  await user.selectOptions(screen.getByRole("combobox", { name: /bütçe aralığı/i }), "500k-1m");
  await user.type(
    screen.getByRole("textbox", { name: /projeniz hakkında/i }),
    "Yeni evimizin yaşam alanları için tasarım desteği istiyoruz.",
  );
  await user.click(screen.getByRole("checkbox", { name: /bilgilerimin bu talebe/i }));

  return user;
}

describe("ContactForm", () => {
  it("announces accessible validation errors", async () => {
    const user = userEvent.setup();

    render(<ContactForm />);
    await user.click(screen.getByRole("button", { name: /proje talebini gönder/i }));

    expect(await screen.findByText("Adınız en az 2 karakter olmalıdır.")).toHaveAttribute(
      "role",
      "alert",
    );
    expect(screen.getByText("Geçerli bir e-posta adresi girin.")).toBeInTheDocument();
    expect(screen.getByText("Bir proje türü seçin.")).toBeInTheDocument();
    expect(screen.getByText("Bir bütçe aralığı seçin.")).toBeInTheDocument();
    expect(screen.getByText("Mesajınız en az 20 karakter olmalıdır.")).toBeInTheDocument();
    expect(screen.getByText("İletişim kurulabilmesi için onay vermelisiniz.")).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: /ad soyad/i })).toHaveAttribute(
      "aria-invalid",
      "true",
    );
  });

  it("shows the explicit development response after a successful submission", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          ok: true,
          mode: "development",
          delivered: false,
          message: "Form doğrulandı. Geliştirme modunda e-posta gönderilmedi.",
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        },
      ),
    );
    vi.stubGlobal("fetch", fetchMock);
    render(<ContactForm />);
    const user = await fillValidForm();

    await user.click(screen.getByRole("button", { name: /proje talebini gönder/i }));

    expect(
      await screen.findByText("Form doğrulandı. Geliştirme modunda e-posta gönderilmedi."),
    ).toHaveAttribute("role", "status");
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/contact",
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
      }),
    );
    expect(screen.getByRole("textbox", { name: /ad soyad/i })).toHaveValue("");
  });

  it("keeps the entered values and announces an API error", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            ok: false,
            message: "İletişim hizmeti şu anda kullanılamıyor.",
          }),
          {
            status: 503,
            headers: { "Content-Type": "application/json" },
          },
        ),
      ),
    );
    render(<ContactForm />);
    const user = await fillValidForm();

    await user.click(screen.getByRole("button", { name: /proje talebini gönder/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "İletişim hizmeti şu anda kullanılamıyor.",
    );
    await waitFor(() => {
      expect(screen.getByRole("button", { name: /proje talebini gönder/i })).toBeEnabled();
    });
    expect(screen.getByRole("textbox", { name: /ad soyad/i })).toHaveValue("Ayşe Yılmaz");
  });
});
