# Mimari Rehberi

Bu belge mevcut `0.1.0` kod tabanının sınırlarını ve yeni geliştirmelerde korunacak kararları tanımlar. Uygulama Next.js App Router, strict TypeScript ve Server Component varsayılanı üzerine kuruludur.

## Temel ilkeler

- Rota, metadata ve statik içerik bileşimi sunucuda kalır.
- State, event handler, browser API, GSAP/Lenis veya WebGL gerektiren en küçük yaprak bileşen Client Component olur.
- Marka, navigasyon ve site origin'i tek kaynaklardan okunur; bileşenlerde çoğaltılmaz.
- Sunum, içerik erişimi ve etkileşim yaşam döngüsü ayrı modüllerde tutulur.
- JavaScript, WebGL veya Sanity olmadan temel içerik ve navigasyon çalışmaya devam eder.
- Doğrulanmış portföy verisi ile yer tutucu görsel durumu açıkça ayrılır.

## İstek ve veri akışı

```text
Next.js route (Server Component)
  ├─ src/config        → marka, navigasyon, site ayarları
  ├─ src/content       → doğrulanmış yerel fallback içeriği
  ├─ src/lib/seo       → metadata, canonical URL, JSON-LD yardımcıları
  └─ leaf components
       ├─ server       → statik bölüm ve düzen
       └─ client       → navigasyon state'i, form, animasyon, pointer ve WebGL

Sanity (isteğe bağlı)
  schema → public client → typed query helpers → caller-provided fallback
```

Sanity sorgu katmanı hazırdır fakat mevcut pazarlama sayfaları henüz bu katmanı içerik kaynağı olarak çağırmaz. `/projects`, proje detayları, hizmetler, paketler ve ana sayfa bölümleri doğrudan `src/content` kaynaklarını kullanır. `sitemap.ts`, Sanity yapılandırılmışsa yayımlanmış proje slug'larını sorgulayan mevcut istisnadır.

## Dizin sorumlulukları

```text
src/
  app/
    (marketing)/       # Kamusal sayfalar ve ortak header/footer düzeni
    api/contact/       # İletişim POST uç noktası
    studio/            # Opsiyonel gömülü Sanity Studio
    globals.css        # Tokenlar, global primitives ve reduced-motion CSS'i
    layout.tsx         # Kök metadata ve ortak HTML kabuğu
    robots.ts          # Ortama göre indeksleme politikası
    sitemap.ts         # Statik ve uygun proje URL'leri
  components/
    animation/         # GSAP, Lenis ve CSS hareket primitives
    forms/             # İstemci form deneyimi
    layout/            # Footer gibi site kabuğu parçaları
    navigation/        # Desktop/mobile navigasyon ve aktif rota mantığı
    packages/          # Paket sunum bileşenleri
    projects/          # Proje listesi, filtre ve medya sunumu
    sections/          # Ana sayfa bölümleri
    seo/               # React JSON-LD çıktıları
    ui/                # Genel görsel primitives
    webgl/             # Dinamik yüklenen istemci WebGL deneyimi
  config/              # Site ve navigasyon için tek kaynak
  content/             # Yerel proje, hizmet ve paket fallback verisi
  hooks/               # Media query, pointer ve reduced-motion hook'ları
  lib/
    animation/         # GSAP kayıt noktası
    contact/           # Form şeması ve provider arayüzü
    projects/          # Saf filtre mantığı
    sanity/            # İstemci, sorgu, fetch ve görüntü yardımcıları
    seo/               # URL, metadata ve structured-data yardımcıları
  sanity/              # Studio config, şemalar ve desk structure
  types/               # Paylaşılan domain tipleri
tests/
  unit/                # Vitest ve React Testing Library
  e2e/                 # Playwright kullanıcı akışları
public/images/placeholders/
                       # Yerel, açıkça yer tutucu olarak işaretlenen SVG varlıklar
```

Yeni klasör veya dosya yalnız somut bir sorumlulukla eklenir; boş gelecek-kullanım yapıları oluşturulmaz.

## Rotalar

| Rota                  | Render ve veri davranışı                                                               |
| --------------------- | -------------------------------------------------------------------------------------- |
| `/`                   | Server Component; bölüm bileşimi yerel içerik ve client hareket yaprakları kullanır    |
| `/projects`           | Server sayfa + client `ProjectIndex`; yerel proje ve kategori verisi kullanır          |
| `/projects/[slug]`    | Yerel slug'lar için `generateStaticParams`; metadata ve içerik yerel projeden üretilir |
| `/services`           | Yerel hizmet verisini sunucuda listeler                                                |
| `/packages`           | Yerel paket verisini sunucuda listeler                                                 |
| `/about`              | Statik stüdyo anlatısı                                                                 |
| `/contact`            | Server sayfa içinde client `ContactForm`                                               |
| `/api/contact`        | Yalnız `POST`; JSON gövdesini doğrular, no-store yanıt verir                           |
| `/studio/[[...tool]]` | Geçerli Sanity ayarlarında dinamik Studio; aksi hâlde güvenli kurulum ekranı           |

`error.tsx`, `loading.tsx` ve `not-found.tsx` App Router durumlarını karşılar. `manifest.ts`, `robots.ts`, `sitemap.ts`, `opengraph-image.tsx` ve `twitter-image.tsx` framework-native çıktılardır.

## Server ve Client Component sınırı

`src/app/layout.tsx`, pazarlama layout'u ve rota dosyaları Server Component'tır. Yalnız pazarlama layout'u şu client yapraklarını kompoze eder; bu katmanlar `/studio` rotasına sızmaz:

- `SmoothScroll`: yalnız fine pointer ve normal motion tercihinde Lenis başlatır.
- `ScrollProgress`: scroll değerini `requestAnimationFrame` ile DOM transform'una taşır.
- `CustomCursor`: uygun pointer cihazlarında dekoratif imleç katmanı sağlar.
- Navigasyon, proje filtresi, form, animation primitives ve hero etkileşimi kendi client sınırlarında kalır.
- `WebGLHero`, hero içinden `dynamic(..., { ssr: false })` ile ayrı chunk olarak yüklenir.

Server'dan client'a yalnız seri hale getirilebilir domain verisi geçirin. Sanity tokenı veya başka server-only modül client import zincirine giremez. Yeni bir rota, yalnız bir alt etkileşim yüzünden bütünüyle client yapılmamalıdır.

## Konfigürasyon

- `src/config/site.ts`: marka adı, konumlandırma, locale, origin, iletişim alanları ve ana bölüm metinleri.
- `src/config/navigation.ts`: header/footer linkleri, aktif rota eşleşme türü ve iletişim aksiyonu.
- `.env.example`: dağıtım başına değişen public değerler ve boş secret isimleri.
- `next.config.ts`: güvenlik header'ları, `poweredByHeader: false`, Strict Mode ve AVIF/WebP desteği.

`NEXT_PUBLIC_SITE_URL` güvenli bir HTTP(S) origin'e normalize edilir. Yerel, private veya Vercel preview origin'leri indekslenmez; production ve public origin koşulları sağlanmadığında `robots.txt` tüm siteyi kapatır. Görsel ve anlatı aktarımı tamamlanmayan proje URL'leri sitemap'e alınmaz.

## İçerik katmanı

### Yerel kaynaklar

Bugünkü kamusal sayfaların otoritatif kaynağı:

- `fallback-projects.ts`
- `fallback-services.ts`
- `fallback-packages.ts`

Proje kayıtları gerçek ad, yıl ve konumu; yer tutucu görsel ve yayın durumundan ayrı taşır. `seo.noIndex`, görsel ve ayrıntılı anlatı aktarımı tamamlanana kadar bu kayıtların arama motorlarına açılmasını engeller.

### Sanity temeli

`src/sanity/env.ts`, public ayarları biçim ve varsayılan açısından doğrular. Ayarlar geçerliyse `src/lib/sanity/client.ts` yalnız yayımlanmış içerik için tokensız, CDN kullanan bir istemci döndürür; değilse `null` döner. `fetchWithFallback` çağıranın verdiği fallback'i hem yapılandırma eksikliğinde hem sorgu hatasında korur.

CMS entegrasyonu tamamlanırken:

1. Veri dönüşümlerini `src/lib/sanity` içinde tutun.
2. Sorguyu Server Component'ta çağırın.
3. Client bileşenine yalnız gereken normalize veriyi geçirin.
4. `generateStaticParams`, metadata, sitemap ve sayfa içeriğinin aynı kaynak stratejisini kullanmasını sağlayın.
5. Yapılandırmasız build ve `/studio` davranışını koruyun.

## İletişim akışı

```text
ContactForm
  → React Hook Form + Zod client validation
  → POST /api/contact (application/json)
  → Content-Type + 16 KiB limit
  → aynı Zod şemasıyla server validation
  → honeypot kontrolü
  → ContactProvider
```

Geliştirme provider'ı teslimat yapmadan açık bir doğrulama yanıtı üretir. Production'da provider yoktur ve uç nokta `503` döndürür. Gerçek yayından önce provider implementasyonu ve dağıtık/IP duyarlı rate limit eklenmelidir. Gizli anahtarlar yalnız provider'ın server tarafında okunmalıdır.

## SEO ve erişilebilirlik

- Root metadata, sayfa metadata yardımcıları ve proje metadata'sı `src/lib/seo` üzerinden üretilir.
- Site ve proje breadcrumb JSON-LD çıktıları semantik DOM'a eşlik eder.
- `lang="tr"`, skip link, görünür focus, semantik header/main/footer ve klavye erişimli menü uygulanır.
- Mobil dialog; focus trap, Escape, scroll lock, kapanışta focus iadesi ve `inert` kapalı durumu kullanır.
- Canvas dekoratiftir; zorunlu içerik ve aksiyon DOM'da bulunur.

## Animasyon ve WebGL sınırı

GSAP eklentileri `src/lib/animation/gsap.ts` içinde tek kez kaydedilir. Hareket primitives `useGSAP` ve scoped ref kullanır; reduced motion durumunda zorunlu olmayan hareket atlanır. Lenis, kendi ikinci döngüsünü kurmadan GSAP ticker ile sürülür.

WebGL destekleyen masaüstü cihazlarda varsayılan olarak etkindir; `NEXT_PUBLIC_ENABLE_WEBGL_HERO=false` ile zorla kapatılabilir. Shader katmanı yalnız destek, fine pointer ve motion tercihi koşulları sağlanırsa görünür. Canvas `frameloop="demand"` ve sınırlı `[1, 1.5]` DPR kullanır. CSS hero her durumda fallback olarak kalır.

Ayrıntılı kurallar için [ANIMATION_GUIDE.md](./ANIMATION_GUIDE.md) belgesini kullanın.

## Yeni özellik ekleme sırası

1. Domain tipini veya saf yardımcıyı tanımlayın.
2. I/O gerekiyorsa server erişim katmanını ekleyin.
3. Statik sunumu Server Component'ta kurun.
4. Etkileşimi en küçük client yaprağına ayırın.
5. Klavye, reduced motion, mobil taşma ve cleanup davranışını ekleyin.
6. Değişen davranış için unit/component veya E2E testi yazın.
7. `pnpm check` ve mevcutsa `pnpm test:e2e` çalıştırın.

## Bilinen ürün sınırları

- Kamusal sayfalar henüz Sanity'den canlı içerik okumaz.
- Production iletişim sağlayıcısı ve rate limit yoktur.
- WebGL hero, gerçek render/texture varlıklarıyla production ölçümünden geçmemiş deneysel bir katmandır.
- Ödeme, hesap, sipariş, commerce, analytics ve authentication uygulanmamıştır.
- Mevcut SVG'ler yer tutucudur; gerçek portföy renderları gibi sunulmamalıdır.
