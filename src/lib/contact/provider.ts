import type { ContactSubmission } from "@/lib/contact/schema";

export interface ContactDeliveryResult {
  delivered: boolean;
  mode: "development" | "production";
}

export interface ContactProvider {
  send(submission: Readonly<ContactSubmission>): Promise<ContactDeliveryResult>;
}

const developmentContactProvider: ContactProvider = {
  async send() {
    return {
      delivered: false,
      mode: "development",
    };
  },
};

export function getContactProvider(): ContactProvider | null {
  if (process.env.NODE_ENV !== "production") {
    return developmentContactProvider;
  }

  // TODO(production): Replace this fallback with a transactional email provider that
  // keeps credentials server-side and reports delivery failures without exposing them.
  return null;
}
