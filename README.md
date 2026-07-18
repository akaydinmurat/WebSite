# Göknur Uygur Akaydın

Göknur Uygur Akaydın'ın mimarlık, iç mekân tasarımı, danışmanlık ve içerik üretimi çalışmalarını editoryal bir dille sunmak üzere geliştirilen Next.js App Router tabanlı premium dijital showroom'dur. Mevcut `0.1.0` sürümü canlı siteden doğrulanan marka, biyografi, proje kayıtları ve paket kapsamlarını kullanır; gerçek proje görselleri aktarılana kadar yerel soyut yer tutucular gösterir.

Uygulama; erişilebilir navigasyon, filtrelenebilir proje seçkisi, dinamik proje detayları, doğrulanan iletişim formu, ölçülü GSAP/Lenis hareket sistemi, isteğe bağlı WebGL katmanı, SEO çıktıları ve gömülü Sanity Studio altyapısı içerir. Ödeme, kullanıcı hesabı, sipariş takibi, gerçek e-posta teslimi ve CMS'den canlı pazarlama içeriği bu sürümün kapsamında değildir.

## Ana rotalar

| Rota               | Amaç                                                           |
| ------------------ | -------------------------------------------------------------- |
| `/`                | Etkileşimli ana sayfa ve seçili portföy kayıtları              |
| `/projects`        | Kategori filtreli gerçek proje arşivi                          |
| `/projects/[slug]` | Statik üretilen proje arşiv kaydı ve görsel aktarım durumu     |
| `/services`        | Hizmet kapsamları                                              |
| `/packages`        | Doğrulanmış tasarım paketi kapsamları                          |
| `/about`           | Göknur Uygur Akaydın'ın yaklaşımı, eğitimi ve deneyimi         |
| `/contact`         | Erişilebilir proje talep formu                                 |
| `/api/contact`     | Zod doğrulamalı iletişim API'si                                |
| `/studio`          | Sanity yapılandırılmışsa gömülü Studio; değilse kurulum ekranı |

`robots.txt`, `sitemap.xml`, web manifesti, Open Graph ve Twitter görselleri Next.js Metadata API ile üretilir.

## Teknoloji yığını

- Next.js `16.2.10`, React `19.2.7` ve strict TypeScript
- Tailwind CSS 4 ve `src/app/globals.css` içindeki özel CSS tokenları
- GSAP, `@gsap/react` ve Lenis
- Three.js, React Three Fiber ve Drei; yalnız isteğe bağlı WebGL hero için
- React Hook Form, Zod ve `@hookform/resolvers`
- Sanity, Next Sanity, Portable Text ve Sanity Image URL
- Vitest, React Testing Library, Playwright ve axe-core
- ESLint 9, Prettier 3, Husky ve lint-staged
- pnpm `11.13.0`

Ayrıntılar için [ARCHITECTURE.md](./ARCHITECTURE.md), [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md), [ANIMATION_GUIDE.md](./ANIMATION_GUIDE.md) ve [CONTENT_GUIDE.md](./CONTENT_GUIDE.md) belgelerine bakın.

## Önkoşullar

| Araç     | Gereksinim                                                                               |
| -------- | ---------------------------------------------------------------------------------------- |
| Node.js  | `>=24.0.0 <25`; depo `.node-version` ile `24.15.0`, `.nvmrc` ile ana sürüm `24` tanımlar |
| pnpm     | `11.13.0`; `package.json#packageManager` kaynak kabul edilir                             |
| Corepack | pnpm sürümünü etkinleştirmek için önerilir                                               |
| Git      | Branch ve katkı akışı için gerekir                                                       |
| Chromium | Yalnız Playwright E2E testleri için gerekir                                              |

Komut örnekleri Windows PowerShell içindir. Node, pnpm ve Git'in kullanılabilir olduğunu doğrulayın:

```powershell
node --version
pnpm --version
git --version
```

## Kurulum

Yeni bir çalışma kopyası için:

```powershell
git clone https://github.com/akaydinmurat/WebSite.git
Set-Location WebSite
corepack enable
pnpm install --frozen-lockfile
Copy-Item .env.example .env.local
```

`pnpm` zaten doğru sürümdeyse `corepack enable` adımı gerekmez. Bağımlılık sürümlerini yeniden çözmemek için normal kurulumda `--frozen-lockfile` kullanın.

`.env.local` yalnız yerel makinede tutulur. Bu dosyayı, tokenları veya servis kimlik bilgilerini Git'e eklemeyin.

## Ortam değişkenleri

| Değişken                         | Kapsam                       | Varsayılan / davranış                                                            |
| -------------------------------- | ---------------------------- | -------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`           | Her ortam                    | `http://localhost:3000`; canonical origin, sonunda `/` olmamalı                  |
| `NEXT_PUBLIC_ENABLE_WEBGL_HERO`  | İsteğe bağlı istemci bayrağı | Varsayılan `true`; `false` CSS fallback'i zorlar                                 |
| `NEXT_PUBLIC_SANITY_PROJECT_ID`  | İsteğe bağlı, herkese açık   | Boşsa Sanity devre dışıdır                                                       |
| `NEXT_PUBLIC_SANITY_DATASET`     | İsteğe bağlı, herkese açık   | `production`                                                                     |
| `NEXT_PUBLIC_SANITY_API_VERSION` | İsteğe bağlı, herkese açık   | Boşsa kod `2026-03-01` kullanır                                                  |
| `SANITY_API_READ_TOKEN`          | İsteğe bağlı, yalnız sunucu  | Özel veri kümesi veya gelecekteki taslak önizleme için ayrılmıştır               |
| `SANITY_REVALIDATE_SECRET`       | İsteğe bağlı, yalnız sunucu  | Gelecekteki webhook yeniden doğrulaması için ayrılmıştır; mevcut sürüm kullanmaz |

Örnek değerleri `.env.example` dosyasında tutun; gerçek gizli değerleri yalnız `.env.local` ve dağıtım sağlayıcısının şifreli ortam ayarlarında tanımlayın. Ortam değişkeni değiştiğinde geliştirme sunucusunu yeniden başlatın.

## Geliştirme ve önizleme

Yerel geliştirme sunucusu:

```powershell
pnpm dev
```

Site `http://localhost:3000` adresinde açılır.

Aynı yerel ağdaki başka bir cihazdan önizlemek için:

```powershell
pnpm dev --hostname 0.0.0.0 --port 3000
ipconfig
```

`ipconfig` çıktısındaki etkin ağ bağdaştırıcısının IPv4 adresini kullanarak diğer cihazda `http://<IPv4-adresi>:3000` adresini açın. İki cihaz aynı ağda olmalı; Windows Güvenlik Duvarı sorarsa yalnız güvenilen özel ağ için Node.js erişimine izin verin. Bu sunucu üretim yayını değildir.

Üretim derlemesini yerelde önizlemek için:

```powershell
pnpm build
pnpm start
```

## Komutlar

| Komut               | Açıklama                                                                   |
| ------------------- | -------------------------------------------------------------------------- |
| `pnpm dev`          | Next.js geliştirme sunucusunu başlatır                                     |
| `pnpm build`        | Üretim derlemesi oluşturur                                                 |
| `pnpm start`        | Oluşturulmuş üretim derlemesini çalıştırır                                 |
| `pnpm lint`         | ESLint'i sıfır uyarı politikasıyla çalıştırır                              |
| `pnpm typecheck`    | TypeScript'i çıktı üretmeden denetler                                      |
| `pnpm format`       | Prettier ile desteklenen dosyaları biçimlendirir                           |
| `pnpm format:check` | Biçimi değiştirmeden denetler                                              |
| `pnpm test`         | Vitest testlerini bir kez çalıştırır                                       |
| `pnpm test:watch`   | Vitest izleme modunu açar                                                  |
| `pnpm test:e2e`     | Playwright'ın masaüstü ve mobil Chromium projelerini çalıştırır            |
| `pnpm test:e2e:ui`  | Playwright arayüzünü açar                                                  |
| `pnpm check`        | Format, lint, typecheck, unit test ve production build kapısını çalıştırır |

`pnpm check`, E2E testlerini içermez. Playwright tarayıcısı mevcutsa teslim öncesinde ayrıca `pnpm test:e2e` çalıştırın.

## Test ve build akışı

Dar kapsamlı geliştirme sırasında ilgili testi; teslim öncesinde tam kalite kapısını çalıştırın:

```powershell
pnpm format:check
pnpm lint
pnpm typecheck
pnpm test
pnpm test:e2e
pnpm build
```

Playwright yalnızca Chromium eksikliği bildirirse proje kapsamındaki tarayıcıyı kurun:

```powershell
pnpm exec playwright install chromium
```

E2E yapılandırması uygulamayı `127.0.0.1:3100` üzerinde başlatır; masaüstü Chromium ve Pixel 7 profillerini kullanır. Ölçülmemiş Lighthouse skoru veya çalıştırılmamış test sonucu raporlamayın.

## Sanity CMS

Sanity bu sürümde isteğe bağlıdır. Geçerli herkese açık ayarlar yoksa istemci oluşturulmaz, `/studio` kurulum açıklaması gösterir ve build yerel içerikle çalışır.

Temel etkinleştirme sırası:

1. Sanity'de proje ve veri kümesi oluşturun.
2. `.env.local` içinde `NEXT_PUBLIC_SANITY_PROJECT_ID`, veri kümesi ve API tarihini tanımlayın.
3. Sanity CORS ayarlarına yerel ve üretim origin'lerini ekleyin.
4. `pnpm dev` çalıştırıp `/studio` üzerinden oturum açın.
5. Site ayarları, kategoriler, malzemeler, projeler, hizmetler ve paketleri yayımlayın.

Şema, typed sorgu ve güvenli fallback yardımcıları hazırdır. Ancak mevcut pazarlama sayfaları içerikleri doğrudan `src/content` altındaki yerel kaynaklardan okur; yalnız ortam değişkenlerini tanımlamak yayımlanmış Sanity içeriğini otomatik olarak siteye taşımaz. CMS'i ana veri kaynağı yapmak için sayfa ve bölüm bileşenlerinin `src/lib/sanity` sorgu yardımcılarına geçirilmesi gerekir.

Ayrıntılı kurulum için [SANITY_SETUP.md](./SANITY_SETUP.md) belgesini izleyin.

## Doğrulanmış içerik ve gerçek görsel aktarımı

Proje adları, yılları, konumları, hizmetler ve paket kapsamları mevcut canlı siteden doğrulanmıştır. Fiyat, süre ve revizyon sayısı kaynakta bulunmadığı için üretilmemiştir. Gerçek yayından önce:

1. Marka, iletişim ve bölüm metinlerindeki son onayı `src/config/site.ts` üzerinden yapın.
2. Navigasyon değişecekse tek kaynak olan `src/config/navigation.ts` dosyasını düzenleyin.
3. Proje anlatıları ile paketlerin operasyonel ayrıntılarını yalnız doğrulanmış yeni bilgiler geldikçe `src/content` altında genişletin veya Sanity veri akışını tamamlayın.
4. Hero SVG'sini ve `public/images/placeholders` altındaki demo varlıkları lisanslı, yerel AVIF/WebP görsellerle değiştirin.
5. `src/components/projects/project-visual.tsx` içindeki slug–görsel eşlemesini gerçek dosya yollarına göre güncelleyin; `unoptimized` kullanımını gerçek raster varlıklar için yeniden değerlendirin.
6. Her içerik görseline bağlama özgü alt metin, doğru boyut/oran ve responsive `sizes` sağlayın.
7. Görsel aktarım notlarını ve proje `noIndex` durumunu yalnız gerçek ve onaylı renderlar yerleştirildikten sonra kaldırın.

İçerik kuralları ve yayın kontrol listesi için [CONTENT_GUIDE.md](./CONTENT_GUIDE.md) belgesine bakın.

## Feature flag'ler

Mevcut tek ürün bayrağı `NEXT_PUBLIC_ENABLE_WEBGL_HERO`'dur.

- `false`: Varsayılan ve önerilen durumdur; pointer konumunu CSS custom property ile güncelleyen iki katmanlı hero çalışır.
- `true`: WebGL destekli, fine-pointer bir cihazda ve reduced motion kapalıysa dinamik React Three Fiber katmanı yüklenir.

Bayrağın `true` olması CSS fallback'i kaldırmaz. Gerçek render varlıkları, düşük kabiliyetli cihaz testleri ve performans ölçümü tamamlanmadan üretimde etkinleştirmeyin.

## İletişim formu durumu

Form hem istemcide hem `/api/contact` rotasında Zod ile doğrulanır; JSON içerik türü, 16 KiB gövde sınırı ve honeypot kontrolü uygulanır.

- Geliştirmede istek doğrulanır fakat e-posta gönderilmez; yanıt bunu açıkça belirtir.
- Üretimde gerçek sağlayıcı yapılandırılmadığı için API `503` döndürür.
- Üretime açmadan önce sunucu taraflı bir e-posta sağlayıcısı ve dağıtık/IP duyarlı rate limit eklenmelidir.

## Vercel'e dağıtım

1. Doğrulanmış feature branch'i GitHub'a gönderin ve pull request açın.
2. İncelemeden sonra `main` ile birleştirin.
3. Depoyu Vercel'e içe aktarın; root directory depo kökü, framework preset `Next.js` olarak kalmalıdır.
4. Vercel, `packageManager` alanından pnpm `11.13.0` kullanmalıdır. Özel output directory tanımlamayın.
5. En az `NEXT_PUBLIC_SITE_URL` değerini gerçek HTTPS origin'iyle tanımlayın. Sanity kullanılacaksa ilgili public değerleri; gizli değer gerekiyorsa yalnız Vercel'in Environment Variables alanını kullanın.
6. Production ve gerekiyorsa Preview ortamlarını ayrı ayrı yapılandırıp deploy edin.
7. Ana sayfa, proje detayı, iletişim formunun beklenen üretim davranışı, metadata, `robots.txt`, `sitemap.xml` ve `/studio` için smoke test yapın.

Build'in başarılı olması, iletişim formunun e-posta teslimine hazır olduğu anlamına gelmez.

## Wix alan adı ve DNS genel bakışı

DNS'i Codex veya uygulama kodu üzerinden değiştirmeyin. Alan adını önce Vercel projesine ekleyin; ardından Vercel'in o alan adı için gösterdiği güncel DNS kayıtlarını Wix'teki alan adı DNS yönetimine aynen girin.

Genel akış:

1. Vercel'de hem kök alan adını hem tercih ediliyorsa `www` alt alanını ekleyin.
2. Vercel'in doğrulama ekranında gösterdiği A, CNAME veya doğrulama kaydını not edin. Sabit IP ya da hedef tahmin etmeyin.
3. Wix'te **Domains → ilgili alan adı → DNS Records** bölümünü açın ve kayıtları ekleyin.
4. Yalnız aynı host için çakışan eski kayıtları, etkisini doğruladıktan sonra değiştirin. E-posta için kullanılan MX/TXT kayıtlarına dokunmayın.
5. DNS yayılımı ve Vercel doğrulaması tamamlandıktan sonra HTTPS sertifikasını kontrol edin.
6. Canonical origin ile `www`/non-`www` yönlendirme tercihini tekilleştirin ve `NEXT_PUBLIC_SITE_URL` değerini buna göre güncelleyin.

Nameserver'ları Wix'ten taşımak zorunlu değildir; Vercel'in proje ekranındaki güncel talimat her zaman kaynak kabul edilmelidir.

## Git iş akışı

Aktif geliştirme branch'i:

```text
feat/premium-interior-showroom
```

Önerilen akış:

```powershell
git status
git switch feat/premium-interior-showroom
pnpm check
pnpm test:e2e
git add <değişen-dosyalar>
git commit -m "feat: describe the verified change"
git push -u origin feat/premium-interior-showroom
```

`main` üzerinde doğrudan commit atmayın. Commit mesajları İngilizce ve Conventional Commits biçiminde olmalı; ilgisiz değişiklikleri aynı commit'e almayın. Force push, `git reset --hard`, `git clean -fd` ve kullanıcı değişikliklerini kaybettiren işlemler yasaktır. Ayrıntılı katkı kuralları için [CONTRIBUTING.md](./CONTRIBUTING.md) ve [AGENTS.md](./AGENTS.md) belgelerini okuyun.

## Sorun giderme

### Node veya pnpm sürümü uyuşmuyor

`node --version` çıktısı 24.x, `pnpm --version` çıktısı 11.13.0 olmalıdır. Yeni terminal açın; kullandığınız sürüm yöneticisinde `.node-version`, `.nvmrc` ve `package.json#packageManager` değerlerini kaynak alın. Ardından `pnpm install --frozen-lockfile` çalıştırın.

PowerShell `pnpm` komutunu bulamazsa Corepack üzerinden doğrudan çalıştırın:

```powershell
corepack.cmd pnpm dev
```

### Port 3000 kullanımda

Farklı port seçin:

```powershell
pnpm dev --port 3001
```

Bu durumda `NEXT_PUBLIC_SITE_URL` değerini de kullandığınız origin ile eşleştirin.

### `/studio` yalnız kurulum ekranını gösteriyor

`NEXT_PUBLIC_SANITY_PROJECT_ID` değerini ve biçimini kontrol edin, `.env.local` değişikliğinden sonra sunucuyu yeniden başlatın. Geçerli proje kimliği yalnız küçük harf ve rakam içerebilir. Ayrıntılar için `SANITY_SETUP.md` belgesini kullanın.

### WebGL katmanı görünmüyor

Bayrağın tam olarak `true` olduğundan emin olun. Katman; touch/coarse-pointer cihazlarda, `prefers-reduced-motion` açıkken veya WebGL desteği yokken bilinçli olarak devre dışı kalır. CSS hero'nun görünmesi beklenen fallback davranışıdır.

### Playwright tarayıcı yürütülebilir dosyası bulunamıyor

```powershell
pnpm exec playwright install chromium
pnpm test:e2e
```

Yalnız Chromium'u kurun; sistem bağımlılıklarını değiştiren ek kurulumları önce değerlendirin.

### Form yerelde e-posta göndermiyor veya üretimde `503` dönüyor

Bu, mevcut sürümün bilinçli davranışıdır. Yerel sağlayıcı yalnız doğrulama sonucu döndürür; production provider ve rate limit henüz uygulanmamıştır.
