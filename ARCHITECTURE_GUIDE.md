# 🏗️ E-Commerce Projesi - Feature-Sliced Design (FSD) Mimari Rehberi

Bu proje **Feature-Sliced Design** (FSD) mimarisini kullanır. Bu rehber, hangi dosyayı nereye koyacağınızı anlamanıza yardımcı olur.

## 📁 Proje Yapısı

```
src/
├── app/                    # Next.js App Router (Routes)
├── processes/              # Karmaşık iş süreçleri
├── pages/                  # Sayfa bileşenleri (FSD)
├── widgets/                # Bağımsız UI blokları
├── features/               # İş özellikleri
├── entities/               # İş varlıkları
├── shared/                 # Paylaşılan kod
└── styles/                 # Global stiller
```

## 🎯 Katman Açıklamaları ve Örnekler

### 1. 📱 **App Layer** (`src/app/`)

**Ne**: Next.js App Router rotaları ve layout'ları
**Ne zaman kullan**: Sayfa rotaları ve layout'lar için

```typescript
// ✅ Doğru yerleştirme örnekleri:
src / app / layout.tsx; // Ana layout
src / app / page.tsx; // Ana sayfa
src / app / client / products / page.tsx; // Ürünler sayfası
src / app / admin / dashboard / page.tsx; // Admin dashboard
src / app / api / users / route.ts; // API route'ları
```

### 2. 🔄 **Processes Layer** (`src/processes/`)

**Ne**: Karmaşık iş süreçleri, çok aşamalı operasyonlar
**Ne zaman kullan**: Birden fazla feature'ı koordine eden süreçler

```typescript
// ✅ Süreç örnekleri:
src/processes/
├── checkout-flow/           // Satın alma süreci
│   ├── model/              // Süreç state yönetimi
│   ├── ui/                 // Süreç UI bileşenleri
│   └── lib/                // Süreç mantığı
├── auth/                   // Kimlik doğrulama süreci
│   ├── login-flow.ts       // Giriş süreci
│   ├── register-flow.ts    // Kayıt süreci
│   └── password-reset.ts   // Şifre sıfırlama
└── order-management/       // Sipariş yönetimi
    ├── order-creation.ts   // Sipariş oluşturma
    ├── payment-processing.ts // Ödeme işleme
    └── order-tracking.ts   // Sipariş takibi
```

### 3. 📄 **Pages Layer** (`src/pages/`)

**Ne**: Sayfa-seviyesi bileşenler (Next.js App Router kullandığımız için bu katman yok)
**Alternatif**: `src/app/` kullanıyoruz

### 4. 🧩 **Widgets Layer** (`src/widgets/`)

**Ne**: Bağımsız, yeniden kullanılabilir UI blokları
**Ne zaman kullan**: Sayfalar arası paylaşılan büyük UI bileşenleri

```typescript
// ✅ Widget örnekleri:
src/widgets/
├── header/                 // Site başlığı
│   ├── index.tsx          // Ana header bileşeni
│   ├── search-bar.tsx     // Arama çubuğu
│   ├── user-dropdown.tsx  // Kullanıcı menüsü
│   ├── cart-dropdown.tsx  // Sepet menüsü
│   └── mobile-menu.tsx    // Mobil menü
├── footer/                 // Site altbilgisi
│   ├── index.tsx
│   ├── newsletter.tsx     // Newsletter kayıt
│   └── social-links.tsx   // Sosyal medya linkleri
├── sidebar/                // Kenar çubuğu
│   ├── filter-sidebar.tsx // Ürün filtreleri
│   └── category-tree.tsx  // Kategori ağacı
└── product-grid/           // Ürün listesi
    ├── index.tsx
    ├── product-card.tsx
    └── pagination.tsx
```

### 5. ⚡ **Features Layer** (`src/features/`)

**Ne**: İş özellikleri, kullanıcı etkileşimleri
**Ne zaman kullan**: Belirli bir işlev veya özellik için

```typescript
// ✅ Feature örnekleri:
src/features/
├── auth/                   // Kimlik doğrulama
│   ├── ui/
│   │   ├── login-form.tsx
│   │   ├── register-form.tsx
│   │   └── logout-button.tsx
│   ├── model/
│   │   ├── auth-store.ts   // Auth state
│   │   └── auth-types.ts
│   └── api/
│       └── auth-api.ts
├── add-to-cart/            // Sepete ekleme
│   ├── ui/
│   │   ├── add-to-cart-button.tsx
│   │   └── quantity-selector.tsx
│   ├── model/
│   │   └── cart-actions.ts
│   └── api/
│       └── cart-api.ts
├── product-search/         // Ürün arama
│   ├── ui/
│   │   ├── search-input.tsx
│   │   ├── search-filters.tsx
│   │   └── search-results.tsx
│   ├── model/
│   │   └── search-store.ts
│   └── api/
│       └── search-api.ts
├── wishlist/               // Favori listesi
│   ├── ui/
│   │   ├── wishlist-button.tsx
│   │   └── wishlist-modal.tsx
│   └── model/
│       └── wishlist-store.ts
└── product-review/         // Ürün yorumları
    ├── ui/
    │   ├── review-form.tsx
    │   ├── review-list.tsx
    │   └── rating-stars.tsx
    └── api/
        └── review-api.ts
```

### 6. 🏢 **Entities Layer** (`src/entities/`)

**Ne**: İş varlıkları, temel data modelleri
**Ne zaman kullan**: Uygulamanın temel kavramları için

```typescript
// ✅ Entity örnekleri:
src/entities/
├── user/                   // Kullanıcı varlığı
│   ├── model/
│   │   ├── types.ts       // User tipi
│   │   ├── store.ts       // User state
│   │   └── validation.ts  // User validasyonu
│   ├── api/
│   │   └── user-api.ts    // User API çağrıları
│   └── ui/
│       ├── user-card.tsx  // Kullanıcı kartı
│       └── user-avatar.tsx // Avatar bileşeni
├── product/                // Ürün varlığı
│   ├── model/
│   │   ├── types.ts       // Product tipi
│   │   ├── store.ts       // Product state
│   │   └── validation.ts
│   ├── api/
│   │   └── product-api.ts
│   └── ui/
│       ├── product-card.tsx
│       ├── product-image.tsx
│       └── product-price.tsx
├── cart/                   // Sepet varlığı
│   ├── model/
│   │   ├── types.ts       // Cart & CartItem tipleri
│   │   ├── store.ts       // Sepet state'i
│   │   └── calculations.ts // Fiyat hesaplamaları
│   ├── api/
│   │   └── cart-api.ts
│   └── ui/
│       ├── cart-item.tsx
│       └── cart-summary.tsx
├── order/                  // Sipariş varlığı
│   ├── model/
│   │   ├── types.ts
│   │   └── status.ts      // Sipariş durumları
│   ├── api/
│   │   └── order-api.ts
│   └── ui/
│       ├── order-card.tsx
│       └── order-status.tsx
└── category/               // Kategori varlığı
    ├── model/
    │   └── types.ts
    ├── api/
    │   └── category-api.ts
    └── ui/
        ├── category-badge.tsx
        └── category-tree.tsx
```

### 7. 🔧 **Shared Layer** (`src/shared/`)

**Ne**: Proje genelinde paylaşılan kod
**Ne zaman kullan**: Herhangi bir katmanda kullanılabilecek kod

```typescript
// ✅ Shared örnekleri:
src/shared/
├── ui/                     // Genel UI bileşenleri
│   ├── button/
│   │   ├── index.tsx
│   │   └── button.stories.ts
│   ├── input/
│   │   └── index.tsx
│   ├── modal/
│   │   └── index.tsx
│   └── loading/
│       └── spinner.tsx
├── lib/                    // Utility'ler ve helper'lar
│   ├── utils.ts           // Genel utility fonksiyonlar
│   ├── validation.ts      // Genel validasyon
│   ├── constants.ts       // Sabitler
│   ├── formatters.ts      // Format fonksiyonları
│   ├── storage.ts         // LocalStorage helper
│   └── api-client.ts      // API client config
├── api/                    // API konfigürasyonu
│   ├── client.ts          // HTTP client
│   ├── types.ts           // API tipleri
│   └── endpoints.ts       // API endpoint'leri
├── config/                 // Konfigürasyon
│   ├── env.ts             // Environment variables
│   ├── database.ts        // DB config
│   └── auth.ts            // Auth config
├── hooks/                  // Paylaşılan React hooks
│   ├── use-local-storage.ts
│   ├── use-debounce.ts
│   ├── use-api.ts
│   └── use-media-query.ts
└── types/                  // Global tipler
    ├── api.ts             // API response tipleri
    ├── common.ts          // Genel tipler
    └── navigation.ts      // Route tipleri
```

### 8. 🎨 **Styles Layer** (`src/styles/`)

**Ne**: Global stiller
**Ne zaman kullan**: Uygulama geneli stiller

```css
/* ✅ Stil örnekleri: */
src/styles/
├── globals.css            // Global CSS
├── components.css         // Component stilleri
├── utilities.css          // Utility sınıfları
└── variables.css          // CSS değişkenleri
```

## 🚀 Pratik Örnekler

### Senaryo 1: Yeni bir "Ürün Karşılaştırma" özelliği ekliyorsunuz

```typescript
// 1. Entity katmanında ürün karşılaştırma modeli
src/entities/product-comparison/
├── model/
│   ├── types.ts           // ComparisonList tipi
│   └── store.ts           // Karşılaştırma state'i
└── ui/
    └── comparison-badge.tsx // Karşılaştırma badge'i

// 2. Feature katmanında karşılaştırma özelliği
src/features/product-comparison/
├── ui/
│   ├── compare-button.tsx
│   ├── comparison-modal.tsx
│   └── comparison-table.tsx
├── model/
│   └── comparison-actions.ts
└── api/
    └── comparison-api.ts

// 3. Widget olarak karşılaştırma sayfası
src/widgets/comparison-widget/
├── index.tsx
├── comparison-header.tsx
└── comparison-grid.tsx
```

### Senaryo 2: Yeni bir "Canlı Destek" sistemi ekliyorsunuz

```typescript
// 1. Entity: Chat varlığı
src/entities/chat/
├── model/
│   ├── types.ts           // Message, ChatRoom tipleri
│   └── store.ts
└── ui/
    ├── message-bubble.tsx
    └── chat-avatar.tsx

// 2. Feature: Chat özellikleri
src/features/live-chat/
├── ui/
│   ├── chat-window.tsx
│   ├── message-input.tsx
│   └── chat-button.tsx
├── model/
│   └── chat-store.ts
└── api/
    └── chat-api.ts

// 3. Widget: Chat widget'ı
src/widgets/chat-widget/
├── index.tsx
├── chat-header.tsx
└── chat-body.tsx

// 4. Process: Müşteri destek süreci
src/processes/customer-support/
├── chat-initialization.ts
├── agent-assignment.ts
└── conversation-flow.ts
```

### Senaryo 3: Yeni bir sayfa ekliyorsunuz

```typescript
// 1. App Router'da sayfa
src/app/(client)/about/page.tsx

// 2. Sayfa-spesifik widget'lar
src/widgets/about-hero/
src/widgets/team-section/
src/widgets/company-values/

// 3. Gerekirse yeni feature'lar
src/features/contact-form/
src/features/newsletter-signup/
```

## ❌ Yaygın Hatalar ve Doğru Yaklaşımlar

### ❌ Yanlış:

```typescript
// Widget'dan feature'a import
src / widgets / header / index.tsx;
import { loginUser } from '../../features/auth/api';

// Entity'den üst katmanlara import
src / entities / user / api / index.ts;
import { showNotification } from '../../features/notifications';

// Shared'dan business logic
src / shared / lib / user - business - logic.ts;
```

### ✅ Doğru:

```typescript
// Feature'dan entity'ye import
src / features / auth / ui / login - form.tsx;
import { User } from '../../entities/user';

// Widget'dan feature'a import
src / widgets / header / index.tsx;
import { LoginButton } from '../../features/auth';

// Shared sadece generic kod
src / shared / lib / http - client.ts;
src / shared / ui / button / index.tsx;
```

## 📋 Dosya Yerleştirme Kontrol Listesi

Yeni bir dosya eklerken şu soruları sorun:

1. **Bu kod hangi katmanda?**
    - Business logic → Entities/Features
    - UI bileşeni → Widgets/Features/Entities
    - Sayfa → App
    - Utility → Shared

2. **Bu kod tekrar kullanılacak mı?**
    - Evet → Shared/Entities
    - Hayır → Features/App

3. **Bu kod business domain'e bağımlı mı?**
    - Evet → Entities/Features
    - Hayır → Shared

4. **Bu kod bir kullanıcı etkileşimi mi?**
    - Evet → Features
    - Hayır → Entities/Shared

Bu rehberi takip ederek kodunuzu doğru yere yerleştirabilir ve projenizin sürdürülebilirliğini artırabilirsiniz! 🎯
