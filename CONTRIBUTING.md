# Katkı Rehberi

Bu depo, Göknur Uygur Akaydın için Next.js App Router tabanlı premium dijital showroom'u içerir. Arayüz metinleri Türkçe; kaynak kodu, tanımlayıcılar, dosya adları, teknik yorumlar ve commit mesajları profesyonel İngilizce olmalıdır. Ayrıntılı uygulama kuralları için `AGENTS.md` dosyasını okuyun.

## Yerel kurulum

Gereksinimler:

- Node.js 24 (`.nvmrc` ve `.node-version` kaynak kabul edilir)
- Corepack
- pnpm 11.13.0 (`package.json#packageManager` kaynak kabul edilir)

Kurulum ve geliştirme:

```powershell
corepack enable
pnpm install --frozen-lockfile
Copy-Item .env.example .env.local
pnpm dev
```

`.env.local` yalnızca yerel makinede tutulmalı; token, parola veya servis kimliği hiçbir zaman commit edilmemeli, terminal çıktısında paylaşılmamalıdır. Sanity değerleri yoksa uygulama doğrulanmış yerel fallback içeriğiyle çalışmayı sürdürmelidir. WebGL hero varsayılan olarak kapalıdır.

## Çalışma biçimi

1. Değişiklikten önce `git status` ve mevcut branch'i kontrol edin; devam eden merge/rebase olmadığını doğrulayın.
2. `main` üzerinde çalışmayın. Özellik geliştirmeleri `feat/premium-interior-showroom` branch'inde yapılır.
3. Kullanıcıya ait değişiklikleri koruyun; anlamlı dosyaları silmeyin veya üzerine yazmayın.
4. Değişikliği küçük, amaçlı ve test edilebilir tutun. Yeni bağımlılık yalnızca gerçekten kullanılacaksa eklenmelidir.
5. İlgili unit/component testlerini ve kritik kullanıcı akışları için Playwright testlerini ekleyin veya güncelleyin.
6. Aşağıdaki kalite kapısını çalıştırıp hataları düzeltin.
7. Commit gerekiyorsa Conventional Commits biçiminde, odaklı ve İngilizce mesaj kullanın. Açık talep olmadan push veya merge yapmayın.

Yasak Git işlemleri: `git reset --hard`, `git clean -fd`, force push ve kullanıcı değişikliklerini kaybettirecek benzer komutlar.

## Doğrulama

Hızlı kontroller:

```powershell
pnpm format:check
pnpm lint
pnpm typecheck
pnpm test
```

Playwright Chromium ilk kez gerekiyorsa yalnızca proje kapsamına kurun:

```powershell
pnpm exec playwright install chromium
pnpm test:e2e
```

Teslim öncesi tam kapı:

```powershell
pnpm check
```

`check`; biçim denetimi, lint, TypeScript, unit testleri ve üretim build'ini kapsamalıdır. Tarayıcı mevcutsa E2E testlerini ayrıca çalıştırın. Bir komutu gerçekten başarıyla çalıştırmadan geçtiğini belirtmeyin; Playwright veya Lighthouse çalıştırılmadıysa sonuç ya da skor üretmeyin.

## Pull request kontrol listesi

- Server Component varsayılanı korundu; Client Component sınırları etkileşimli yapraklarda kaldı.
- 360, 768, 1024, 1440 ve 1920 piksel düzenları ile yatay taşma kontrol edildi.
- Klavye, görünür focus, reduced motion ve WCAG 2.2 AA gereksinimleri gözden geçirildi.
- Görseller `next/image`, doğru `sizes`, sabit oran ve doğru LCP önceliğiyle kullanıldı; alt metinleri anlamlı.
- Animasyon, observer, ticker ve WebGL kaynakları unmount sırasında temizleniyor; JavaScript/WebGL olmadan içerik erişilebilir.
- Testler davranışı kapsıyor; animasyon karelerine bağlı kırılgan snapshot eklenmedi.
- Yeni ortam değişkenleri `.env.example` ve ilgili belgelerde yalnız örnek değerlerle açıklandı.
- Konsol hatası, hydration uyarısı, geçersiz DOM, eksik key, bozuk rota veya focus kaybı yok.
- Yer tutucu görseller açıkça işaretli; sahte müşteri, ödül, metrik, referans ya da doğrulanmamış proje ayrıntısı bulunmuyor.
