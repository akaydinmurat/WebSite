import { POST } from "@/app/api/contact/route";
import { describe, expect, it } from "vitest";

const validRequestBody = {
  name: "Ayşe Yılmaz",
  email: "ayse@example.com",
  phone: "",
  projectType: "room-design",
  approximateArea: "35",
  budgetRange: "250k-500k",
  message: "Çalışma odamız için işlevsel ve sakin bir tasarım istiyoruz.",
  consent: true,
  website: "",
};

function createJsonRequest(body: object) {
  return new Request("http://localhost/api/contact", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
}

describe("POST /api/contact", () => {
  it("validates a submission without sending email outside production", async () => {
    const response = await POST(createJsonRequest(validRequestBody));
    const payload: unknown = await response.json();

    expect(response.status).toBe(200);
    expect(payload).toMatchObject({
      ok: true,
      mode: "development",
      delivered: false,
      message: expect.stringContaining("e-posta gönderilmedi"),
    });
    expect(response.headers.get("cache-control")).toBe("no-store");
  });

  it("returns field errors for an invalid submission", async () => {
    const response = await POST(
      createJsonRequest({
        ...validRequestBody,
        email: "invalid",
        message: "Kısa",
        consent: false,
      }),
    );
    const payload: unknown = await response.json();

    expect(response.status).toBe(422);
    expect(payload).toMatchObject({
      ok: false,
      errors: {
        email: expect.any(Array),
        message: expect.any(Array),
        consent: expect.any(Array),
      },
    });
  });

  it("silently discards a submission that fills the honeypot", async () => {
    const response = await POST(
      createJsonRequest({
        ...validRequestBody,
        website: "https://spam.example",
      }),
    );
    const payload: unknown = await response.json();

    expect(response.status).toBe(202);
    expect(payload).toEqual({
      ok: true,
      message: "Talebiniz alındı.",
    });
  });

  it("rejects oversized request bodies", async () => {
    const response = await POST(
      createJsonRequest({
        ...validRequestBody,
        message: "a".repeat(17_000),
      }),
    );

    expect(response.status).toBe(413);
  });

  it("rejects non-JSON requests", async () => {
    const response = await POST(
      new Request("http://localhost/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "text/plain",
        },
        body: "hello",
      }),
    );

    expect(response.status).toBe(415);
  });
});
