"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ChevronLeft, ChevronRight, Star } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from "react";

import { ShowroomCoreFallback } from "@/components/showroom/showroom-core-fallback";
import { siteConfig } from "@/config/site";
import { useFinePointer } from "@/hooks/use-pointer-capability";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import type { DesignPackage, GoogleReviewsResult, Project, Service } from "@/types";
import type { ShowroomScene } from "@/components/showroom/showroom-canvas";

const ShowroomCanvas = dynamic(
  () => import("@/components/showroom/showroom-canvas").then((module) => module.ShowroomCanvas),
  { ssr: false },
);

const validScenes = new Set<ShowroomScene>([
  "home",
  "projects",
  "services",
  "packages",
  "reviews",
  "about",
  "contact",
]);

const sceneMeta: Record<
  ShowroomScene,
  {
    index: string;
    eyebrow: string;
    title: string;
    description: string;
    archiveHref?: string;
    archiveLabel?: string;
  }
> = {
  home: {
    index: "00",
    eyebrow: "Yüksek Mimar · Mekânsal Deneyim",
    title: "Mekân, yaşamla anlam kazanır.",
    description:
      "Projeler, hizmetler ve tasarım kapsamları tek bir mekânsal sahnede; merkezde yaşayan bir mimari eşik etrafında yeniden konumlanır.",
  },
  projects: {
    index: "01",
    eyebrow: "Seçili Projeler",
    title: "Her proje, kendi yaşam biçiminin izini taşır.",
    description:
      "Tekerlek, sürükleme veya yön kontrolleriyle mevcut portföydeki gerçek tasarım görselleri arasında ilerleyin.",
    archiveHref: "/projects",
    archiveLabel: "Proje arşivini aç",
  },
  services: {
    index: "02",
    eyebrow: "Çalışma Alanları",
    title: "Her ihtiyaçta dönüşen tasarım.",
    description:
      "Her hizmet, merkezdeki mimari kurguyu ve çevresindeki çalışma katmanlarını farklı bir düzene dönüştürür.",
    archiveHref: "/services",
    archiveLabel: "Tüm hizmetleri incele",
  },
  packages: {
    index: "03",
    eyebrow: "Tasarım Kapsamları",
    title: "Doğru kapsam, projenin ilk net kararıdır.",
    description:
      "Yedi profesyonel kapsamı, merkez obje çevresinde dönen mekânsal dosyalar olarak karşılaştırın.",
    archiveHref: "/packages",
    archiveLabel: "Paketleri karşılaştır",
  },
  reviews: {
    index: "04",
    eyebrow: "Google Maps · Deneyimler",
    title: "Güven, deneyimle görünür.",
    description:
      "Gerçek Google Maps yorumları bağlantı tamamlandığında yazarı, tarihi ve kaynağıyla bu sahnede yer alır.",
  },
  about: {
    index: "05",
    eyebrow: "Göknur Uygur Akaydın",
    title: "Mimarlık, iç mekân ve dijital anlatı arasında.",
    description:
      "Estetik kararları, kullanıcı ihtiyaçlarını ve yaşanabilirliği ortak bir tasarım dili içinde buluşturan bağımsız bir pratik.",
    archiveHref: "/about",
    archiveLabel: "Göknur’u tanıyın",
  },
  contact: {
    index: "06",
    eyebrow: "Yeni Proje",
    title: "Yeni bir mekân, doğru soruyla başlar.",
    description:
      "Mekânınızı, ihtiyaçlarınızı ve hedeflediğiniz hissi paylaşın; uygun tasarım kapsamını birlikte şekillendirelim.",
    archiveHref: "/contact",
    archiveLabel: "Proje formunu aç",
  },
};

type ShowroomItem = Readonly<{
  id: string;
  kind: "portal" | "project" | "service" | "package" | "review" | "about" | "contact";
  kicker: string;
  title: string;
  summary: string;
  imageSrc?: string;
  imageAlt?: string;
  href?: string;
  actionLabel?: string;
  sceneTarget?: ShowroomScene;
  tags?: readonly string[];
  rating?: number;
  sourceHref?: string;
  reportHref?: string;
}>;

type OrbitStyle = CSSProperties & {
  "--card-order": number;
};

type DragState = {
  active: boolean;
  pointerId: number;
  startX: number;
  currentX: number;
};

export function ImmersiveShowroom({
  initialScene,
  projects,
  services,
  packages,
  reviews,
}: {
  initialScene: ShowroomScene;
  projects: readonly Project[];
  services: readonly Service[];
  packages: readonly DesignPackage[];
  reviews: GoogleReviewsResult;
}) {
  const rootRef = useRef<HTMLElement>(null);
  const sceneHeadingRef = useRef<HTMLHeadingElement>(null);
  const sceneMountedRef = useRef(false);
  const dragFrameRef = useRef<number | null>(null);
  const dragRef = useRef<DragState>({ active: false, pointerId: -1, startX: 0, currentX: 0 });
  const wheelRef = useRef({ accumulated: 0, lastChange: 0 });
  const [activeScene, setActiveScene] = useState<ShowroomScene>(initialScene);
  const [activeIndex, setActiveIndex] = useState(0);
  const [webglReady, setWebglReady] = useState(false);
  const reducedMotion = useReducedMotion();
  const finePointer = useFinePointer();
  const meta = sceneMeta[activeScene];

  const items = useMemo(
    () => createSceneItems(activeScene, projects, services, packages, reviews),
    [activeScene, packages, projects, reviews, services],
  );

  const selectScene = useCallback((scene: ShowroomScene, historyMode: "push" | "none" = "push") => {
    setActiveScene(scene);
    setActiveIndex(0);

    if (historyMode === "push") {
      const href = scene === "home" ? "/" : `/?scene=${scene}`;
      const currentHref = `${window.location.pathname}${window.location.search}`;
      if (currentHref !== href) window.history.pushState({ scene }, "", href);
    }
  }, []);

  const moveToIndex = useCallback(
    (nextIndex: number) => {
      if (items.length < 2) return;
      const normalized = (nextIndex + items.length) % items.length;
      setActiveIndex(normalized);
    },
    [items.length],
  );

  const moveBy = useCallback(
    (direction: number) => {
      setActiveIndex((current) => {
        if (items.length < 2) return current;
        return (current + direction + items.length) % items.length;
      });
    },
    [items.length],
  );

  useEffect(() => {
    const body = document.body;
    const previousActive = body.getAttribute("data-showroom-active");
    const previousScene = body.getAttribute("data-showroom-scene");
    const siteFooter = document.querySelector<HTMLElement>("[data-site-footer]");
    const footerHadInert = siteFooter?.hasAttribute("inert") ?? false;

    body.setAttribute("data-showroom-active", "true");
    siteFooter?.setAttribute("inert", "");

    const handleSceneLink = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey
      ) {
        return;
      }

      const target = event.target instanceof Element ? event.target : null;
      const anchor = target?.closest<HTMLAnchorElement>("a[href]");
      if (!anchor || anchor.target || anchor.hasAttribute("download")) return;

      const url = new URL(anchor.href, window.location.href);
      if (url.origin !== window.location.origin || url.pathname !== "/") return;

      const nextScene = getSceneFromValue(url.searchParams.get("scene"));
      if (!nextScene) return;

      event.preventDefault();
      selectScene(nextScene);
    };

    const handlePopState = () => {
      selectScene(
        getSceneFromValue(new URLSearchParams(window.location.search).get("scene")),
        "none",
      );
    };

    document.addEventListener("click", handleSceneLink, true);
    window.addEventListener("popstate", handlePopState);

    return () => {
      document.removeEventListener("click", handleSceneLink, true);
      window.removeEventListener("popstate", handlePopState);
      if (previousActive === null) body.removeAttribute("data-showroom-active");
      else body.setAttribute("data-showroom-active", previousActive);
      if (previousScene === null) body.removeAttribute("data-showroom-scene");
      else body.setAttribute("data-showroom-scene", previousScene);
      if (!footerHadInert) siteFooter?.removeAttribute("inert");
      if (dragFrameRef.current !== null) cancelAnimationFrame(dragFrameRef.current);
    };
  }, [selectScene]);

  useEffect(() => {
    document.body.setAttribute("data-showroom-scene", activeScene);

    if (sceneMountedRef.current) {
      sceneHeadingRef.current?.focus({ preventScroll: true });
    } else {
      sceneMountedRef.current = true;
    }
  }, [activeScene]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target instanceof Element ? event.target : null;
      if (
        target?.closest("input, textarea, select, [contenteditable='true'], [data-showroom-scroll]")
      ) {
        return;
      }

      if (event.key === "ArrowRight") moveBy(1);
      else if (event.key === "ArrowLeft") moveBy(-1);
      else if (event.key === "Home") moveToIndex(0);
      else if (event.key === "End") moveToIndex(Math.max(0, items.length - 1));
      else return;

      event.preventDefault();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [items.length, moveBy, moveToIndex]);

  function handleWheel(event: React.WheelEvent<HTMLElement>) {
    if (items.length < 2 || event.ctrlKey || event.metaKey) return;
    const target = event.target instanceof Element ? event.target : null;
    if (target?.closest("input, textarea, select, [data-showroom-scroll]")) return;

    const now = performance.now();
    if (now - wheelRef.current.lastChange < 420) return;
    wheelRef.current.accumulated +=
      Math.abs(event.deltaY) > Math.abs(event.deltaX) ? event.deltaY : event.deltaX;

    if (Math.abs(wheelRef.current.accumulated) < 70) return;
    moveBy(wheelRef.current.accumulated > 0 ? 1 : -1);
    wheelRef.current = { accumulated: 0, lastChange: now };
  }

  function handlePointerDown(event: React.PointerEvent<HTMLElement>) {
    const target = event.target instanceof Element ? event.target : null;
    if (target?.closest("a, button, input, textarea, select")) return;

    dragRef.current = {
      active: true,
      pointerId: event.pointerId,
      startX: event.clientX,
      currentX: event.clientX,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
    event.currentTarget.dataset.dragging = "true";
  }

  function handlePointerMove(event: React.PointerEvent<HTMLElement>) {
    const drag = dragRef.current;
    if (!drag.active || drag.pointerId !== event.pointerId) return;
    drag.currentX = event.clientX;
    if (dragFrameRef.current !== null) return;

    dragFrameRef.current = requestAnimationFrame(() => {
      dragFrameRef.current = null;
      const distance = Math.max(
        -120,
        Math.min(120, dragRef.current.currentX - dragRef.current.startX),
      );
      rootRef.current?.style.setProperty("--showroom-drag", `${distance}px`);
    });
  }

  function finishDrag(event: React.PointerEvent<HTMLElement>) {
    const drag = dragRef.current;
    if (!drag.active || drag.pointerId !== event.pointerId) return;
    const distance = drag.currentX - drag.startX;
    if (Math.abs(distance) >= 46) moveBy(distance < 0 ? 1 : -1);
    dragRef.current.active = false;
    rootRef.current?.style.setProperty("--showroom-drag", "0px");
    delete event.currentTarget.dataset.dragging;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }

  const activeItem = items[activeIndex];
  const shouldRenderWebgl = finePointer && !reducedMotion;

  return (
    <section
      ref={rootRef}
      className="immersive-showroom"
      data-cursor-theme="dark"
      data-scene={activeScene}
      data-webgl-ready={webglReady ? "true" : "false"}
      onPointerCancel={finishDrag}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={finishDrag}
      onWheel={handleWheel}
      aria-labelledby="showroom-scene-title"
      data-home-content
    >
      <div className="showroom-world" aria-hidden="true">
        <span className="showroom-grid showroom-grid-back" />
        <span className="showroom-grid showroom-grid-left" />
        <span className="showroom-grid showroom-grid-right" />
        <span className="showroom-grid showroom-grid-floor" />
        <span className="showroom-ambient-light" />
        <span className="showroom-pointer-field" />
        <span className="showroom-axis showroom-axis-x" />
        <span className="showroom-axis showroom-axis-y" />
      </div>

      <div className="showroom-core-layer" aria-hidden="true">
        <ShowroomCoreFallback />
        {shouldRenderWebgl ? (
          <ShowroomCanvas className="showroom-canvas" scene={activeScene} onReady={setWebglReady} />
        ) : null}
      </div>

      <div
        className="showroom-orbit"
        data-scene={activeScene}
        aria-label={`${meta.eyebrow} kartları`}
        role="group"
      >
        {items.map((item, index) => {
          const slot = getOrbitSlot(index, activeIndex, items.length);
          const isActive = slot === 0;

          return (
            <ShowroomCard
              key={`${activeScene}-${item.id}`}
              active={isActive}
              item={item}
              onSceneSelect={selectScene}
              order={index}
              slot={slot}
            />
          );
        })}
      </div>

      <div className="showroom-scene-copy">
        <p className="showroom-scene-eyebrow">
          <span>{meta.index}</span>
          {meta.eyebrow}
        </p>
        <h1 ref={sceneHeadingRef} id="showroom-scene-title" tabIndex={-1}>
          {meta.title}
        </h1>
        <p className="showroom-scene-description">{meta.description}</p>
        {meta.archiveHref && meta.archiveLabel ? (
          <Link href={meta.archiveHref} className="showroom-scene-link" data-cursor-kind="action">
            {meta.archiveLabel} <ArrowUpRight aria-hidden="true" size={15} />
          </Link>
        ) : null}
      </div>

      <div className="showroom-hud" aria-hidden="true">
        <span className="showroom-hud-label">Mekânsal Eşik / {meta.index}</span>
        <span className="showroom-hud-orbit">
          <i />
          <i />
          <i />
        </span>
        <span className="showroom-hud-scene">{activeScene.toLocaleUpperCase("tr-TR")}</span>
      </div>

      {items.length > 1 ? (
        <div className="showroom-controls" aria-label="Sahne kartı kontrolleri" role="group">
          <button
            type="button"
            onClick={() => moveBy(-1)}
            aria-label="Önceki kart"
            data-cursor-kind="action"
          >
            <ChevronLeft aria-hidden="true" size={18} />
          </button>
          <span aria-hidden="true">
            {String(activeIndex + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
          </span>
          <button
            type="button"
            onClick={() => moveBy(1)}
            aria-label="Sonraki kart"
            data-cursor-kind="action"
          >
            <ChevronRight aria-hidden="true" size={18} />
          </button>
        </div>
      ) : null}

      <p className="showroom-live-status" aria-live="polite">
        {activeItem
          ? `${String(activeIndex + 1).padStart(2, "0")} / ${String(items.length).padStart(2, "0")} — ${activeItem.title}`
          : ""}
      </p>

      <p className="showroom-instruction" aria-hidden="true">
        <span>Fare ile mekânı yönlendir</span>
        <span>Tekerlek / sürükle ile kartları döndür</span>
      </p>

      <nav className="showroom-socials" aria-label="Sosyal medya">
        {siteConfig.socialLinks.map((link) => (
          <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer">
            {link.label} <ArrowUpRight aria-hidden="true" size={12} />
          </a>
        ))}
      </nav>
    </section>
  );
}

function ShowroomCard({
  item,
  active,
  order,
  slot,
  onSceneSelect,
}: {
  item: ShowroomItem;
  active: boolean;
  order: number;
  slot: number;
  onSceneSelect: (scene: ShowroomScene) => void;
}) {
  const style = { "--card-order": order } as OrbitStyle;

  return (
    <article
      className="showroom-card"
      data-active={active ? "true" : "false"}
      data-kind={item.kind}
      data-slot={getSlotName(slot)}
      style={style}
      aria-hidden={!active}
      inert={!active}
    >
      {item.imageSrc ? (
        <div className="showroom-card-media">
          <Image
            src={item.imageSrc}
            alt={active ? (item.imageAlt ?? "") : ""}
            fill
            preload={active && item.kind === "portal"}
            sizes="(max-width: 767px) 88vw, 48vw"
            className="object-cover"
          />
        </div>
      ) : (
        <div className="showroom-card-abstract" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
      )}

      <div className="showroom-card-shade" aria-hidden="true" />
      <div className="showroom-card-content">
        <header>
          <span>{String(order + 1).padStart(2, "0")}</span>
          <span>{item.kicker}</span>
        </header>

        <div className="showroom-card-copy">
          {item.rating ? (
            <p className="showroom-card-rating" aria-label={`5 üzerinden ${item.rating}`}>
              <Star aria-hidden="true" size={14} fill="currentColor" /> {item.rating.toFixed(1)} / 5
            </p>
          ) : null}
          <h2>{item.title}</h2>
          <p>{item.summary}</p>
          {item.tags?.length ? (
            <ul aria-label="Öne çıkan kapsamlar">
              {item.tags.slice(0, 3).map((tag) => (
                <li key={tag}>{tag}</li>
              ))}
            </ul>
          ) : null}
        </div>

        <footer>
          {item.sceneTarget ? (
            <button
              type="button"
              onClick={() => onSceneSelect(item.sceneTarget!)}
              data-cursor-kind="action"
            >
              Sahneyi aç <ArrowUpRight aria-hidden="true" size={14} />
            </button>
          ) : item.href ? (
            <Link href={item.href} data-cursor-kind="action">
              {item.actionLabel ?? "İncele"} <ArrowUpRight aria-hidden="true" size={14} />
            </Link>
          ) : null}
          {item.sourceHref ? (
            <a href={item.sourceHref} target="_blank" rel="noopener noreferrer">
              Google Maps <ArrowUpRight aria-hidden="true" size={13} />
            </a>
          ) : null}
          {item.reportHref ? (
            <a href={item.reportHref} target="_blank" rel="noopener noreferrer">
              Bildir
            </a>
          ) : null}
        </footer>
      </div>
    </article>
  );
}

function createSceneItems(
  scene: ShowroomScene,
  projects: readonly Project[],
  services: readonly Service[],
  packages: readonly DesignPackage[],
  reviews: GoogleReviewsResult,
): readonly ShowroomItem[] {
  const imageAt = (index: number) => projects[index % Math.max(projects.length, 1)]?.cover.src;

  if (scene === "home") {
    return [
      {
        id: "projects-portal",
        kind: "portal",
        kicker: "01 / Projeler",
        title: "Yaşanmış mekânlar",
        summary: "Gerçek proje görselleri çevresel bir seçkiye dönüşür.",
        imageSrc: imageAt(0),
        imageAlt: "B.M. Evi mutfak tasarımı",
        sceneTarget: "projects",
      },
      {
        id: "services-portal",
        kind: "portal",
        kicker: "02 / Hizmetler",
        title: "Dönüşen çalışma alanları",
        summary: "Her hizmet, merkezdeki mimari eşiği başka bir kurguya açar.",
        imageSrc: imageAt(7),
        imageAlt: "Rozzi's Chocolate & Cafe iç mekân tasarımı",
        sceneTarget: "services",
      },
      {
        id: "packages-portal",
        kind: "portal",
        kicker: "03 / Paketler",
        title: "Net tasarım kapsamları",
        summary: "İhtiyacınıza uygun dosyayı mekânsal katalog içinde bulun.",
        imageSrc: imageAt(2),
        imageAlt: "A.A. Evi yatak odası tasarımı",
        sceneTarget: "packages",
      },
    ];
  }

  if (scene === "projects") {
    return projects.map((project) => ({
      id: project.slug,
      kind: "project",
      kicker: [getProjectFact(project, "year"), getProjectFact(project, "location")]
        .filter(Boolean)
        .join(" · "),
      title: project.title,
      summary: project.excerpt,
      imageSrc: project.cover.src,
      imageAlt: project.cover.alt,
      href: `/projects/${project.slug}`,
      actionLabel: "Projeyi aç",
      tags: [getProjectFact(project, "type")].filter(Boolean),
    }));
  }

  if (scene === "services") {
    return services.map((service, index) => ({
      id: service.slug,
      kind: "service",
      kicker: service.eyebrow,
      title: service.title,
      summary: service.summary,
      imageSrc: imageAt(index),
      imageAlt: `${service.title} için mevcut portföyden temsili mekân görseli`,
      href: `/services#${service.slug}`,
      actionLabel: "Hizmeti incele",
      tags: service.deliverables.slice(0, 3),
    }));
  }

  if (scene === "packages") {
    return packages.map((designPackage, index) => ({
      id: designPackage.slug,
      kind: "package",
      kicker: designPackage.scopeLabel,
      title: designPackage.title,
      summary: designPackage.summary,
      imageSrc: imageAt(index + 1),
      imageAlt: `${designPackage.title} kapsamını temsil eden mevcut portföy görseli`,
      href: designPackage.inquiry.href,
      actionLabel: "Kapsamı görüş",
      tags: [...(designPackage.presentationFormats ?? []), ...designPackage.scopeItems].slice(0, 3),
    }));
  }

  if (scene === "reviews") {
    if (reviews.status === "ready") {
      return reviews.reviews.map((review) => ({
        id: review.resourceName,
        kind: "review",
        kicker: `${review.author.displayName} · ${review.relativePublishTime}`,
        title: review.author.displayName,
        summary: review.text,
        rating: review.rating,
        sourceHref: review.googleMapsUrl,
        reportHref: review.reportUrl,
      }));
    }

    return [
      {
        id: "verified-source",
        kind: "review",
        kicker: "Google Maps / 01",
        title: "Resmî kaynaktan",
        summary:
          "Yalnızca işletmenin doğrulanmış Google Maps kaydından alınan yorumlar gösterilir.",
      },
      {
        id: "author-attribution",
        kind: "review",
        kicker: "Google Maps / 02",
        title: "Yazarıyla birlikte",
        summary: "Yorum metni, puanı, tarihi ve zorunlu yazar atfı aynı cam plakada yer alır.",
      },
      {
        id: "transparent-source",
        kind: "review",
        kicker: "Google Maps / 03",
        title: "Güncel ve şeffaf",
        summary: "Kaynak ve bildirme bağlantıları korunur; sahte müşteri yorumu üretilmez.",
      },
    ];
  }

  if (scene === "about") {
    return [
      {
        id: "practice",
        kind: "about",
        kicker: "Bağımsız Pratik / Ankara",
        title: "İnsanla başlayan mimarlık",
        summary:
          "Her projeyi kullanıcı alışkanlıkları, dolaşım, işlev ve hedeflenen his üzerinden ele alıyorum.",
        imageSrc: imageAt(5),
        imageAlt: "G.Y. Evi salon tasarımı",
        href: "/about",
        actionLabel: "Yaklaşımı incele",
      },
      {
        id: "discipline",
        kind: "about",
        kicker: "Mimarlık · İç Mekân",
        title: "Estetik ve işlev arasında",
        summary:
          "Mimarlık ve iç mekân deneyimini, kişisel tasarım yaklaşımıyla yaşanabilir bir bütünlükte buluşturuyorum.",
        imageSrc: imageAt(1),
        imageAlt: "E.S. Evi banyo tasarımı",
        href: "/about",
        actionLabel: "Göknur’u tanıyın",
      },
      {
        id: "digital-story",
        kind: "about",
        kicker: "Dijital Anlatı",
        title: "Tasarımdan anlatıya",
        summary:
          "Mekânsal düşünceyi görselleştirme ve dijital içerik üretimiyle farklı platformlara taşıyorum.",
        imageSrc: imageAt(7),
        imageAlt: "Rozzi's Chocolate & Cafe tasarımı",
        href: "/about",
        actionLabel: "Hakkımda",
      },
    ];
  }

  return [
    {
      id: "start-project",
      kind: "contact",
      kicker: `${siteConfig.contact.location} · Yeni Proje`,
      title: "Projenizi anlatın.",
      summary: siteConfig.contact.availabilityText,
      imageSrc: imageAt(0),
      imageAlt: "B.M. Evi mutfak tasarımı",
      href: "/contact",
      actionLabel: "Proje formunu aç",
      tags: [siteConfig.contact.email ?? "E-posta ile iletişim", "Konut", "Ticari mekân"],
    },
  ];
}

function getProjectFact(project: Project, id: "type" | "location" | "year") {
  return project.facts.find((fact) => fact.id === id)?.value ?? "";
}

function getSceneFromValue(value: string | null): ShowroomScene {
  return value && validScenes.has(value as ShowroomScene) ? (value as ShowroomScene) : "home";
}

function getOrbitSlot(index: number, activeIndex: number, count: number) {
  if (count <= 1) return 0;
  let distance = index - activeIndex;
  if (distance > count / 2) distance -= count;
  if (distance < -count / 2) distance += count;
  return Math.max(-3, Math.min(3, distance));
}

function getSlotName(slot: number) {
  if (slot === 0) return "active";
  if (slot === -1) return "previous";
  if (slot === 1) return "next";
  if (slot < -1) return "far-previous";
  if (slot > 1) return "far-next";
  return "hidden";
}
