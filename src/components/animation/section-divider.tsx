export function SectionMarker({
  index,
  label,
  meta,
}: {
  index: string;
  label: string;
  meta: string;
}) {
  return (
    <div className="section-marker" aria-hidden="true">
      <span className="section-marker-index">{index}</span>
      <span className="section-marker-label">{label}</span>
      <span className="section-marker-line" />
      <span className="section-marker-meta">{meta}</span>
    </div>
  );
}
