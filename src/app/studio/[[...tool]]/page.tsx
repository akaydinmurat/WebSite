import type { Metadata, Viewport } from "next";
import { metadata as studioMetadata, viewport as studioViewport } from "next-sanity/studio";

import { getSanityEnvStatus } from "@/sanity/env";
import { SanityStudio } from "@/sanity/studio/SanityStudio";

export const dynamic = "force-static";

export const metadata: Metadata = {
  ...studioMetadata,
  title: "İçerik Stüdyosu",
};

export const viewport: Viewport = {
  ...studioViewport,
  viewportFit: "cover",
};

const reasonMessages = {
  "missing-project-id":
    "Sanity proje kimliği henüz tanımlanmadığı için içerik stüdyosu devre dışı.",
  "invalid-project-id": "Sanity proje kimliğinin biçimi geçersiz. Ortam değişkenini kontrol edin.",
  "invalid-dataset": "Sanity veri kümesi adının biçimi geçersiz. Ortam değişkenini kontrol edin.",
  "invalid-api-version": "Sanity API sürümü YYYY-AA-GG biçiminde olmalı.",
} as const;

export default function StudioPage() {
  const status = getSanityEnvStatus();

  if (status.configured) {
    return <SanityStudio />;
  }

  return (
    <main
      style={{
        alignItems: "center",
        background: "#f2eee7",
        color: "#252421",
        display: "flex",
        minHeight: "100svh",
        padding: "clamp(1.5rem, 5vw, 5rem)",
      }}
    >
      <section style={{ maxWidth: "46rem" }} aria-labelledby="studio-setup-title">
        <p
          style={{
            fontSize: "0.75rem",
            letterSpacing: "0.16em",
            margin: "0 0 1rem",
            textTransform: "uppercase",
          }}
        >
          Göknur Uygur Akaydın
        </p>
        <h1
          id="studio-setup-title"
          style={{
            fontSize: "clamp(2rem, 7vw, 4.75rem)",
            fontWeight: 400,
            letterSpacing: "-0.045em",
            lineHeight: 0.96,
            margin: 0,
          }}
        >
          İçerik stüdyosu henüz etkin değil.
        </h1>
        <p style={{ fontSize: "1rem", lineHeight: 1.65, margin: "2rem 0 0" }}>
          {reasonMessages[status.reason]} Site, Sanity hesabı olmadan yerel içerikle çalışmaya devam
          eder ve üretim derlemesi bu nedenle kesilmez.
        </p>
        {process.env.NODE_ENV === "development" ? (
          <p style={{ fontSize: "0.875rem", lineHeight: 1.65, margin: "1rem 0 0" }}>
            Etkinleştirme adımları için <code>SANITY_SETUP.md</code> dosyasını izleyin ve{" "}
            <code>NEXT_PUBLIC_SANITY_PROJECT_ID</code> değişkenini <code>.env.local</code> içinde
            tanımlayın.
          </p>
        ) : null}
      </section>
    </main>
  );
}
