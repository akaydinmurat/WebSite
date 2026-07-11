# Performans Rehberi

Performans bu deneyimin ürün gereksinimidir. Lighthouse hedefleri yön gösterir; ölçüm yapılmadan skor iddiasında bulunulmaz. Yeni medya veya etkileşim production build ve gerçek cihaz profilleriyle doğrulanmalıdır.

## Mimari bütçe

- Server Component varsayılandır; client sınırını etkileşimli en küçük yaprakta tutun.
- Fold altı medya lazy-load edilir. Preload yalnız doğrulanmış LCP varlığına verilir.
- WebGL ayrı ve dinamik chunk olarak kalır; özellik bayrağı varsayılanı `false` olur.
- Analytics, uzaktan font ve render-blocking üçüncü taraf script başlangıç paketine eklenmez.
- Pointer/scroll hareketi React state veya sürekli component render üretmez.

## Mimari render export'u

Kaynak master dosyayı kayıpsız arşivleyin; repoya yalnız web türevlerini koyun. Genel başlangıç noktaları:

| Kullanım                | Önerilen genişlik | Format yaklaşımı                       |
| ----------------------- | ----------------: | -------------------------------------- |
| Tam ekran desktop kapak |      2400–2880 px | AVIF ana, WebP fallback                |
| İçerik/gallery          |      1600–2400 px | AVIF/WebP                              |
| Mobil kapak             |       960–1280 px | Ayrı kırpım ve daha düşük dosya boyutu |
| Thumbnail               |        640–960 px | AVIF/WebP                              |

Kaliteyi sahne başına görsel olarak kontrol edin. AVIF için yaklaşık 45–60, WebP için 70–82 kalite yalnız başlangıç aralığıdır; yoğun doku ve yumuşak gradient sahneleri daha yüksek kalite isteyebilir. Boyutlar layout'taki gerçek maksimum görüntüleme alanını aşmamalıdır.

`next/image` için gerçek en-boy oranı, doğru `sizes`, gerekli olduğunda mobil kaynak ve anlamlı alt metin tanımlayın. LCP olmayan görsele `preload` veya eager loading vermeyin.

## Video

- Kısa, sessiz ve döngülü arka planlarda kullanıcıya durdurma kontrolü veya reduced-motion fallback'i sağlayın.
- MP4/H.264 uyumluluk, WebM/VP9 veya AV1 daha iyi sıkıştırma için değerlendirilebilir.
- Gereksiz 4K teslim etmeyin; çoğu tam ekran web kullanımında 1080p–1440p türev yeterlidir.
- Poster görseli, `preload="metadata"` veya `none` ve görünürlük bazlı oynatma kullanın.
- Ses otomatik başlamaz.

## 3D ve texture

- Geometriyi glTF/GLB ile, ölçüm sonrası Draco veya Meshopt kullanarak sıkıştırın.
- Görünmeyen mesh, materyal ve animasyon track'lerini export öncesi kaldırın.
- Texture'larda KTX2/Basis değerlendirin; masaüstünde genellikle 2048 px, mobilde 1024 px üst sınırını aşmak için ölçüm gerekçesi isteyin.
- Normal/roughness/metalness kanallarını uygun olduğunda paketleyin.
- Geometry, material, texture ve render target kaynaklarını dispose edin.
- Adaptif DPR üst sınırı, `frameloop="demand"`, sekme/görünürlük pause'u ve CSS fallback zorunludur.

## Animasyon bütçesi

Transform ve opacity dışındaki animasyonları istisna olarak ele alın. Büyük blur, filter ve blend katmanlarını GPU maliyetiyle birlikte ölçün. ScrollTrigger sayısını sınırlayın; görünmeyen sahnede sürekli ticker veya RAF bırakmayın. Detaylar `ANIMATION_GUIDE.md` içindedir.

## Ölçüm akışı

1. `pnpm build` ile production bundle üretin.
2. Production sunucusunda mobil ve desktop Lighthouse ölçümü yapın.
3. LCP, INP, CLS, JS transferi ve ana thread süresini kaydedin.
4. 360 px mobilde yatay taşma ve düşük güç/reduced-motion davranışını kontrol edin.
5. WebGL açılacaksa kapalı sürümle FPS, bellek ve yükleme maliyetini karşılaştırın.
