# Güvenlik Rehberi

Bu sürüm gerçek ödeme, kullanıcı hesabı veya e-posta teslimi içermez. Güvenlik sınırı; statik içerik, Sanity'nin isteğe bağlı salt-okunur erişimi ve iletişim formu API'sidir.

## Uygulanan varsayılanlar

- Secret değerler client graph'ına alınmaz ve `.env.example` yalnız boş örnekler içerir.
- İletişim gövdesi yalnız JSON kabul eder, 16 KiB ile sınırlandırılır ve strict Zod şemasıyla doğrulanır.
- Honeypot alanı otomatik gönderimleri sessizce karşılar.
- Üretimde provider yapılandırılmadığında form açıkça `503` döndürür; sahte teslim başarısı verilmez.
- Yanıtlar `Cache-Control: no-store` kullanır.
- `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy` ve kısıtlı `Permissions-Policy` başlıkları uygulanır.
- Kullanıcı HTML'i render edilmez; `dangerouslySetInnerHTML` kullanılmaz.

## Üretim öncesi zorunlular

1. Sunucu tarafında çalışan güvenilir bir e-posta provider adaptörü ekleyin; credential'ı yalnız Vercel environment variable olarak tutun.
2. IP ve/veya doğrulanmış istemci sinyaline dayalı dağıtık rate limiting ekleyin. Proxy başlıklarına yalnız platform güven sınırı içinde güvenin.
3. Spam yüküne göre CAPTCHA alternatifi değerlendirin; erişilebilir ve gizlilik açısından ölçülü bir çözüm seçin.
4. Form saklama süresi, aydınlatma metni ve silme sürecini hukuki gereksinimlerle netleştirin.
5. Sanity token'ını minimum yetkiyle üretin; yalnız gerektiğinde server-side kullanın ve düzenli döndürün.
6. Vercel preview ve production environment'larını ayırın.

## Content Security Policy

CSP, Sanity Studio ve isteğe bağlı WebGL kaynakları doğrulanmadan katı header olarak etkinleştirilmemiştir. Önce `Content-Security-Policy-Report-Only` ile başlayın; `script-src`, `style-src`, `img-src`, `connect-src`, `font-src`, `frame-ancestors` ve Studio gereksinimlerini gerçek ağ trafiğiyle çıkarın. Inline izinlerini geniş wildcard ile çözmeyin. Raporlar temizlendikten sonra enforcement'a geçin.

## Secret ve log politikası

- `.env`, `.env.local`, token, webhook secret veya provider yanıt gövdesi commitlenmez.
- Form mesajı, e-posta ve telefon uygulama loglarına yazılmaz.
- Hata yanıtları iç stack trace, provider kimliği veya credential detayı döndürmez.
- Secret sızıntısı şüphesinde değeri hemen iptal edin, Git geçmişini ayrıca inceleyin ve yeni değer üretin.

## Bağımlılık ve operasyon

Lockfile değişikliklerini inceleyin, otomatik major yükseltme yapmayın ve framework güvenlik sürümlerini geciktirmeyin. `pnpm audit` sonucu tek başına yeterli değildir; etkilenen paket yolunu ve uygulamadaki erişilebilirliği değerlendirin. GitHub/Vercel erişimlerinde minimum yetki ve çok faktörlü kimlik doğrulama kullanın.

## Yayın kontrolü

- Production environment'ta debug veya demo credential yok.
- Form rate limit ve provider hata yolu test edildi.
- Güvenlik header'ları preview deployment üzerinde doğrulandı.
- CSP raporları incelendi.
- Dependency taraması ve production build geçti.
- İletişim verisi saklama ve silme sorumlusu belirlendi.
