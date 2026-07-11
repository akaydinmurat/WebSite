import { ArrowUpRight, Check, Minus } from "lucide-react";
import Link from "next/link";

import type { DesignPackage } from "@/types";
import { cn } from "@/lib/utils";

export function PackageCard({
  designPackage,
  index,
  className,
}: {
  designPackage: DesignPackage;
  index: number;
  className?: string;
}) {
  const dossierNumber = String(index + 1).padStart(2, "0");

  return (
    <article className={cn("package-dossier", className)}>
      <header className="package-dossier-header">
        <span>Dosya / {dossierNumber}</span>
        <span>{designPackage.scopeLabel}</span>
      </header>

      <div className="package-dossier-intro">
        <h3 className="card-title">{designPackage.title}</h3>
        <p>{designPackage.summary}</p>
      </div>

      <div className="package-dossier-body">
        <PackageList title="Kapsam" items={designPackage.scopeItems} />

        {designPackage.examples?.length ? (
          <div className="package-dossier-block">
            <h4>Örnekler</h4>
            <p className="package-dossier-tags">{designPackage.examples.join(" · ")}</p>
          </div>
        ) : null}

        {designPackage.presentationFormats?.length ? (
          <div className="package-dossier-block">
            <h4>Sunum biçimi</h4>
            <div className="flex flex-wrap gap-2">
              {designPackage.presentationFormats.map((format) => (
                <span key={format} className="package-format-tag">
                  {format}
                </span>
              ))}
            </div>
          </div>
        ) : null}

        {designPackage.scopeBasis ? (
          <div className="package-dossier-block">
            <h4>Kapsam ölçütü</h4>
            <p>{designPackage.scopeBasis}</p>
          </div>
        ) : null}

        {designPackage.exclusions?.length ? (
          <div className="package-dossier-block package-dossier-exclusion">
            <h4>Dahil değil</h4>
            <ul>
              {designPackage.exclusions.map((item) => (
                <li key={item}>
                  <Minus aria-hidden="true" size={14} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>

      <Link
        href={designPackage.inquiry.href}
        className="package-dossier-action"
        aria-label={designPackage.inquiry.label}
      >
        <span>Kapsamı görüşün</span>
        <ArrowUpRight aria-hidden="true" size={18} />
      </Link>
    </article>
  );
}

function PackageList({ title, items }: { title: string; items: readonly string[] }) {
  return (
    <div className="package-dossier-block">
      <h4>{title}</h4>
      <ul className="space-y-3">
        {items.map((item) => (
          <li key={item} className="flex gap-3 border-t border-current/15 pt-3">
            <Check aria-hidden="true" size={15} className="mt-0.5 shrink-0" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
