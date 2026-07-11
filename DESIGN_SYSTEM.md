# Tasarım Sistemi

Tasarım dili sıcak, editoryal ve mimari bir showroom hissi kurar. Büyük tipografi, kontrollü boşluk, ince çizgiler ve güçlü görsel oranlar önceliklidir; genel amaçlı SaaS kartları, rastgele gradient, yoğun yuvarlatma, neon ve sürekli glassmorphism kullanılmaz.

Uygulanan tokenların tek kaynağı `src/app/globals.css` içindeki `:root` bloğudur. Yeni değer eklemeden önce mevcut tokenın aynı işi karşılayıp karşılamadığı kontrol edilmelidir.

## Renkler

| Token                  | Değer       | Kullanım                                                       |
| ---------------------- | ----------- | -------------------------------------------------------------- |
| `--color-canvas`       | `#f1ede4`   | Ana sıcak arka plan                                            |
| `--color-canvas-deep`  | `#e6dfd2`   | İkincil yüzey ve placeholder zemini                            |
| `--color-paper`        | `#faf7f0`   | Açık vurgu ve koyu yüzey üstü metin                            |
| `--color-ink`          | `#1c1c19`   | Ana metin ve güçlü kontroller                                  |
| `--color-ink-soft`     | `#46443e`   | Uzun metin ve ikincil açıklama                                 |
| `--color-muted`        | `#777268`   | Yardımcı metadata; küçük zorunlu metinde kontrast doğrulanmalı |
| `--color-accent`       | `#9a7155`   | Sınırlı sıcak vurgu ve focus rengi                             |
| `--color-accent-warm`  | `#c99c72`   | Koyu yüzeyde sıcak vurgu                                       |
| `--color-night`        | `#1f211f`   | Sinematik koyu bölümler                                        |
| `--color-border`       | `ink` %18   | Açık zemindeki mimari çizgiler                                 |
| `--color-border-light` | `paper` %24 | Koyu zemindeki mimari çizgiler                                 |

Renk tek başına durum veya eylem anlatmaz. Link, aktif rota, hata ve focus durumları çizgi, metin, ikon veya semantik işaretle desteklenir. `--color-muted` ve accent tonlarını küçük gövdeli temel bilgi için varsayılan metin rengi yapmayın; gerçek kombinasyonu kontrast aracıyla kontrol edin.

## Tipografi

Ticari font sağlanmadığı için sistem fontları kullanılır:

```css
--font-sans: Arial, Helvetica, sans-serif;
--font-display: Georgia, "Times New Roman", serif;
```

| Token / sınıf                   | Değer / rol                                                            |
| ------------------------------- | ---------------------------------------------------------------------- |
| `--text-display`                | `clamp(3.35rem, 8.8vw, 10.5rem)`; ilerideki büyük display kullanımları |
| `--text-hero`, `.display-title` | `clamp(2.9rem, 6.8vw, 8.5rem)`; ana hero başlığı                       |
| `--text-h1`, `.page-title`      | `clamp(3rem, 6.1vw, 7.4rem)`; rota başlığı                             |
| `--text-h2`, `.section-title`   | `clamp(2.4rem, 4.6vw, 5.6rem)`; bölüm başlığı                          |
| `--text-h3`, `.card-title`      | `clamp(1.65rem, 2.6vw, 3.15rem)`; içerik başlığı                       |
| `--text-body-lg`, `.body-large` | `clamp(1.15rem, 1.45vw, 1.55rem)`; giriş paragrafı                     |
| `--text-body`                   | `clamp(1rem, 0.4vw + 0.9rem, 1.16rem)`; gövde metni                    |
| `.eyebrow`                      | Küçük uppercase bağlam etiketi ve kısa çizgi                           |

Display başlıkları serif, 400 ağırlık, sıkı harf aralığı ve `text-wrap: balance` kullanır. Sans-serif gövde metni 1.55 line-height ile okunur. Heading sırası belge yapısını izlemeli; görsel boyut için yanlış heading seviyesi seçilmemelidir.

Lisanslı bir web font geldiğinde yalnız font tokenlarını ve gerekli Next.js font yüklemesini değiştirin. Font dosyasını lisans doğrulaması olmadan depoya eklemeyin; fallback ailesini koruyun ve CLS etkisini ölçün.

## Yerleşim

| Token / sınıf         | Davranış                                          |
| --------------------- | ------------------------------------------------- |
| `--container`         | `112rem`; ultrawide içerik genişliğini sınırlar   |
| `--container-reading` | `48rem`; uzun metin için hedef genişlik           |
| `--space-gutter`      | `clamp(1rem, 3.2vw, 4rem)`; `1920px+` için `4rem` |
| `--space-section`     | `clamp(5rem, 10vw, 11rem)`                        |
| `.site-shell`         | Container, otomatik merkezleme ve yatay gutter    |
| `.editorial-grid`     | 12 kolon; `767px` ve altında 6 kolon              |
| `.section-space`      | Ana bölüm dikey aralığı                           |
| `.section-space-sm`   | `clamp(3.5rem, 7vw, 7rem)`; kompakt bölüm aralığı |

Grid kolon aralığı `clamp(0.75rem, 1.6vw, 2rem)` değeridir. Kompozisyon 360, 768, 1024, 1440 ve 1920 piksel QA genişliklerinde kontrol edilir. Büyük ekranlarda içerik `--container` dışına yayılmaz; mobilde body minimum genişliği `20rem` ve yatay taşma `clip` ile korunur. `overflow-x: clip` bir düzen hatasını saklamak için kullanılmamalı; taşan bileşen kaynağında düzeltilmelidir.

## Yüzey, radius ve gölge

| Token           | Değer                             |
| --------------- | --------------------------------- |
| `--radius-sm`   | `0.2rem`                          |
| `--radius-md`   | `0.5rem`                          |
| `--shadow-soft` | `0 2rem 6rem rgb(32 29 24 / 10%)` |

Mimari çizgi ve yüzey ayrımı, büyük radius ve yoğun gölgeden önce gelir. Tam yuvarlak biçim yalnız `.pill-button` gibi açıkça kapsül kontrollerde kullanılır. Kartları otomatik olarak kutu, radius ve gölge içine almayın.

## Hareket tokenları

| Token               | Değer                            |
| ------------------- | -------------------------------- |
| `--duration-fast`   | `180ms`                          |
| `--duration-medium` | `480ms`                          |
| `--duration-slow`   | `900ms`                          |
| `--ease-out`        | `cubic-bezier(0.22, 1, 0.36, 1)` |
| `--ease-in-out`     | `cubic-bezier(0.65, 0, 0.35, 1)` |

CSS state geçişlerinde bu tokenları kullanın. Scroll tabanlı veya sekanslı hareket GSAP primitives üzerinden kurulmalıdır. `prefers-reduced-motion` global CSS'i süreleri neredeyse sıfırlar; bileşenler ayrıca `useReducedMotion` ile zorunlu olmayan davranışı başlatmamalıdır.

## Katmanlar

| Token         | Değer | Sahip                   |
| ------------- | ----- | ----------------------- |
| `--z-base`    | `0`   | Normal yüzey            |
| `--z-content` | `10`  | Yerel içerik katmanı    |
| `--z-header`  | `60`  | Sabit site header'ı     |
| `--z-menu`    | `70`  | Tam ekran mobil menü    |
| `--z-cursor`  | `90`  | Dekoratif custom cursor |
| `--z-intro`   | `100` | Sayfa intro katmanı     |

Rastgele yüksek `z-index` eklemeyin. Yeni global overlay gerekiyorsa sahiplik ve focus davranışıyla birlikte token tanımlayın; yerel stacking context için global token kullanmayın.

## Global primitives

### `.text-link`

Minimum 44 piksele denk gelen `2.75rem` yüksekliği, alt çizgi ve ok boşluğu hareketi olan metin aksiyonudur. Eylem navigasyonsa `a`, form veya durum değişimiyse `button` kullanılır.

### `.pill-button`

Birincil/ikincil CTA için kapsül kontrol. Minimum `3rem` yüksekliğe sahiptir. Çok sayıda yan yana kullanım hiyerarşiyi zayıflatır; bölüm başına belirgin bir ana aksiyon tercih edilir.

### `.architectural-visual`

Yerel demo görsellerinde oranı, gradient zeminini ve ince yüzey dokusunu kapsar. Gerçek içerik geldiğinde semantik `figure`, doğru alt metin ve `next/image` davranışı korunmalıdır.

### `.fine-noise`

CSS ile oluşturulan düşük opaklıklı dekoratif doku katmanıdır. Metin okunurluğunu etkilememeli ve pointer event almamalıdır.

### `.hairline`

`--color-border` kullanan ince mimari ayrım için temel border tanımıdır.

## Bileşen bileşimi

Yeni bir editoryal bölüm için önce global primitives ve Tailwind utilities birlikte kullanılmalıdır:

```tsx
<section className="section-space">
  <div className="site-shell editorial-grid gap-y-10">
    <p className="eyebrow col-span-12 md:col-span-3">Bağlam</p>
    <div className="col-span-12 md:col-span-8 md:col-start-5">
      <h2 className="section-title">Bölüm başlığı</h2>
      <p className="body-large mt-8">Kısa, doğrulanmış açıklama.</p>
    </div>
  </div>
</section>
```

Bu örnek görsel yapıyı gösterir; gerçek heading seviyesi sayfadaki semantik sıraya göre seçilmelidir.

## Görsel dil

- Bir bölümde tek bir baskın kompozisyon kurun; her öğeyi bağımsız kart yapmayın.
- Görselleri büyük oranlar, kontrollü kırpım ve negatif boşlukla kullanın.
- İnce çizgiler metadata ve bölüm ritmi kurar; dekorasyonu çoğaltmak için kullanılmaz.
- Gradient yalnız mevcut soyut demo kompozisyonunda malzeme/ışık hissi verir. Gerçek proje görselinin üstüne rastgele marka efekti eklemeyin.
- Görsel olmayan tüm bilgi semantik DOM'da bulunmalıdır.
- Hover, bilgi veya aksiyonun tek erişim yolu olamaz.

## Form ve durumlar

Mevcut iletişim formu görünür label, en az 48 piksel alan yüksekliği, `aria-invalid`, alanla bağlı hata mesajı ve `aria-live` gönderim durumu kullanır. Yeni alanlar aynı yapıyı izlemelidir. Placeholder label yerine geçmez; hata yalnız renkle anlatılmaz.

## Erişilebilirlik kontrolü

- Klavye focus'u `:focus-visible` ile görünür olmalı ve overlay altında kalmamalıdır.
- Tıklanabilir hedefler en az yaklaşık 44×44 piksel olmalıdır.
- Koyu/açık yüzey değişiminde metin, border ve focus kontrastını ayrı ayrı doğrulayın.
- `prefers-reduced-motion`, touch ve hover olmayan cihazlarda eşdeğer deneyim sağlayın.
- Dekoratif görsel `alt=""`; içerik görseli kısa ve bağlama özgü alt metin kullanır.
- 200% zoom, 360 piksel viewport ve uzun Türkçe metinlerle taşma kontrolü yapın.

## Token değişikliği kontrol listesi

1. Tokenı `:root` içinde adlandırın ve gerekiyorsa Tailwind `@theme inline` köprüsüne ekleyin.
2. Aynı anlamdaki sabit değerleri tek tokena taşıyın; başka tema sistemini paralel kurmayın.
3. Açık/koyu yüzey, hover, focus, disabled ve reduced-motion durumlarını kontrol edin.
4. 360–1920 piksel aralığında başlık taşması, grid ve container davranışını doğrulayın.
5. Değişiklik kullanıcı davranışını etkiliyorsa ilgili testleri güncelleyin.
