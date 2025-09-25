# 🏗️ E-Commerce Project - Feature-Sliced Design (FSD) Architecture Guide

This project uses the **Feature-Sliced Design** (FSD) architecture. This guide will help you understand where to place your files.

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router (Routes)
├── processes/              # Complex business processes
├── pages/                  # Page components (FSD)
├── widgets/                # Independent UI blocks
├── features/               # Business features
├── entities/               # Business entities
├── shared/                 # Shared code
└── styles/                 # Global styles
```

## 🎯 Layer Descriptions and Examples

### 1. 📱 **App Layer** (`src/app/`)

**What**: Next.js App Router routes and layouts
**When to use**: For page routes and layouts

```typescript
// ✅ Correct placement examples:
src / app / layout.tsx; // Main layout
src / app / page.tsx; // Main page
src / app / client / products / page.tsx; // Products page
```

### 2. 🔄 **Processes Layer** (`src/processes/`)

**What**: Complex business processes that coordinate multiple features
**When to use**: For cross-feature workflows

```typescript
// ✅ Correct placement examples:
src/processes/checkout-flow/          // Checkout process
src/processes/auth/                   // Authentication process
```

### 3. 📄 **Pages Layer** (`src/pages/`)

**What**: Page components (not to be confused with Next.js pages)
**When to use**: For page-level components

```typescript
// ✅ Correct placement examples:
src / pages / product - details / ui / ProductDetailsPage.tsx;
src / pages / checkout / ui / CheckoutPage.tsx;
```

### 4. 🧩 **Widgets Layer** (`src/widgets/`)

**What**: Independent UI blocks that combine multiple features
**When to use**: For reusable UI blocks

```typescript
// ✅ Correct placement examples:
src/widgets/header/                   // Site header
src/widgets/footer/                   // Site footer
src/widgets/product-card/             // Product card widget
```

### 5. ✨ **Features Layer** (`src/features/`)

**What**: User interactions that provide business value
**When to use**: For user-facing functionality

```typescript
// ✅ Correct placement examples:
src/features/add-to-cart/             // Add to cart feature
src/features/product-search/          // Product search feature
src/features/auth/login/              // Login feature
```

#### Feature Structure

```
feature/
├── ui/           # UI components
├── model/        # State management
├── api/          # API calls
└── lib/          # Helper functions
```

### 6. 📦 **Entities Layer** (`src/entities/`)

**What**: Business domain models
**When to use**: For core business entities

```typescript
// ✅ Correct placement examples:
src/entities/product/                 // Product entity
src/entities/user/                    // User entity
src/entities/cart/                    // Cart entity
```

#### Entity Structure

```
entity/
├── ui/           # Entity-related UI components
├── model/        # Entity state and business logic
├── api/          # Entity API operations
└── lib/          # Entity helper functions
```

### 7. 🔧 **Shared Layer** (`src/shared/`)

**What**: Reusable code shared across all layers
**When to use**: For utilities, types, and common components

```typescript
// ✅ Correct placement examples:
src /
    shared /
    api / // API client
    src /
    shared /
    ui /
    button / // UI button component
    src /
    shared /
    lib /
    validation.ts; // Validation utilities
```

## 🚫 Common Mistakes to Avoid

### ❌ Incorrect Dependencies

```typescript
// ❌ WRONG: Entity importing from a feature
import { addToCart } from '@/features/add-to-cart';

// ✅ CORRECT: Feature importing from an entity
import { Product } from '@/entities/product';
```

### ❌ Incorrect File Placement

```typescript
// ❌ WRONG: UI component in the API folder
src / entities / product / api / ProductCard.tsx;

// ✅ CORRECT: UI component in the UI folder
src / entities / product / ui / ProductCard.tsx;
```

### ❌ Mixing Responsibilities

```typescript
// ❌ WRONG: Mixing entity and feature logic
src / entities / product / model / addToCart.ts;

// ✅ CORRECT: Keep feature logic in features
src / features / add - to - cart / model / addToCart.ts;
```

## 🔄 Dependency Rules

1. **Layers can only import from layers below them**
    - App → Processes → Pages → Widgets → Features → Entities → Shared
    - Example: Features can import from Entities and Shared, but not from Widgets

2. **Slices can only import from their own slice or from shared**
    - Example: `product` entity can't import from `user` entity

3. **Segments can only import from segments of the same level or below**
    - ui → model → api → lib
    - Example: UI can import from model, but model can't import from UI

## 📝 Naming Conventions

1. **Folders**: Use kebab-case for all folders
    - Example: `add-to-cart`, `product-card`

2. **Files**:
    - React Components: Use PascalCase
        - Example: `ProductCard.tsx`, `AddToCartButton.tsx`
    - Non-component files: Use camelCase
        - Example: `productModel.ts`, `cartUtils.ts`

3. **Exports**:
    - Use named exports for most cases
    - Use default exports only for main components

## 🧪 Testing Structure

```
feature/
├── ui/
│   ├── Component.tsx
│   └── __tests__/
│       └── Component.test.tsx
├── model/
│   ├── store.ts
│   └── __tests__/
│       └── store.test.ts
```

## 🚀 Best Practices

1. **Keep slices isolated**: Slices should be independent and reusable
2. **Public API**: Each slice should have a clear public API (index.ts)
3. **Composition over inheritance**: Compose components from smaller ones
4. **Single responsibility**: Each file should have a single responsibility
5. **Explicit dependencies**: Make dependencies explicit in imports

## 📚 Resources

- [Feature-Sliced Design Official Documentation](https://feature-sliced.design/)
- [FSD Layers Explanation](https://feature-sliced.design/docs/reference/layers)
- [FSD Slices Explanation](https://feature-sliced.design/docs/reference/slices)
