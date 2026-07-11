import { ArrowUpRight, Flag, Star } from "lucide-react";

import { getGoogleReviews } from "@/lib/google-places/fetch-reviews";
import type { GoogleReview, GoogleReviewPlace } from "@/types/google-reviews";

const reviewPolicyUrl = "https://support.google.com/contributionpolicy/answer/7422880";
const stars = [1, 2, 3, 4, 5] as const;

export async function GoogleReviews() {
  const result = await getGoogleReviews();

  if (result.status === "disabled" || result.status === "unconfigured") {
    return process.env.NODE_ENV === "production" ? null : <ReviewsSetup />;
  }

  if (result.status === "unavailable") {
    return result.fallbackUrl ? <ReviewsFallback href={result.fallbackUrl} /> : null;
  }

  if (result.status === "empty") {
    const href = result.place.googleMapsUrl;

    return href ? <ReviewsFallback href={href} place={result.place} /> : null;
  }

  return (
    <section
      aria-labelledby="google-reviews-title"
      className="google-reviews-section section-space bg-[var(--color-paper)]"
      data-cursor-theme="light"
      data-home-scene="reviews"
    >
      <div className="site-shell">
        <div className="editorial-grid items-end gap-y-10">
          <div className="col-span-12 md:col-span-8">
            <p className="eyebrow mb-7">Google Maps · Değerlendirmeler</p>
            <h2 id="google-reviews-title" className="section-title max-w-[13ch]">
              Deneyimi, onu yaşayanlardan dinleyin.
            </h2>
          </div>
          <div className="col-span-12 md:col-span-4">
            <PlaceRating place={result.place} />
          </div>
        </div>

        <div className="mt-20 grid gap-px bg-[var(--color-border)] lg:grid-cols-2">
          {result.reviews.map((review) => (
            <ReviewCard key={review.resourceName} review={review} />
          ))}
        </div>

        <footer className="mt-8 grid gap-5 border-t border-[var(--color-border-strong)] pt-6 text-xs leading-relaxed text-[var(--color-muted)] md:grid-cols-[1fr_auto]">
          <div className="max-w-3xl space-y-2">
            <p>
              Değerlendirmeler <span translate="no">Google Maps</span> tarafından alaka düzeyine
              göre sıralanır; API en fazla beş yorum döndürür.
            </p>
            <p>
              Google yorumları doğrulamaz; politika ihlali tespit edilen içerikler incelenip
              kaldırılabilir.{" "}
              <a
                href={reviewPolicyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-4"
              >
                İçerik politikasını inceleyin
                <span className="sr-only">, yeni sekmede açılır</span>
              </a>
              .
            </p>
            {result.providerAttributions.length > 0 ? (
              <p>
                Veri sağlayıcıları:{" "}
                {result.providerAttributions.map((attribution, index) => (
                  <span key={attribution.provider + "-" + attribution.providerUrl}>
                    {index > 0 ? ", " : null}
                    <a
                      href={attribution.providerUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline underline-offset-4"
                    >
                      {attribution.provider}
                    </a>
                  </span>
                ))}
              </p>
            ) : null}
          </div>
          <GoogleMapsAttribution href={result.place.googleMapsUrl} />
        </footer>
      </div>
    </section>
  );
}

export { GoogleReviews as GoogleReviewsSection };

function ReviewCard({ review }: { review: GoogleReview }) {
  return (
    <article className="flex min-h-[30rem] flex-col bg-[var(--color-paper)] p-6 sm:p-8 lg:p-10">
      <header className="mb-10 flex items-center justify-between gap-5">
        <a
          href={review.author.profileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex min-w-0 items-center gap-3"
          aria-label={review.author.displayName + " adlı yorum yazarının Google Maps profilini aç"}
        >
          {review.author.photoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element -- Places content must be served directly; image optimization would persistently cache it.
            <img
              src={review.author.photoUrl}
              alt=""
              width={42}
              height={42}
              loading="lazy"
              decoding="async"
              referrerPolicy="no-referrer"
              className="size-10 shrink-0 rounded-full bg-[var(--color-sand)] object-cover"
            />
          ) : (
            <span
              aria-hidden="true"
              className="grid size-10 shrink-0 place-items-center rounded-full bg-[var(--color-sand)] font-serif text-sm"
            >
              {getInitials(review.author.displayName)}
            </span>
          )}
          <span className="truncate font-medium">{review.author.displayName}</span>
        </a>
        <span className="shrink-0 text-xs text-[var(--color-muted)]">
          {review.relativePublishTime}
        </span>
      </header>

      <ReviewRating rating={review.rating} />
      <blockquote className="mt-7 font-serif text-[clamp(1.45rem,2.4vw,2.15rem)] leading-[1.28] tracking-[-0.025em] whitespace-pre-line">
        “{review.text}”
      </blockquote>

      {review.isTranslated && review.originalText ? (
        <details className="mt-7 border-t border-[var(--color-border)] pt-4 text-sm text-[var(--color-ink-soft)]">
          <summary className="cursor-pointer font-medium">Orijinal metni göster</summary>
          <p className="mt-3 whitespace-pre-line">{review.originalText}</p>
          <p className="mt-2 text-xs text-[var(--color-muted)]">Google tarafından çevrilmiştir.</p>
        </details>
      ) : null}

      <footer className="mt-auto flex flex-wrap items-end justify-between gap-5 border-t border-[var(--color-border)] pt-6 text-xs">
        <div className="space-y-1 text-[var(--color-muted)]">
          <time dateTime={review.publishTime}>{review.relativePublishTime}</time>
          {review.visitDate ? <p>Ziyaret: {formatVisitDate(review.visitDate)}</p> : null}
        </div>
        <div className="flex flex-wrap gap-x-5 gap-y-3">
          <a
            href={review.googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-link"
          >
            Google Maps’te görüntüle <ArrowUpRight aria-hidden="true" size={14} />
            <span className="sr-only">, yeni sekmede açılır</span>
          </a>
          <a
            href={review.reportUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-[var(--color-muted)] underline underline-offset-4"
          >
            <Flag aria-hidden="true" size={13} /> İçeriği bildir
            <span className="sr-only">, yeni sekmede açılır</span>
          </a>
        </div>
      </footer>
    </article>
  );
}

function ReviewRating({ rating }: { rating: number }) {
  const label = "5 üzerinden " + formatRating(rating);

  return (
    <div className="flex items-center gap-1 text-[var(--color-accent-warm)]" aria-label={label}>
      {stars.map((star) => (
        <Star
          key={star}
          aria-hidden="true"
          size={17}
          fill={star <= rating ? "currentColor" : "none"}
          className={star <= rating ? undefined : "opacity-35"}
        />
      ))}
      <span className="sr-only">{label}</span>
    </div>
  );
}

function PlaceRating({ place }: { place: GoogleReviewPlace }) {
  if (place.rating === undefined && place.reviewCount === undefined) return null;

  return (
    <div className="border-t border-[var(--color-border-strong)] pt-5">
      {place.rating === undefined ? null : (
        <p className="font-serif text-5xl tracking-[-0.045em]">{formatRating(place.rating)} / 5</p>
      )}
      {place.reviewCount === undefined ? null : (
        <p className="mt-2 text-sm text-[var(--color-muted)]">
          {place.reviewCount.toLocaleString("tr-TR")} Google değerlendirmesi
        </p>
      )}
    </div>
  );
}

function ReviewsFallback({ href, place }: { href: string; place?: GoogleReviewPlace }) {
  return (
    <section
      aria-labelledby="google-reviews-fallback-title"
      className="google-reviews-section section-space-sm bg-[var(--color-paper)]"
      data-cursor-theme="light"
      data-home-scene="reviews"
    >
      <div className="site-shell">
        <div className="editorial-grid items-end gap-y-8 border-t border-[var(--color-border-strong)] pt-8">
          <div className="col-span-12 md:col-span-7">
            <p className="eyebrow mb-5">Google Maps · Değerlendirmeler</p>
            <h2 id="google-reviews-fallback-title" className="section-title max-w-[13ch]">
              Google Maps değerlendirmelerini inceleyin.
            </h2>
          </div>
          <div className="col-span-12 md:col-span-4 md:col-start-9">
            {place ? <PlaceRating place={place} /> : null}
            <a href={href} target="_blank" rel="noopener noreferrer" className="text-link mt-6">
              Google Maps’te görüntüleyin <ArrowUpRight aria-hidden="true" size={15} />
              <span className="sr-only">, yeni sekmede açılır</span>
            </a>
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <GoogleMapsAttribution href={href} />
        </div>
      </div>
    </section>
  );
}

function ReviewsSetup() {
  const principles = [
    {
      title: "Resmî kaynaktan",
      description: "Yalnızca işletmenin doğrulanmış Google Maps kaydından alınan içerik.",
    },
    {
      title: "Yazarıyla birlikte",
      description: "Yorum metni, puanı, tarihi ve zorunlu yazar atfı tek kartta.",
    },
    {
      title: "Güncel ve şeffaf",
      description: "Kalıcı kopya tutulmadan, kaynak ve bildirme bağlantılarıyla sunum.",
    },
  ] as const;

  return (
    <section
      aria-labelledby="google-reviews-setup-title"
      className="google-reviews-section reviews-setup section-space"
      data-cursor-theme="light"
      data-home-scene="reviews"
    >
      <div className="site-shell section-frame">
        <div className="reviews-setup-heading editorial-grid gap-y-8">
          <p className="eyebrow col-span-12 md:col-span-3">Google Maps · Müşteri Deneyimleri</p>
          <div className="col-span-12 md:col-span-8 md:col-start-5">
            <h2 id="google-reviews-setup-title" className="section-title max-w-[13ch]">
              Güveni, doğrulanabilir deneyim görünür kılar.
            </h2>
            <p className="body-large mt-7 max-w-[40rem]">
              Bu alan gerçek Google Maps yorumlarını, kaynağı ve yazarıyla birlikte göstermek için
              hazırlandı. Yayında yalnızca doğrulanmış işletme bağlantısı kullanılır.
            </p>
          </div>
        </div>

        <ol className="reviews-setup-principles">
          {principles.map((principle, index) => (
            <li key={principle.title}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h3>{principle.title}</h3>
              <p>{principle.description}</p>
            </li>
          ))}
        </ol>

        <p className="reviews-setup-note">
          <span>Bağlantı durumu</span>
          <strong>İşletme Place ID’si ve sunucu anahtarı bekleniyor</strong>
        </p>
      </div>
    </section>
  );
}

function GoogleMapsAttribution({ href }: { href?: string }) {
  const label = (
    <span className="font-medium tracking-normal whitespace-nowrap" translate="no">
      Google Maps
    </span>
  );

  return href ? (
    <a href={href} target="_blank" rel="noopener noreferrer" aria-label="Google Maps">
      {label}
    </a>
  ) : (
    <span aria-label="Google Maps">{label}</span>
  );
}

function formatRating(rating: number) {
  return new Intl.NumberFormat("tr-TR", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(rating);
}

function formatVisitDate(visitDate: { month: number; year: number }) {
  return new Intl.DateTimeFormat("tr-TR", { month: "long", year: "numeric" }).format(
    new Date(Date.UTC(visitDate.year, visitDate.month - 1, 1)),
  );
}

function getInitials(displayName: string) {
  return displayName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toLocaleUpperCase("tr-TR"))
    .join("");
}
