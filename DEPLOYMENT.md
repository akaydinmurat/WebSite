# Vercel Dağıtım Rehberi

Proje repository root'undan çalışan standart bir Next.js uygulamasıdır. Custom output directory veya Vercel'e özel secret dosyası gerekmez.

## Yayın akışı

1. Çalışma branch'ini GitHub'a push edin: `git push -u origin feat/premium-interior-showroom`.
2. GitHub'da `feat/premium-interior-showroom` → `main` pull request'i açın.
3. Değişiklikleri ve kalite sonuçlarını inceleyip onaydan sonra `main` ile birleştirin.
4. Vercel dashboard'da **Add New → Project** ile repository'yi import edin.
5. Framework preset'in **Next.js**, root directory'nin repository root'u olduğunu doğrulayın.
6. Gerekli environment variable'ları Preview ve Production kapsamlarında ekleyin.
7. İlk deployment'ı başlatın ve build logunda production build'in tamamlandığını doğrulayın.
8. **Settings → Domains** bölümünde gerçek alan adını ekleyin.
9. Vercel'in gösterdiği DNS kayıtlarını Wix domain yönetiminde birebir tanımlayın; mevcut posta kayıtlarını silmeyin.
10. DNS yayılımından sonra HTTPS sertifikasının aktif olduğunu doğrulayın.
11. `www` ve apex alan adlarından hangisinin canonical olacağına karar verin; diğerini Vercel'de kalıcı yönlendirin.
12. Production smoke test ve erişilebilirlik kontrolünü çalıştırın.

## Environment variable'lar

Zorunlu temel değer:

```text
NEXT_PUBLIC_SITE_URL=https://example.com
```

Sanity etkinleştirilecekse:

```text
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=
SANITY_API_READ_TOKEN=
SANITY_REVALIDATE_SECRET=
```

WebGL yetenekli masaüstü cihazlarda varsayılan olarak etkindir. Dağıtımda zorla kapatmak için:

```text
NEXT_PUBLIC_ENABLE_WEBGL_HERO=false
```

Google yorumlarını Hostinger üzerinde etkinleştirmek için Google Cloud'da **Places API (New)** servisini ve faturalandırmayı etkinleştirin. İşletmenin Place ID değerini Google'ın Place ID aracından alın; normal Google Maps paylaşım bağlantısını Place ID alanına yazmayın. Ardından sunucu tarafında kullanılacak API anahtarını yalnız **Places API (New)** ile sınırlandırın ve Hostinger projesine şu değişkenleri ekleyin:

```text
GOOGLE_REVIEWS_ENABLED=true
GOOGLE_PLACES_API_KEY=<server-side-secret>
GOOGLE_PLACE_ID=<verified-place-id>
GOOGLE_MAPS_PLACE_URL=<public-listing-url>
```

Bu değerlerde `NEXT_PUBLIC_` öneki kullanılmaz. Hostinger sabit çıkış IP'si sağlıyorsa anahtara IP kısıtlaması da ekleyin; sunucu isteğinde HTTP referrer kısıtlaması kullanmayın. Değişkenleri kaydettikten sonra uygulamayı yeniden build/deploy edin. Site, Google API'nin döndürdüğü yorumlardan ilk üçünü gösterir; bağlantı kurulamazsa doğrulanmış Google Maps bağlantısına geri döner.

`NEXT_PUBLIC_SITE_URL` son slash içermez. `SANITY_API_READ_TOKEN` ve `SANITY_REVALIDATE_SECRET` yalnız server-side secret olarak kalır. E-posta provider'ı eklenirse onun değişkenleri `.env.example` ve `SECURITY.md` içinde ayrıca belgelenmelidir.

## Wix DNS

Vercel'in o an gösterdiği kayıt değerleri kaynak kabul edilir; sabit IP veya CNAME tahmin etmeyin. Wix panelinde yalnız web trafiği için istenen A/CNAME kayıtlarını değiştirin. MX, SPF, DKIM ve DMARC kayıtları e-posta hizmetine aittir ve bilinçsizce kaldırılmamalıdır.

## Production smoke test

- `/`, `/projects`, en az bir `/projects/[slug]`, `/services`, `/packages`, `/about` ve `/contact` açılıyor.
- `robots.txt`, `sitemap.xml`, manifest ve sosyal paylaşım görselleri doğru origin kullanıyor.
- Canonical URL, HTTPS ve `www`/apex yönlendirmesi tutarlı.
- Mobil menü, klavye ile Escape ve focus dönüşü çalışıyor.
- 360 px görünümde yatay taşma yok.
- Form, provider yoksa belgelenen hata durumunu veriyor; provider varsa test alıcısına gerçek teslim doğrulanıyor.
- Browser console'da hydration veya runtime hatası yok.
- Sanity kullanılmıyorsa fallback içerik ve `/studio` kurulum mesajı çalışıyor.

## Geri alma

Başarısız yayında Vercel dashboard'dan son sağlıklı deployment'ı yeniden promote edin. Git geçmişini yeniden yazmayın; düzeltmeyi yeni branch ve commit ile hazırlayın. Environment variable değişikliği sorunsa önce önceki değeri geri yükleyip yeniden deployment başlatın.
