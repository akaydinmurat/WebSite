import type { Metadata } from "next";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { FadeIn } from "@/components/animation/fade-in";
import { ParallaxMedia } from "@/components/animation/parallax-media";
import { ProjectVisual } from "@/components/projects/project-visual";
import { ProjectBreadcrumbJsonLd } from "@/components/seo";
import { fallbackProjects, getFallbackProjectBySlug } from "@/content/fallback-projects";
import { createProjectMetadata } from "@/lib/seo";

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return fallbackProjects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getFallbackProjectBySlug(slug);
  if (!project) return {};

  return createProjectMetadata(project);
}

export default async function ProjectDetailPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = getFallbackProjectBySlug(slug);
  if (!project) notFound();

  const relatedProject = getFallbackProjectBySlug(project.relatedProjectSlug);
  const year = project.facts.find((fact) => fact.id === "year")?.value;
  const location = project.facts.find((fact) => fact.id === "location")?.value;
  const projectType = project.facts.find((fact) => fact.id === "type")?.value;
  const additionalVisuals = project.gallery.filter(
    (visual) => !visual.src || visual.src !== project.cover.src,
  );

  return (
    <>
      <ProjectBreadcrumbJsonLd project={{ slug: project.slug, title: project.title }} />
      <article className="project-detail-page">
        <header className="project-detail-hero">
          <div className="site-shell">
            <div className="project-detail-masthead">
              <Link href="/projects" className="project-detail-back">
                <ArrowLeft aria-hidden="true" size={15} /> Proje seçkisi
              </Link>

              <div className="project-detail-heading">
                <p className="project-detail-kicker">Portföy Projesi · {year}</p>
                <h1>{project.title}</h1>
                <p className="project-detail-excerpt">{project.excerpt}</p>
              </div>
            </div>

            <figure className="project-detail-frame" aria-labelledby="project-visual-caption">
              <div className="project-detail-frame-bar" aria-hidden="true">
                <span>01 / Seçili mekân</span>
                <span>{location}</span>
              </div>
              <ParallaxMedia className="project-detail-frame-media">
                <ProjectVisual
                  visual={project.cover}
                  projectSlug={project.slug}
                  eager
                  sizes="(max-width: 768px) 100vw, (max-width: 1440px) 94vw, 1500px"
                  className="h-full w-full"
                />
              </ParallaxMedia>
              <figcaption id="project-visual-caption" className="project-detail-frame-caption">
                <span>Proje görünümü</span>
                <span>
                  {year} · {projectType}
                </span>
              </figcaption>
            </figure>
          </div>
        </header>

        <section className="project-detail-overview" aria-labelledby="project-overview-title">
          <div className="site-shell">
            <div className="project-detail-section-heading">
              <span aria-hidden="true">02</span>
              <p>Proje hakkında</p>
              <i aria-hidden="true" />
              <span>{String(project.facts.length).padStart(2, "0")} bilgi</span>
            </div>

            <div className="project-detail-overview-grid">
              <FadeIn className="project-detail-story-copy">
                <p className="eyebrow">{project.concept.eyebrow}</p>
                <h2 id="project-overview-title">{project.concept.title}</h2>
                <div className="project-detail-story-paragraphs">
                  {project.concept.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </FadeIn>

              <dl className="project-detail-facts">
                {project.facts.map((fact, index) => (
                  <div key={fact.id}>
                    <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                    <dt>{fact.label}</dt>
                    <dd>{fact.value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <aside className="project-detail-archive-note">
              <strong>Arşiv bilgisi</strong>
              <p>{project.demoNotice}</p>
            </aside>
          </div>
        </section>

        {additionalVisuals.length > 0 ? (
          <section className="project-detail-gallery" aria-label="Proje görselleri">
            <div className="site-shell">
              <div className="project-detail-section-heading">
                <span aria-hidden="true">03</span>
                <p>Görsel hikâye</p>
                <i aria-hidden="true" />
                <span>{String(additionalVisuals.length).padStart(2, "0")} kare</span>
              </div>
              <div className="project-detail-gallery-grid">
                {additionalVisuals.map((visual, index) => (
                  <FadeIn key={visual.id}>
                    <figure>
                      <ProjectVisual
                        visual={visual}
                        projectSlug={project.slug}
                        className="w-full"
                      />
                      <figcaption>
                        <span>{String(index + 1).padStart(2, "0")}</span>
                        <span>{visual.caption}</span>
                      </figcaption>
                    </figure>
                  </FadeIn>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        {project.materials.length > 0 ? (
          <section className="project-detail-materials" aria-labelledby="project-materials-title">
            <div className="site-shell">
              <div className="project-detail-section-heading">
                <span aria-hidden="true">04</span>
                <p>Malzeme paleti</p>
                <i aria-hidden="true" />
                <span>{String(project.materials.length).padStart(2, "0")} seçim</span>
              </div>
              <div className="project-detail-materials-grid">
                <div>
                  <p className="eyebrow">Malzeme Paleti</p>
                  <h2 id="project-materials-title">Dokunun sessiz katmanları.</h2>
                </div>
                <div className="project-detail-material-list">
                  {project.materials.map((material) => (
                    <article key={material.name}>
                      <span style={{ backgroundColor: material.swatch }} aria-hidden="true" />
                      <h3>{material.name}</h3>
                      <p>{material.description}</p>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </section>
        ) : null}

        {relatedProject ? (
          <section className="project-detail-next" aria-labelledby="next-project-title">
            <div className="site-shell">
              <div className="project-detail-section-heading">
                <span aria-hidden="true">→</span>
                <p>Sonraki proje</p>
                <i aria-hidden="true" />
                <span>Portföye devam et</span>
              </div>

              <Link
                href={`/projects/${relatedProject.slug}`}
                className="project-detail-next-link"
                data-cursor-label="Projeyi İncele"
              >
                <ProjectVisual
                  visual={relatedProject.cover}
                  projectSlug={relatedProject.slug}
                  sizes="(max-width: 768px) 100vw, 56vw"
                  className="project-detail-next-visual"
                />
                <div className="project-detail-next-copy">
                  <p className="eyebrow">Sıradaki mekân</p>
                  <h2 id="next-project-title">{relatedProject.title}</h2>
                  <p>{relatedProject.excerpt}</p>
                  <span className="text-link">
                    Projeyi incele <ArrowUpRight aria-hidden="true" size={15} />
                  </span>
                </div>
              </Link>
            </div>
          </section>
        ) : null}

        <section className="project-detail-cta" aria-labelledby="project-inquiry-title">
          <div className="site-shell project-detail-cta-inner">
            <p className="eyebrow">Yeni bir mekân</p>
            <h2 id="project-inquiry-title">{project.inquiryPrompt}</h2>
            <Link href={`/contact?project=${project.slug}`} className="pill-button">
              Proje talebi oluştur <ArrowUpRight aria-hidden="true" size={16} />
            </Link>
          </div>
        </section>
      </article>
    </>
  );
}
