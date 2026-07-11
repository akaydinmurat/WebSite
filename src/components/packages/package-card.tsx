import { ArrowUpRight, Check } from "lucide-react";
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
  return (
    <article
      className={cn(
        "flex h-full flex-col border-t border-[var(--color-border)] py-6",
        designPackage.featured && "bg-[var(--color-night)] px-6 text-[var(--color-paper)] md:px-8",
        className,
      )}
    >
      <div className="mb-10 flex justify-between text-[0.62rem] font-semibold tracking-[0.15em] text-current/60 uppercase">
        <span>{String(index + 1).padStart(2, "0")}</span>
        <span>{designPackage.featured ? "Öne Çıkan" : "Tasarım Kapsamı"}</span>
      </div>
      <h3 className="card-title mb-5">{designPackage.title}</h3>
      <p className="mb-8 text-current/72">{designPackage.summary}</p>
      <ul className="mb-10 space-y-3 text-sm" aria-label="Pakete dahil hizmetler">
        {designPackage.includedServices.slice(0, 4).map((item) => (
          <li key={item} className="flex gap-3 border-t border-current/15 pt-3">
            <Check aria-hidden="true" size={15} className="mt-0.5 shrink-0" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
      <dl className="mt-auto grid grid-cols-2 gap-5 border-t border-current/20 pt-5 text-sm">
        <div>
          <dt className="mb-1 text-[0.6rem] font-semibold tracking-[0.12em] text-current/55 uppercase">
            Teslim
          </dt>
          <dd>{designPackage.deliveryTime.label}</dd>
        </div>
        <div>
          <dt className="mb-1 text-[0.6rem] font-semibold tracking-[0.12em] text-current/55 uppercase">
            Revizyon
          </dt>
          <dd>{designPackage.revisionPolicy.label}</dd>
        </div>
      </dl>
      <div className="mt-7 flex items-end justify-between gap-5">
        <div>
          <span className="block text-[0.58rem] font-semibold tracking-[0.12em] text-current/55 uppercase">
            Ücret
          </span>
          <strong className="font-serif text-xl font-normal">
            {designPackage.startingPrice.label}
          </strong>
        </div>
        <Link
          href={designPackage.inquiry.href}
          className="grid size-11 shrink-0 place-items-center rounded-full border border-current"
          aria-label={`${designPackage.title} için bilgi alın`}
        >
          <ArrowUpRight aria-hidden="true" size={18} />
        </Link>
      </div>
    </article>
  );
}
