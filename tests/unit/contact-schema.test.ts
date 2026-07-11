import { contactFormSchema } from "@/lib/contact/schema";
import { describe, expect, it } from "vitest";

const validContactData = {
  name: "Ayşe Yılmaz",
  email: "ayse@example.com",
  phone: "+90 555 111 22 33",
  projectType: "interior-architecture",
  approximateArea: "120",
  budgetRange: "500k-1m",
  message: "Yeni evimizin yaşam alanları için tasarım desteği istiyoruz.",
  consent: true,
  website: "",
};

describe("contactFormSchema", () => {
  it("accepts a complete inquiry and trims text fields", () => {
    const result = contactFormSchema.safeParse({
      ...validContactData,
      name: "  Ayşe Yılmaz  ",
      email: "  ayse@example.com ",
    });

    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.data.name).toBe("Ayşe Yılmaz");
      expect(result.data.email).toBe("ayse@example.com");
    }
  });

  it("rejects invalid contact details and missing consent", () => {
    const result = contactFormSchema.safeParse({
      ...validContactData,
      email: "not-an-email",
      phone: "123",
      approximateArea: "-20",
      consent: false,
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      const fields = result.error.flatten().fieldErrors;

      expect(fields.email).toBeDefined();
      expect(fields.phone).toBeDefined();
      expect(fields.approximateArea).toBeDefined();
      expect(fields.consent).toBeDefined();
    }
  });

  it("rejects undeclared fields", () => {
    const result = contactFormSchema.safeParse({
      ...validContactData,
      privileged: true,
    });

    expect(result.success).toBe(false);
  });
});
