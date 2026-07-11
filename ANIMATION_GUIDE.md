# Animasyon Rehberi

Bu proje hareketi dekor olarak değil, içerik hiyerarşisini ve mekânsal hissi destekleyen bir sistem olarak kullanır. İçerik JavaScript çalışmadığında da okunabilir kalmalı; başlangıç stilleri hydration farkı üretmemelidir.

## Temel kurallar

- Yeni bir efekt için önce CSS `transform` ve `opacity` yeterli mi değerlendirin.
- React state'i pointer veya scroll frame'i başına güncellemeyin. Ref, CSS custom property, `requestAnimationFrame` veya GSAP `quickTo` kullanın.
- Ölçüm ve yazma işlemlerini aynı frame içinde gruplayın; animasyon sırasında layout özelliklerini değiştirmeyin.
- Tüm timeline, ScrollTrigger, ticker, listener, observer ve RAF kayıtlarını unmount sırasında temizleyin.
- `prefers-reduced-motion: reduce` için zorunlu olmayan hareketi kaldırın.
- Animasyon hiçbir bağlantıyı, form kontrolünü veya klavye odağını bloke etmemelidir.

## Kullanılabilir primitives

| Bileşen          | Amaç                                     |
| ---------------- | ---------------------------------------- |
| `FadeIn`         | Görünür alana giren kısa içerik grupları |
| `TextReveal`     | Editoryal başlık girişi                  |
| `ImageReveal`    | Görsel yüzey açılışı                     |
| `StaggerGroup`   | Küçük ve ilişkili öğe grupları           |
| `ParallaxMedia`  | Yalnız uygun cihazlarda ölçülü derinlik  |
| `MagneticLink`   | Fine-pointer cihazlarda eylem vurgusu    |
| `ScrollProgress` | Sayfa ilerleme göstergesi                |
| `PageIntro`      | Sayfa giriş katmanı                      |
| `SectionDivider` | Bölümler arası çizgisel geçiş            |

Primitive seçerken yeni bir varyant prop'u eklemeyi, yeni client bileşeni oluşturmaya tercih edin. Ancak ilgisiz davranışları tek bileşende birleştirmeyin.

## GSAP yaşam döngüsü

GSAP ve ScrollTrigger yalnız `src/lib/animation/gsap.ts` içinde kaydedilir. React animasyonlarında `useGSAP` kullanın, kapsamı bir root ref ile sınırlandırın ve event handler içindeki GSAP işlemlerini gerektiğinde `contextSafe` ile sarın. Global selector, modül seviyesinde timeline veya temizlenmeyen ScrollTrigger eklemeyin.

## Lenis

`SmoothScroll`, Lenis'i yalnız fine-pointer ve normal motion tercihinde etkinleştirir. Lenis kendi ikinci RAF döngüsünü kurmaz; GSAP ticker tek zaman kaynağıdır. Anchor, klavye, history restoration ve doğal mobil kaydırma korunmalıdır. Süre veya wheel çarpanı artırılırken scroll-jacking hissi yaratılmamalıdır.

## Pointer etkileşimleri

Hero reveal, proje parallax ve özel cursor pointer koordinatını RAF ile sınırlar. Bekleyen frame unmount sırasında iptal edilir. Touch cihazlarda ve reduced-motion tercihinde bu katmanlar devre dışı kalır; native cursor her zaman işlevsel fallback'tir.

## WebGL

WebGL hero varsayılan olarak kapalıdır. `NEXT_PUBLIC_ENABLE_WEBGL_HERO=true` yalnız gerçek varlıklar ve cihaz testleri tamamlandıktan sonra kullanılmalıdır. Canvas içerik veya navigasyon taşımaz; CSS hero semantik ve görsel fallback olarak kalır. `frameloop="demand"`, sınırlı DPR ve görünürlük yaşam döngüsü korunmalıdır.

## Hareket bütçesi

- Aynı viewport'ta en fazla bir baskın giriş hareketi kullanın.
- Etkileşim geri bildirimi yaklaşık 120–240 ms, bölüm geçişleri yaklaşık 400–800 ms aralığında kalmalıdır.
- Uzun parallax mesafelerinden, sürekli filtre animasyonlarından ve geniş yüzeylerde blur kullanımından kaçının.
- Yeni hareketi 360 px mobil, klavye akışı ve reduced-motion emülasyonunda test edin.

## Kontrol listesi

1. İçerik animasyonsuz okunuyor mu?
2. Reduced-motion sonucu sakin ve eksiksiz mi?
3. Strict Mode altında çift kayıt oluşuyor mu?
4. Listener, RAF, ticker ve WebGL kaynakları temizleniyor mu?
5. Pointer hareketi React render üretmiyor mu?
6. Focus sırası ve tıklama hedefleri etkilenmiyor mu?
