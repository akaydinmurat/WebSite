"use client";

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="site-shell flex min-h-[80svh] flex-col justify-end pt-40 pb-20">
      <p className="eyebrow mb-8">Beklenmeyen Durum</p>
      <h1 className="page-title mb-8 max-w-[11ch]">Bu sahne şu anda görüntülenemiyor.</h1>
      <p className="mb-10 max-w-xl text-[var(--color-muted)]">
        Sayfayı güvenli biçimde yeniden yüklemek için tekrar deneyebilirsiniz.
      </p>
      <button type="button" onClick={reset} className="pill-button w-fit">
        Tekrar Dene
      </button>
    </main>
  );
}
