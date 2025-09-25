# E-Commerce Project Architecture Documentation

## 📋 Table of Contents

1. [Overview](#overview)
2. [Technology Stack](#technology-stack)
3. [Feature-Sliced Design (FSD) Architecture](#feature-sliced-design-fsd-architecture)
4. [Directory Structure](#directory-structure)
5. [Layer Details](#layer-details)
6. [Route Structure](#route-structure)
7. [State Management](#state-management)
8. [API Client Structure](#api-client-structure)
9. [Styling and UI](#styling-and-ui)
10. [Development Guide](#development-guide)

## 🎯 Overview

This project is an e-commerce application developed using modern web technologies. It is structured according to Feature-Sliced Design (FSD) architecture principles, which ensures that the code is scalable, maintainable, and suitable for team collaboration.

## 🛠 Technology Stack

### Frontend Framework & Libraries

- **Next.js 15.4.4** - React-based full-stack framework (App Router)
- **React 19.1.0** - UI library
- **TypeScript 5** - Type safety
- **Tailwind CSS 4** - Utility-first CSS framework
- **HeroUI** - Modern React UI component library
- **Framer Motion** - Animation library

### Development Tools

- **ESLint** - Code quality and standards
- **PostCSS** - CSS processing
- **Turbopack** - Fast Next.js development server

### HTTP Client

- **Axios** - For HTTP requests

## 🏗 Feature-Sliced Design (FSD) Architecture

This project uses the Feature-Sliced Design methodology, a modern architecture developed for organizing frontend applications.

### FSD Layers (Top to Bottom)

1. **app** - Application startup and global configuration
2. **pages** - Page components (integrated with Next.js App Router)
3. **widgets** - Independent UI blocks
4. **features** - User interactions with business value
5. **entities** - Business entities
6. **shared** - Reusable code

## 📁 Directory Structure

```
src/
├── app/                    # Application layer
│   ├── layout.tsx         # Main layout
│   ├── page.tsx           # Main page
│   ├── (admin)/           # Admin route group
│   │   ├── dashboard/
│   │   └── products/
│   ├── (auth)/            # Authentication route group
│   │   ├── login/
│   │   └── signup/
│   └── (client)/          # Client route group
│       ├── cart/
│       ├── checkout/
│       └── products/
├── widgets/               # UI widgets
├── features/              # Features
│   ├── add-to-cart/
│   ├── auth/
│   ├── checkout/
│   └── product-search/
├── entities/              # Business entities
│   ├── cart/
│   ├── product/
│   └── user/
├── shared/                # Shared code
│   ├── api/
│   ├── config/
│   └── lib/
└── styles/
    └── globals.css
```

## 🔍 Layer Details

### 1. App Layer (`src/app/`)

- **Purpose**: Application startup, routing, and global configuration
- **Contents**:
    - Next.js App Router pages
    - Layout components
    - Route groups for different user types (admin, client, auth)

### 2. Widgets Layer (`src/widgets/`)

- **Purpose**: Independent UI blocks that combine multiple features and entities
- **Examples**:
    - Header
    - Footer
    - Sidebar
    - Product cards

### 3. Features Layer (`src/features/`)

- **Purpose**: User interactions that provide business value
- **Examples**:
    - Authentication (login/signup)
    - Add to cart
    - Checkout process
    - Product search/filter

### 4. Entities Layer (`src/entities/`)

- **Purpose**: Business domain models and their logic
- **Examples**:
    - Product
    - User
    - Cart
    - Order

### 5. Shared Layer (`src/shared/`)

- **Purpose**: Reusable infrastructure code
- **Contents**:
    - API clients
    - UI components
    - Utility functions
    - Types and constants

## 🛣 Route Structure

The application uses Next.js App Router with route groups:

- **/(admin)/** - Admin panel routes
- **/(auth)/** - Authentication routes
- **/(client)/** - Customer-facing routes

## 🧠 State Management

- **React Context** - For global state (auth, theme)
- **React Query** - For server state management
- **Local state** - For component-specific state

## 🌐 API Client Structure

- Centralized API client with interceptors
- Request/response validation using Zod
- Error handling middleware
- Automatic retry logic

## 🎨 Styling and UI

- **Tailwind CSS** - For styling
- **HeroUI** - For UI components
- **Custom components** - For specific UI needs

## 👨‍💻 Development Guide

### Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Run the development server: `npm run dev`

### Code Standards

- Follow TypeScript best practices
- Use ESLint for code quality
- Follow the FSD architecture principles

### Testing

- Unit tests with Vitest
- Component tests with React Testing Library
- E2E tests with Playwright

### Deployment

- Vercel for production deployment
- GitHub Actions for CI/CD
