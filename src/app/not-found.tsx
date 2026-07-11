import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="site-shell flex min-h-[80svh] flex-col justify-end pt-40 pb-20">
      <p className="eyebrow mb-8">404 · Bulunamadı</p>
      <h1 className="page-title mb-10 max-w-[12ch]">Aradığınız mekân bu planda yer almıyor.</h1>
      <Link href="/" className="text-link w-fit">
        <ArrowLeft aria-hidden="true" size={15} /> Ana sayfaya dön
      </Link>
    </main>
  );
}
