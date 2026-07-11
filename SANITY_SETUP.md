# Sanity CMS Kurulumu

Sanity entegrasyonu başlangıçta isteğe bağlıdır. Ortam değişkenleri tanımlı değilken site yerel yedek içeriği kullanır; `/studio` rotası kurulum bilgisini gösterir ve üretim derlemesi başarısız olmaz.

## İçerik modeli

Studio şu şemaları içerir:

- `project`: proje anlatısı, görseller, planlar, malzemeler ve öncesi/sonrası içeriği
- `projectCategory`: proje filtreleri ve sıralaması
- `service`: hizmet içeriği ve teslimler
- `package`: tasarım paketi kapsamı, revizyon, süre ve fiyat notu
- `material`: malzeme paleti
- `siteSettings`: tekil marka, iletişim ve varsayılan SEO ayarları
- `seo`, `imageWithAlt`, `blockContent`: yeniden kullanılabilir nesneler

Tüm `imageWithAlt` alanlarında alternatif metin zorunludur. Hotspot özelliği açıktır; mobil ve masaüstü kırpımları oluşturulurken odak noktası korunur.

## 1. Sanity projesini oluşturma

1. [Sanity Manage](https://www.sanity.io/manage) üzerinden bir hesapla oturum açın.
2. Yeni bir proje oluşturun veya mevcut projeyi seçin.
3. Proje kimliğini (`Project ID`) kopyalayın.
4. Veri kümesi olarak varsayılan `production` kümesini kullanın ya da seçtiğiniz veri kümesinin adını not edin.

Bu işlem ilk geliştirme ve derleme için zorunlu değildir; gerçek içerik girişi başlayacağı zaman yapılabilir.

## 2. Yerel ortam değişkenleri

Kök dizindeki `.env.example` dosyasını `.env.local` adıyla kopyalayın. Değerleri yalnızca `.env.local` içinde doldurun:

```dotenv
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2026-03-01
SANITY_API_READ_TOKEN=
SANITY_REVALIDATE_SECRET=
```

- `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET` ve API tarihi herkese açık istemci ayarlarıdır; gizli anahtar değildir.
- `SANITY_API_READ_TOKEN` yalnızca özel veri kümeleri, taslak önizleme veya Live Content etkinleştirilecekse gerekir. Mevcut yayınlanmış içerik sorguları token kullanmaz.
- `SANITY_REVALIDATE_SECRET`, ileride webhook tabanlı yeniden doğrulama eklendiğinde kullanılacaktır.
- `SANITY_API_READ_TOKEN` ve `SANITY_REVALIDATE_SECRET` değerlerine hiçbir zaman `NEXT_PUBLIC_` öneki eklemeyin.
- `.env.local` dosyasını Git'e eklemeyin.

Değişikliklerden sonra geliştirme sunucusunu yeniden başlatın.

## 3. Studio'yu açma

```powershell
pnpm dev
```

Tarayıcıda `http://localhost:3000/studio` adresini açın. İlk erişimde Sanity oturumu istenir. Studio yapılandırması bu projeye gömülüdür; ayrıca bağımsız bir Studio dağıtımı gerekmez.

Studio'ya erişim sorunu yaşanırsa Sanity proje ayarlarında CORS kaynaklarına şunları ekleyin:

- `http://localhost:3000` — yerel geliştirme
- Gerçek Vercel alan adı — üretim

Kimlik bilgilerine izin vermeyi yalnızca Studio oturumu için gerektiğinde etkinleştirin. Joker (`*`) üretim kaynağı eklemeyin.

## 4. İlk içerik sırası

1. `Site Ayarları` belgesini doldurup yayımlayın. Bu bölüm Studio'da tekil belge olarak sabitlenmiştir.
2. Proje kategorilerini oluşturun.
3. Malzemeleri oluşturun.
4. Projeleri ekleyin; kapak görseli, galeri ve alternatif metinleri tamamlayın.
5. Hizmetleri ve tasarım paketlerini ekleyin.
6. İçeriği yayımlayın. Taslaklar varsayılan web sitesi sorgularında görünmez.

Görsel alternatif metni, görselin dosya adını değil içerikteki amacını anlatmalıdır. Dekoratif olmayan her görsel için kısa ve özgül bir açıklama kullanın.

## 5. Yerel yedek içerik davranışı

Sorgu yardımcıları çağıranın sağladığı yerel içeriği yedek olarak kabul eder:

```ts
const projects = await getProjects(localProjects);
const project = await getProjectBySlug(slug, localProject);
```

Sanity ayarları yoksa ağ isteği yapılmaz. Sanity geçici olarak erişilemezse de aynı yedek değer döndürülür. Böylece CMS kurulumu, yayın sitesinin çalışması için tek hata noktası hâline gelmez.

## 6. Vercel ayarları

Vercel proje ayarlarında en az şu değişkenleri Production ve Preview ortamlarına ekleyin:

- `NEXT_PUBLIC_SANITY_PROJECT_ID`
- `NEXT_PUBLIC_SANITY_DATASET`
- `NEXT_PUBLIC_SANITY_API_VERSION`

Taslak önizleme veya webhook eklendiğinde ilgili gizli değerleri yalnızca Vercel'in şifreli ortam değişkeni alanında tanımlayın. Değerleri build loglarına yazdırmayın.

## 7. Doğrulama

```powershell
pnpm typecheck
pnpm build
```

İki durumu da doğrulayın:

1. Sanity değişkenleri olmadan site ve `/studio` kurulum ekranı derlenir.
2. Geçerli proje ayarlarıyla `/studio` açılır ve yayımlanmış içerik sorgulanır.

Gömülü Studio düzeni ve `NextStudio` kullanımı [resmî Sanity Next.js rehberini](https://www.sanity.io/docs/nextjs/embedding-sanity-studio-in-nextjs), şema tanımları ise [resmî şema rehberini](https://www.sanity.io/docs/next-js-quickstart/defining-a-schema) izler.
