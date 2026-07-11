import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
  className,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("editorial-grid gap-y-8", className)}>
      <p className="eyebrow col-span-12 self-start md:col-span-3">{eyebrow}</p>
      <div className="col-span-12 md:col-span-8 md:col-start-5">
        <h2 className="section-title max-w-[13ch]">{title}</h2>
        {(description || action) && (
          <div className="mt-9 grid gap-7 border-t border-[var(--color-border)] pt-5 sm:grid-cols-2">
            {description ? <p className="text-[var(--color-ink-soft)]">{description}</p> : <span />}
            {action ? <div className="sm:justify-self-end">{action}</div> : null}
          </div>
        )}
      </div>
    </div>
  );
}
