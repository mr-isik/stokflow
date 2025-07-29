# E-Commerce Proje Mimarisi Dokümantasyonu

## 📋 İçindekiler

1. [Genel Bakış](#genel-bakış)
2. [Teknoloji Stack](#teknoloji-stack)
3. [Feature-Sliced Design (FSD) Mimarisi](#feature-sliced-design-fsd-mimarisi)
4. [Dizin Yapısı](#dizin-yapısı)
5. [Katman Detayları](#katman-detayları)
6. [Route Yapısı](#route-yapısı)
7. [State Management](#state-management)
8. [API İstemci Yapısı](#api-istemci-yapısı)
9. [Stil ve UI](#stil-ve-ui)
10. [Geliştirme Kılavuzu](#geliştirme-kılavuzu)

## 🎯 Genel Bakış

Bu proje, modern web teknolojileri kullanılarak geliştirilmiş bir e-ticaret uygulamasıdır. Feature-Sliced Design (FSD) mimarisi prensiplerine uygun olarak yapılandırılmıştır. Bu mimari, kodun ölçeklenebilir, sürdürülebilir ve takım çalışmasına uygun olmasını sağlar.

## 🛠 Teknoloji Stack

### Frontend Framework & Kütüphaneler

- **Next.js 15.4.4** - React tabanlı full-stack framework (App Router)
- **React 19.1.0** - UI kütüphanesi
- **TypeScript 5** - Tip güvenliği
- **Tailwind CSS 4** - Utility-first CSS framework
- **HeroUI** - Modern React UI bileşen kütüphanesi
- **Framer Motion** - Animasyon kütüphanesi

### Geliştirme Araçları

- **ESLint** - Kod kalitesi ve standartları
- **PostCSS** - CSS işleme
- **Turbopack** - Hızlı geliştirme sunucusu

### HTTP İstemci

- **Axios** - HTTP istekleri için

## 🏗 Feature-Sliced Design (FSD) Mimarisi

Bu proje, Feature-Sliced Design metodolojisini kullanmaktadır. FSD, frontend uygulamalarını organize etmek için geliştirilmiş modern bir mimaridir.

### FSD Katmanları (Yukarıdan Aşağıya)

1. **app** - Uygulama başlatma ve global konfigürasyon
2. **processes** - Karmaşık iş süreçleri (cross-feature etkileşimler)
3. **pages** - Sayfa bileşenleri (Next.js App Router ile entegre)
4. **widgets** - Bağımsız UI blokları
5. **features** - İş değeri taşıyan kullanıcı etkileşimleri
6. **entities** - İş varlıkları
7. **shared** - Yeniden kullanılabilir kod

## 📁 Dizin Yapısı

```
src/
├── app/                    # Uygulama katmanı
│   ├── layout.tsx         # Ana layout
│   ├── page.tsx           # Ana sayfa
│   ├── (admin)/           # Admin route grubu
│   │   ├── dashboard/
│   │   └── products/
│   ├── (auth)/            # Kimlik doğrulama route grubu
│   │   ├── login/
│   │   └── signup/
│   └── (client)/          # Müşteri route grubu
│       ├── cart/
│       ├── checkout/
│       └── products/
├── processes/             # İş süreçleri
│   ├── auth/
│   └── checkout-flow/
├── widgets/               # UI widget'ları
├── features/              # Özellikler
│   ├── add-to-cart/
│   ├── auth/
│   ├── checkout/
│   └── product-search/
├── entities/              # İş varlıkları
│   ├── cart/
│   ├── product/
│   └── user/
├── shared/                # Paylaşılan kod
│   ├── api/
│   ├── config/
│   └── lib/
└── styles/
    └── globals.css
```

## 🔍 Katman Detayları

### 1. App Katmanı (`src/app/`)

- **Amaç**: Uygulama başlatma, routing ve global konfigürasyon
- **İçerik**:
  - Next.js App Router sayfaları
  - Layout bileşenleri
  - Global providers
  - Route grupları

#### Route Grupları:

- `(admin)/` - Yönetici paneli sayfaları
- `(auth)/` - Kimlik doğrulama sayfaları
- `(client)/` - Müşteri sayfaları

### 2. Processes Katmanı (`src/processes/`)

- **Amaç**: Birden fazla feature'ı koordine eden karmaşık iş süreçleri
- **Örnekler**:
  - `auth/` - Kimlik doğrulama süreçleri
  - `checkout-flow/` - Sipariş tamamlama süreci

### 3. Widgets Katmanı (`src/widgets/`)

- **Amaç**: Bağımsız, yeniden kullanılabilir UI blokları
- **Örnekler**: Header, Footer, Sidebar, ProductCard grid'leri

### 4. Features Katmanı (`src/features/`)

- **Amaç**: Kullanıcı değeri taşıyan işlevsellikler
- **Mevcut Features**:
  - `add-to-cart/` - Sepete ekleme işlevi
  - `auth/` - Giriş/çıkış işlemleri
  - `checkout/` - Ödeme işlemleri
  - `product-search/` - Ürün arama

#### Feature Yapısı:

```
feature/
├── ui/           # UI bileşenleri
├── model/        # State management
├── api/          # API çağrıları
└── lib/          # Yardımcı fonksiyonlar
```

### 5. Entities Katmanı (`src/entities/`)

- **Amaç**: İş domain'ine ait temel varlıklar
- **Mevcut Entities**:
  - `cart/` - Sepet varlığı
  - `product/` - Ürün varlığı
  - `user/` - Kullanıcı varlığı

#### Entity Yapısı:

```
entity/
├── ui/           # Entity ile ilgili UI bileşenleri
├── model/        # Entity state ve business logic
├── api/          # Entity API işlemleri
└── lib/          # Entity yardımcı fonksiyonları
```

### 6. Shared Katmanı (`src/shared/`)

- **Amaç**: Tüm katmanlar tarafından kullanılabilir kod
- **İçerik**:
  - `api/` - HTTP istemci konfigürasyonu
  - `config/` - Uygulama konfigürasyonları
  - `lib/` - Yardımcı kütüphaneler

## 🛣 Route Yapısı

### Next.js App Router Route Grupları

```
app/
├── layout.tsx              # Ana layout
├── page.tsx                # Ana sayfa (/)
├── (admin)/                # Admin route grubu
│   ├── dashboard/
│   │   └── page.tsx        # /dashboard
│   └── products/
│       └── page.tsx        # /products (admin)
├── (auth)/                 # Auth route grubu
│   ├── login/
│   │   └── page.tsx        # /login
│   └── signup/
│       └── page.tsx        # /signup
└── (client)/               # Client route grubu
    ├── cart/
    │   └── page.tsx        # /cart
    ├── checkout/
    │   └── page.tsx        # /checkout
    └── products/
        └── page.tsx        # /products (client)
```

### Route Grupları Avantajları:

- URL yapısını etkilemeden logical gruplama
- Farklı layoutlar için grup bazlı organizasyon
- Kod organizasyonu ve maintainability

## 📊 State Management

### Mevcut Yapı

- `src/shared/lib/store.ts` - Global state store (henüz implement edilmemiş)

### Önerilen State Management Stratejisi

```typescript
// Feature bazlı state management
features/
  auth/
    model/
      store.ts          # Auth state
  cart/
    model/
      store.ts          # Cart state

shared/
  lib/
    store.ts            # Global store konfigürasyonu
```

## 🌐 API İstemci Yapısı

### Axios Konfigürasyonu (`src/shared/api/client.ts`)

```typescript
export const axiosInstance: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
});

// Request interceptor
axiosInstance.interceptors.request.use((config) => {
  // Auth token ekleme
  return config;
});

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Global error handling
    return Promise.reject(error);
  }
);
```

### API Organizasyonu Önerisi

```
shared/api/
├── client.ts           # Ana HTTP istemci
├── types.ts            # API tip tanımları
└── endpoints.ts        # API endpoint'leri

entities/*/api/         # Entity bazlı API çağrıları
features/*/api/         # Feature bazlı API çağrıları
```

## 🎨 Stil ve UI

### CSS Framework: Tailwind CSS 4

- Utility-first yaklaşım
- Custom design system
- Dark mode desteği

### UI Component Library: HeroUI

- Modern React bileşenleri
- Tailwind CSS ile entegre
- Accessibility desteği

### Animasyonlar: Framer Motion

- Performanslı animasyonlar
- Gesture desteği
- Layout animasyonları

### Global Stiller

- `src/styles/globals.css` - Global CSS tanımları
- Font: Geist Sans & Geist Mono

## 📋 Geliştirme Kılavuzu

### 1. Yeni Feature Ekleme

```bash
# Feature klasörü oluştur
src/features/new-feature/
├── ui/
│   ├── index.ts
│   └── NewFeatureComponent.tsx
├── model/
│   ├── index.ts
│   └── store.ts
├── api/
│   ├── index.ts
│   └── endpoints.ts
└── lib/
    ├── index.ts
    └── utils.ts
```

### 2. Entity Ekleme

```bash
# Entity klasörü oluştur
src/entities/new-entity/
├── ui/
├── model/
├── api/
└── lib/
```

### 3. Sayfa Ekleme

```bash
# App router'da sayfa ekle
src/app/new-page/
└── page.tsx
```

### 4. Import Kuralları

```typescript
// ✅ Doğru import sırası
import React from "react";
import { NextPage } from "next";

import { Widget } from "@/widgets/widget-name";
import { Feature } from "@/features/feature-name";
import { Entity } from "@/entities/entity-name";
import { shared } from "@/shared/lib";
```

### 5. Komut Scriptleri

```bash
# Geliştirme sunucusu (Turbopack ile)
npm run dev

# Production build
npm run build

# Production sunucusu
npm run start

# Linting
npm run lint
```

### 6. Klasör Adlandırma Kuralları

- **Katmanlar**: `kebab-case` (örn: `feature-name`)
- **Bileşenler**: `PascalCase` (örn: `ProductCard.tsx`)
- **Dosyalar**: `camelCase` veya `kebab-case`
- **Slices**: İş domain'ini yansıtacak anlamlı isimler

### 7. Kod Organizasyon Prensipleri

1. **Tek Sorumluluk**: Her slice tek bir sorumluluğa sahip olmalı
2. **Dependency Rule**: Üst katmanlar alt katmanları kullanabilir, tersi olmaz
3. **Public API**: Her slice'ın clean bir public API'si olmalı
4. **Isolation**: Slice'lar birbirinden izole olmalı

## 🚀 Gelecek Geliştirmeler

### Planlanan Özellikler

- [ ] State management implementation (Zustand/Redux Toolkit)
- [ ] Authentication system
- [ ] Product catalog
- [ ] Shopping cart functionality
- [ ] Payment integration
- [ ] Admin dashboard
- [ ] User profile management
- [ ] Order tracking
- [ ] Product reviews
- [ ] Search & filtering

### Teknik İyileştirmeler

- [ ] API endpoint'lerinin implement edilmesi
- [ ] Error boundary'lerin eklenmesi
- [ ] Loading state'lerinin optimize edilmesi
- [ ] SEO optimizasyonları
- [ ] Performance monitoring
- [ ] Unit/integration testlerin eklenmesi
- [ ] CI/CD pipeline kurulumu

---

_Bu dokümantasyon, projenin mevcut durumunu ve mimari kararlarını yansıtmaktadır. Proje gelişimi ile birlikte güncellenecektir._
