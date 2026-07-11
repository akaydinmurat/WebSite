import {
  createProjectBreadcrumbJsonLd,
  createSiteJsonLd,
  serializeJsonLd,
  type JsonLdData,
  type ProjectBreadcrumbInput,
} from "@/lib/seo";

export interface JsonLdProps {
  data: JsonLdData;
  id?: string;
}

/** Renders escaped JSON-LD without bypassing React's content handling. */
export function JsonLd({ data, id }: JsonLdProps) {
  return (
    <script id={id} type="application/ld+json">
      {serializeJsonLd(data)}
    </script>
  );
}

export function SiteJsonLd() {
  return <JsonLd data={createSiteJsonLd()} id="site-structured-data" />;
}

export interface ProjectBreadcrumbJsonLdProps {
  project: ProjectBreadcrumbInput;
}

export function ProjectBreadcrumbJsonLd({ project }: ProjectBreadcrumbJsonLdProps) {
  return <JsonLd data={createProjectBreadcrumbJsonLd(project)} />;
}
