# Codex Depo Kuralları

Bu dosya, sonraki Codex oturumları için bağlayıcı ve depo-özel çalışma sözleşmesidir. Değişiklikten önce depoyu, Git durumunu ve ilgili dosyaları inceleyin. Kullanıcı değişikliklerini koruyun; bir komutu çalıştırmadan başarılı olduğunu söylemeyin.

## Dil ve adlandırma

- Kullanıcı iletişimi ve kamusal site içeriği Türkçedir.
- Kaynak kodu, tanımlayıcılar, dosya adları, teknik yorumlar ve commit mesajları profesyonel İngilizcedir.
- React bileşenleri ve tipler `PascalCase`; fonksiyonlar, değişkenler ve prop'lar `camelCase`; hook'lar `use...` biçimindedir.
- Bileşen modülleri ve rota klasörleri `kebab-case`; dinamik rotalar App Router biçiminde (`[slug]`) adlandırılır.
- Unit/component testleri `*.test.ts(x)`, Playwright testleri `*.spec.ts` kullanır.
- Tüm depo metin dosyaları UTF-8 ve LF olmalıdır.

## Mimari

- Next.js App Router ve strict TypeScript kullanın; Pages Router veya gereksiz JavaScript kaynak dosyası eklemeyin.
- Rotalar `src/app` altında; pazarlama sayfaları `src/app/(marketing)` altında tutulur. API uçları `src/app/api`, Sanity Studio `src/app/studio` altındadır.
- Bileşenleri sorumluluğuna göre `src/components/{layout,navigation,sections,projects,packages,forms,animation,webgl,ui}` içinde tutun.
- Site ve navigasyon sabitlerini `src/config`; yerel demo içeriğini `src/content`; genel hook'ları `src/hooks`; entegrasyon ve saf yardımcıları `src/lib`; Sanity şema ve sorgularını `src/sanity`; paylaşılan tipleri `src/types` altında tutun.
- `public/{images,textures,models,icons}` yalnız amaçlı yerel varlıklar içermelidir. Boş, gelecekte kullanılacağı varsayılan dosya veya klasör üretmeyin.
- Tek kaynaklı konfigürasyonu tercih edin; marka, site URL'si, navigasyon ve feature flag değerlerini bileşenlerde çoğaltmayın.
- Sunum, veri erişimi ve etkileşim sınırlarını ayırın. Saf yardımcıları I/O veya React yaşam döngüsüne bağlamayın.

## Server ve Client Component politikası

- Server Component varsayılandır. Statik bölüm, metadata ve veri sorgularını sunucuda tutun.
- Yalnız state, event handler, browser API, GSAP/Lenis veya React Three Fiber gerektiren en küçük yaprak modüle `'use client'` ekleyin. Hata gizlemek için `page.tsx` veya `layout.tsx` dosyasını topluca client yapmayın.
- Server'dan client'a yalnız seri hale getirilebilir, asgari prop'ları geçirin. Token ve server-only modülleri client graph'ına sokmayın.
- WebGL kodunu client sınırı arkasında dinamik yükleyin; Server Component'tan Three/R3F modülü import etmeyin. CSS hero her zaman çalışan temel deneyimdir.
- Sanity ayarları yoksa yerel fallback içeriği kullanın; build ve `/studio` çökmesin. Secret değişkenlere yalnız sunucudan erişin.
- Server Component ile çözülebilecek iş için `useEffect`, global store veya istemci veri isteği eklemeyin.

## Animasyon yaşam döngüsü

- GSAP eklentilerini tek, güvenli client modülünde bir kez kaydedin. React animasyonlarında `@gsap/react` `useGSAP`, kapsamlı selector ve gerektiğinde `contextSafe` kullanın.
- Timeline, ScrollTrigger, listener, observer, ticker, `requestAnimationFrame` ve Lenis örneklerini unmount'ta temizleyin. Strict Mode altında çift kayıt veya çift RAF döngüsü oluşmamalıdır.
- Başlangıç durumları deterministik olmalı; hydration farkı üretmemeli ve JavaScript çalışmasa bile içerik okunmalıdır.
- Öncelikle `transform` ve `opacity` animasyonu yapın. Layout thrashing oluşturan ölçüm/yazma sıralarından ve sürekli layout özelliklerinden kaçının.
- Pointer hareketinde React state güncellemeyin; CSS custom property, `requestAnimationFrame` veya GSAP `quickTo` kullanın ve bekleyen frame'i temizleyin.
- `prefers-reduced-motion` durumunda zorunlu olmayan hareketi kapatın, süreyi kısaltın ve parallax/smooth scroll/WebGL efektlerini sadeleştirin.
- Lenis tek zaman kaynağıyla GSAP ticker/ScrollTrigger'a bağlanmalı; ikinci RAF döngüsü kurmamalı; anchor, klavye kaydırma, history restoration ve doğal mobil davranışı bozmamalıdır. Scroll-jacking yasaktır.
- Her öğeyi hareketlendirmeyin. Motion, hiyerarşiyi ve odağı desteklemelidir; etkileşimi bloke etmemelidir.

## Erişilebilirlik

- Pratikte WCAG 2.2 AA hedefleyin: semantik HTML, doğru heading sırası, `lang="tr"`, skip link, görünür focus ve yeterli kontrast zorunludur.
- İşleve göre gerçek `button` veya `a` kullanın. Tüm kontroller klavyeyle erişilebilir ve makul dokunma hedeflerine sahip olmalıdır.
- Menü/dialog açıldığında focus trap, Escape ile kapatma, kontrollü scroll lock ve kapanışta focus iadesi sağlayın. Geçiş sırasında focus kaybolmamalıdır.
- Formlarda görünür label, alanla bağlı hata açıklaması, uygun `aria-live` duyurusu ve yalnız renge dayanmayan durum gösterimi kullanın.
- Hover hiçbir zaman tek bilgi veya eylem kaynağı değildir; mobil ve klavye eşdeğeri sağlanır. Native cursor erişilebilir fallback olarak kalır.
- Otomatik ses oynatmayın. Canvas tek başına içerik taşıyamaz; aynı bilgi ve eylem semantik DOM'da bulunmalıdır.
- Reduced motion davranışını ve klavye akışını test edin. En az bir Playwright akışında otomatik axe erişilebilirlik kontrolü bulundurun.

## Görsel optimizasyonu

- Telifli stock görsel indirmeyin, dış kaynağa hotlink yapmayın. Geçici görseller yerel, hafif ve açıkça demo olmalıdır.
- İçerik görsellerinde `next/image` kullanın; bilinen genişlik/yükseklik veya sabit aspect ratio ile CLS'yi önleyin ve doğru responsive `sizes` tanımlayın.
- `priority`/preload yalnız doğrulanmış LCP görseline verilir. Fold altındaki medya lazy-load edilir; mobil varyantlar gereksiz büyük indirmeyi önler.
- Mimari render'ları AVIF/WebP sunacak biçimde hazırlayın; kaynak kalitesini korurken ekrana göre çözünürlük ve sıkıştırma seçin. Remote image bağımlılığı eklemeyin.
- Alt metin bağlama göre anlamlıdır; dekoratif görsel boş alt metin kullanır. Sanity görsellerinde alt metin zorunlu, caption isteğe bağlı ve uygun yerlerde hotspot etkin olmalıdır.

## WebGL performansı

- `NEXT_PUBLIC_ENABLE_WEBGL_HERO=false` varsayılanını koruyun. Gerçek varlık ve ölçüm olmadan ağır shader'ı temel deneyim yapmayın.
- WebGL istemciye özel, dinamik chunk olmalı; CSS fallback düşük kabiliyet, touch/reduced-motion, hata ve context loss durumlarında sorunsuz çalışmalıdır.
- Adaptif ve üst sınırı olan DPR kullanın. Gereksiz sürekli render yerine `frameloop="demand"`/`invalidate`; sekme gizliyken veya sahne görünmüyorken pause uygulayın.
- Texture boyutu ve sayısını sınırlayın; mobil varyant, sıkıştırılmış texture ve Draco/Meshopt/glTF optimizasyonunu tercih edin. Büyük asset'i ilk JS chunk'ına gömmeyin.
- Geometry, material, texture, render target, listener ve observer kaynaklarını dispose/cleanup edin. Resize ve visibility yaşam döngülerini güvenli yönetin.
- Pointer verisini ref/uniform üzerinden taşıyın; frame başına React render üretmeyin. Efekt kalitesini cihaz kabiliyetine göre düşürün.
- Canvas'a bağlı zorunlu navigasyon veya içerik oluşturmayın. FPS, bundle ve bellek etkisini ölçmeden performans iddiasında bulunmayın.

## Test gereksinimleri

- Değişen davranış için anlamlı test ekleyin. Utility class birleştirme, navigasyon, iletişim formu doğrulaması, reduced-motion ve proje filtre mantığı unit/component kapsamına dahildir.
- E2E kapsamı en az ana sayfa yükleme, masaüstü/mobil navigasyon, proje listesi ve detayı, iletişim formu doğrulaması, mobil yatay taşma ve klavyeyle menü açma/kapamayı içerir.
- Animasyon frame'i veya piksel zamanlamasına bağlı kırılgan snapshot testleri yazmayın. Kullanıcı davranışını ve erişilebilir çıktıyı test edin.
- Bug düzeltmesinde uygulanabiliyorsa önce hatayı yakalayan regresyon testi ekleyin.
- Playwright browser yoksa yalnız Chromium'u proje kapsamında kurun; sistem bağımlılıklarını açıklamadan değiştirmeyin.

## Git ve güvenlik

- Başlamadan `git status`, branch ve merge/rebase durumunu kontrol edin. Anlamlı mevcut değişiklikleri silmeyin veya üzerine yazmayın.
- `main` üzerine commit atmayın; çalışma branch'i `feat/premium-interior-showroom` olmalıdır.
- Commit'ler odaklı, doğrulanmış ve Conventional Commits biçiminde İngilizcedir. Açık talep olmadan push veya merge yapmayın.
- `git reset --hard`, `git clean -fd`, force push ve kullanıcı verisini kaybettirecek komutlar yasaktır.
- `.env`, `.env.local`, token, credential veya servis secret'ı commit etmeyin ya da çıktıda göstermeyin. Yeni anahtarları yalnız `.env.example` içinde örnek/boş değerle belgeleyin.
- API girdisini Zod ile doğrulayın; boyut sınırı ve honeypot uygulayın. Kullanıcı HTML'i render etmeyin; sanitizasyon olmadan `dangerouslySetInnerHTML` kullanmayın.

## Yasak kestirmeler

- Hataları `any`, `@ts-ignore`, geniş `eslint-disable`, gerekçesiz unsafe cast veya devre dışı bırakılmış test ile gizlemeyin.
- Deprecated API, gerekçesiz experimental framework özelliği veya rastgele global npm paketi kullanmayın.
- Material UI, Chakra, Ant Design, Bootstrap, tam şablon/UI kütüphanesi ya da otomatik shadcn kurulumu eklemeyin. GSAP birincil animasyon sistemidir; somut gereksinim olmadan Framer Motion eklemeyin.
- Gerçek veri gibi sahte proje, fiyat, ödül, müşteri, metrik veya testimonial üretmeyin. Placeholder'ları açıkça etiketleyin.
- Static Server Component'ları kolaylık için client'a çevirmeyin; pointer hareketinde re-render, kontrolsüz RAF, temizlenmeyen observer/listener veya gereksiz sürekli WebGL loop bırakmayın.
- Remote görsel, render-blocking üçüncü taraf script, başlangıç aşamasında analytics, gerçek ödeme veya sahte authentication eklemeyin.
- Lighthouse/test/build çalıştırılmadıysa skor veya başarı sonucu uydurmayın.

## Doğrulama komutları

İlgili geliştirme sırasında dar testi, teslim öncesinde tam kalite kapısını çalıştırın:

```powershell
pnpm format:check
pnpm lint
pnpm typecheck
pnpm test
pnpm test:e2e
pnpm build
pnpm check
```

`pnpm check` en az format kontrolü, lint, typecheck, unit test ve production build çalıştırmalıdır. E2E için browser kurulumu yoksa bunu açıkça raporlayın; mevcutsa `pnpm test:e2e` çalıştırın. Ayrıca browser konsolu, hydration, DOM nesting, eksik key/alt/metadata, focus davranışı, kırık rotalar ve mobil yatay taşmayı kontrol edin.
