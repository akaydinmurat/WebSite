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

  return (
    <main>
      <ProjectBreadcrumbJsonLd project={{ slug: project.slug, title: project.title }} />
      <header className="relative min-h-[100svh] bg-[var(--color-night)] text-[var(--color-paper)]">
        <ParallaxMedia className="absolute inset-0">
          <ProjectVisual
            visual={project.cover}
            projectSlug={project.slug}
            eager
            className="h-[112%] w-full"
          />
        </ParallaxMedia>
        <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(16,17,16,.86),rgba(16,17,16,.12)_70%)]" />
        <div className="site-shell relative z-10 flex min-h-[100svh] flex-col justify-end pt-40 pb-9">
          <Link
            href="/projects"
            className="mb-12 flex min-h-11 w-fit items-center gap-3 text-[0.67rem] font-semibold tracking-[0.13em] text-white/70 uppercase"
          >
            <ArrowLeft aria-hidden="true" size={15} /> Proje seçkisi
          </Link>
          <div className="editorial-grid gap-y-9">
            <div className="col-span-12 md:col-span-9">
              <p className="mb-6 text-[0.65rem] font-semibold tracking-[0.16em] text-white/65 uppercase">
                Kavramsal Demo Proje
              </p>
              <h1 className="page-title max-w-[12ch]">{project.title}</h1>
            </div>
            <p className="col-span-12 max-w-lg text-lg text-white/76 md:col-span-4 md:col-start-9">
              {project.excerpt}
            </p>
          </div>
        </div>
      </header>

      <section className="section-space-sm">
        <div className="site-shell">
          <div className="mb-20 border border-[var(--color-border)] p-5 text-sm text-[var(--color-ink-soft)]">
            <strong className="mr-2 font-semibold text-[var(--color-ink)]">Demo içerik:</strong>
            {project.demoNotice}
          </div>
          <div className="editorial-grid gap-y-12">
            <p className="eyebrow col-span-12 md:col-span-3">Proje Özeti</p>
            <div className="col-span-12 md:col-span-8 md:col-start-5">
              <h2 className="section-title mb-12 max-w-[13ch]">{project.description}</h2>
              <dl className="grid gap-x-8 gap-y-7 border-t border-[var(--color-border)] pt-6 sm:grid-cols-2 lg:grid-cols-3">
                {project.facts.map((fact) => (
                  <div key={fact.id}>
                    <dt className="mb-1 text-[0.61rem] font-semibold tracking-[0.13em] text-[var(--color-muted)] uppercase">
                      {fact.label}
                    </dt>
                    <dd>{fact.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </section>

      <section className="section-space bg-[var(--color-night)] text-[var(--color-paper)]">
        <div className="site-shell editorial-grid gap-y-12">
          <p className="eyebrow col-span-12 text-white/55 md:col-span-3">
            {project.concept.eyebrow}
          </p>
          <div className="col-span-12 md:col-span-8 md:col-start-5">
            <FadeIn>
              <h2 className="section-title mb-14 max-w-[13ch]">{project.concept.title}</h2>
            </FadeIn>
            <div className="grid gap-8 border-t border-white/20 pt-7 md:grid-cols-2">
              {project.concept.paragraphs.map((paragraph) => (
                <p key={paragraph} className="text-lg leading-relaxed text-white/72">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-space-sm">
        <div className="site-shell space-y-8 md:space-y-14">
          {project.gallery.map((visual, index) => (
            <figure
              key={visual.id}
              className={index % 3 === 1 ? "md:mr-[24%]" : index % 3 === 2 ? "md:ml-[24%]" : ""}
            >
              <ProjectVisual visual={visual} projectSlug={project.slug} className="w-full" />
              <figcaption className="mt-3 flex justify-between gap-5 text-[0.62rem] font-semibold tracking-[0.12em] text-[var(--color-muted)] uppercase">
                <span>{String(index + 1).padStart(2, "0")}</span>
                <span>{visual.caption}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="section-space bg-[var(--color-paper)]">
        <div className="site-shell editorial-grid gap-y-12">
          <div className="col-span-12 md:col-span-4">
            <p className="eyebrow mb-7">Malzeme Paleti</p>
            <h2 className="section-title max-w-[10ch]">Dokunun sessiz katmanları.</h2>
          </div>
          <div className="col-span-12 grid gap-8 sm:grid-cols-2 md:col-span-7 md:col-start-6">
            {project.materials.map((material) => (
              <article key={material.name} className="border-t border-[var(--color-border)] pt-4">
                <span
                  className="mb-8 block aspect-[5/2] w-full"
                  style={{ backgroundColor: material.swatch }}
                  aria-hidden="true"
                />
                <h3 className="mb-2 font-serif text-2xl">{material.name}</h3>
                <p className="text-sm text-[var(--color-muted)]">{material.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {relatedProject ? (
        <section className="section-space">
          <div className="site-shell">
            <p className="eyebrow mb-10">Sonraki Demo Proje</p>
            <Link
              href={`/projects/${relatedProject.slug}`}
              className="project-link group editorial-grid items-end gap-y-8"
              data-cursor-label="Projeyi İncele"
            >
              <ProjectVisual
                visual={relatedProject.cover}
                projectSlug={relatedProject.slug}
                className="col-span-12 aspect-[16/10] md:col-span-8"
              />
              <div className="col-span-12 md:col-span-4">
                <h2 className="card-title mb-5">{relatedProject.title}</h2>
                <p className="mb-7 text-[var(--color-ink-soft)]">{relatedProject.excerpt}</p>
                <span className="text-link">
                  Projeyi İncele <ArrowUpRight aria-hidden="true" size={15} />
                </span>
              </div>
            </Link>
          </div>
        </section>
      ) : null}

      <section className="section-space-sm bg-[var(--color-accent)] text-[var(--color-paper)]">
        <div className="site-shell flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
          <h2 className="section-title max-w-[13ch]">{project.inquiryPrompt}</h2>
          <Link href={`/contact?project=${project.slug}`} className="pill-button shrink-0">
            Proje Talebi Oluştur <ArrowUpRight aria-hidden="true" className="ml-2" size={16} />
          </Link>
        </div>
      </section>
    </main>
  );
}
