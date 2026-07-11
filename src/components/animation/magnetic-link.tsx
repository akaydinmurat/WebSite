"use client";

import { useEffect, useRef, type ReactNode } from "react";
import Link from "next/link";

import { useFinePointer } from "@/hooks/use-pointer-capability";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { gsap } from "@/lib/animation/gsap";
import { cn } from "@/lib/utils";

export function MagneticLink({
  href,
  children,
  className,
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  const linkRef = useRef<HTMLAnchorElement>(null);
  const finePointer = useFinePointer();
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const element = linkRef.current;
    return () => {
      if (element) gsap.killTweensOf(element);
    };
  }, []);

  const handlePointerMove = (event: React.PointerEvent<HTMLAnchorElement>) => {
    const element = linkRef.current;
    if (!element || !finePointer || reducedMotion) return;
    const rect = element.getBoundingClientRect();
    gsap.to(element, {
      x: (event.clientX - rect.left - rect.width / 2) * 0.18,
      y: (event.clientY - rect.top - rect.height / 2) * 0.18,
      duration: 0.35,
      ease: "power3.out",
      overwrite: true,
    });
  };

  const reset = () => {
    if (!linkRef.current) return;
    gsap.to(linkRef.current, { x: 0, y: 0, duration: 0.55, ease: "elastic.out(1, 0.45)" });
  };

  return (
    <Link
      ref={linkRef}
      href={href}
      className={cn(className)}
      onPointerMove={handlePointerMove}
      onPointerLeave={reset}
      onBlur={reset}
    >
      {children}
    </Link>
  );
}
