# İçerik Rehberi

Sitedeki marka, biyografi, proje adları/yılları/konumları ve paket kapsamları önceki canlı siteden doğrulanmıştır. Proje görselleri hâlen yer tutucudur; fiyat, süre, revizyon, ödül veya metrik bilgisi kaynakta yoksa üretilmemelidir.

## Kaynaklar

- Marka, domain ve ortak metinler: `src/config/site.ts`
- Navigasyon: `src/config/navigation.ts`
- Yerel proje fallback'i: `src/content/fallback-projects.ts`
- Hizmet fallback'i: `src/content/fallback-services.ts`
- Paket fallback'i: `src/content/fallback-packages.ts`
- CMS modelleri: `src/sanity/schemaTypes`

Sanity yapılandırılmadığında yerel içerik üretim build'ini ve rotaları ayakta tutar. CMS geçiş adımları `SANITY_SETUP.md` içindedir.

## Yazım dili

- Kamusal içerik Türkçe, kısa ve somut olmalıdır.
- Başlıklarda cümle düzeni kullanın; gereksiz tamamı büyük harften kaçının.
- Kanıtlanamayan üstünlük, başarı veya teslim sözü kullanmayın.
- “Yer tutucu görsel”, “görsel aktarımı sürüyor” ve “proje kapsamına göre” ifadelerini ilgili alanlarda görünür tutun.
- Teknik CMS alan adları, slug'lar ve kaynak kod tanımlayıcıları İngilizce kalır.

## Projeler

Her gerçek proje için en az başlık, benzersiz slug, kategori, kısa özet, kavramsal anlatı, doğrulanmış proje bilgileri, kapak, galeri, alt metinler ve SEO özeti sağlayın. Konum, yıl veya alan bilinmiyorsa değer uydurmayın; alanı yayımdan kaldırın veya açıkça belirtin.

Görsel sırası bir vaka çalışması anlatısı kurmalıdır: kapak, mekânsal bağlam, ana hacimler, detaylar ve malzeme yaklaşımı. Aynı render'ın gereksiz kırpımlarını galeri doldurmak için çoğaltmayın.

## Paketler ve hizmetler

Paket fiyatı, revizyon ve teslim süresi gerçek operasyonel karar verilmeden yayımlanmamalıdır. Mevcut `null` fiyat yapısı korunur; kullanıcıya özel teklif gerektiği açıkça söylenir. Dahil olan ve olmayan hizmetler aynı netlikte tanımlanmalıdır.

## Görseller

- Yalnız kullanım hakkı doğrulanmış yerel varlıkları ekleyin.
- Dosya adlarını küçük harf, `kebab-case` ve anlamlı tutun.
- Dekoratif görsel `alt=""`; içerik görseli bağlamı aktaran kısa Türkçe alt metin kullanır.
- Alt metinde “görseli” demek yerine mekân, bakış ve önemli malzemeyi tarif edin.
- Sanity görsellerinde alt metin zorunlu, caption isteğe bağlıdır; önemli kırpımlar için hotspot ayarlayın.
- Export ve boyut kuralları için `PERFORMANCE.md` belgesini izleyin.

## Yayın kontrolü

1. Yer tutucu etiketi gerçek görsel aktarımıyla birlikte doğru güncellendi mi?
2. Tüm olgular proje sahibi tarafından doğrulandı mı?
3. Görsel lisansı ve kişisel veri kontrol edildi mi?
4. Başlık sırası, alt metin ve link metinleri anlamlı mı?
5. Mobil kırpım ve `sizes` davranışı kontrol edildi mi?
6. Metadata ve sitemap çıktısı güncel mi?
