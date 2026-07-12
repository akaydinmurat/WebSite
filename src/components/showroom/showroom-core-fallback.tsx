import { cn } from "@/lib/utils";

export function ShowroomCoreFallback({ className }: { className?: string }) {
  return (
    <div className={cn("showroom-core-fallback", className)} aria-hidden="true">
      <span className="showroom-core-frame showroom-core-frame-outer" />
      <span className="showroom-core-frame showroom-core-frame-inner" />
      <span className="showroom-core-slab showroom-core-slab-a" />
      <span className="showroom-core-slab showroom-core-slab-b" />
      <span className="showroom-core-slab showroom-core-slab-c" />
      <span className="showroom-core-slab showroom-core-slab-d" />
      <span className="showroom-core-slab showroom-core-slab-e" />
      <span className="showroom-core-orbit showroom-core-orbit-a" />
      <span className="showroom-core-orbit showroom-core-orbit-b" />
      <span className="showroom-core-node showroom-core-node-a" />
      <span className="showroom-core-node showroom-core-node-b" />
    </div>
  );
}
