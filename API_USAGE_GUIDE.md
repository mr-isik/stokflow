# API Client ile Validation ve Logging Kullanım Kılavuzu

## 🚀 Temel Kullanım

### 1. Schema Tanımlama

```typescript
import { z } from "zod";
import { ApiResponseSchema } from "@/shared/lib/validation";

// Product schema
const ProductSchema = z.object({
  id: z.string(),
  name: z.string(),
  price: z.number().positive(),
  description: z.string(),
  category: z.string(),
  stock: z.number().int().min(0),
});

// API response schema
const ProductResponseSchema = ApiResponseSchema(ProductSchema);
const ProductListResponseSchema = ApiResponseSchema(z.array(ProductSchema));

// Request schemas
const CreateProductSchema = ProductSchema.omit({ id: true });
const UpdateProductSchema = ProductSchema.partial();
```

### 2. Enhanced API Client Kullanımı

```typescript
import { apiClient } from "@/shared/api/client";

// GET request with response validation
const getProduct = async (id: string) => {
  try {
    const product = await apiClient.get(
      `/products/${id}`,
      undefined,
      ProductResponseSchema
    );
    return product;
  } catch (error) {
    console.error("Product fetch error:", error);
    throw error;
  }
};

const createProduct = async (productData: CreateProductRequest) => {
  try {
    const product = await apiClient.post("/products", productData, {
      request: CreateProductSchema,
      response: ProductResponseSchema,
    });
    return product;
  } catch (error) {
    console.error("Product creation error:", error);
    throw error;
  }
};

const updateProduct = async (id: string, updates: UpdateProductRequest) => {
  try {
    const product = await apiClient.put(`/products/${id}`, updates, {
      request: UpdateProductSchema,
      response: ProductResponseSchema,
    });
    return product;
  } catch (error) {
    console.error("Product update error:", error);
    throw error;
  }
};
```

## 🛡️ Validation Features

### Otomatik Request Validation

```typescript
// Geçersiz veri gönderildiğinde ValidationError fırlatılır
try {
  await apiClient.post(
    "/products",
    {
      name: "", // ❌ Boş string
      price: -10, // ❌ Negatif fiyat
    },
    { request: CreateProductSchema }
  );
} catch (error) {
  if (error instanceof ValidationError) {
    console.log("Validation errors:", error.errors);
    // ["name: String must contain at least 1 character(s)", "price: Number must be greater than 0"]
  }
}
```

### Otomatik Response Validation

```typescript
// API'den gelen geçersiz response otomatik yakalanır
try {
  const product = await apiClient.get("/products/1", undefined, ProductSchema);
} catch (error) {
  if (error instanceof ValidationError) {
    console.log("API returned invalid data:", error.errors);
  }
}
```

## 📝 Logging Features

### Otomatik Request/Response Logging

```typescript
// Her API çağrısı otomatik loglanır
logger.debug("API Request", {
  id: "req_123",
  method: "POST",
  url: "/api/products",
  data: productData,
  timestamp: new Date(),
  userId: "user_456",
});

logger.debug("API Response", {
  requestId: "req_123",
  status: 201,
  duration: 150,
  data: responseData,
});
```

### Performance Logging

```typescript
logger.time("product-fetch");
const product = await apiClient.get("/products/1");
logger.timeEnd("product-fetch");
// Logs: "Performance: product-fetch { duration: '150.23ms' }"
```

### Error Logging

```typescript
// Hatalar otomatik detaylı loglanır
logger.error("API Error", {
  message: "Network request failed",
  status: 500,
  url: "/api/products",
  timestamp: new Date(),
  userId: "user_456",
  stack: error.stack,
});
```

## ⚙️ Configuration

### API Client Konfigürasyonu

```typescript
const apiConfig: ApiConfig = {
  enableValidation: true,
  enableLogging: process.env.NODE_ENV !== "production",
  enableRetry: true,
  maxRetries: 3,
  retryDelay: 1000,
  timeout: 10000,
};
```

### Logger Konfigürasyonu

```typescript
const loggerConfig: LoggerConfig = {
  level: process.env.NODE_ENV === "production" ? LogLevel.WARN : LogLevel.DEBUG,
  enableConsole: true,
  enableRemote: process.env.NODE_ENV === "production",
  remoteEndpoint: process.env.NEXT_PUBLIC_LOG_ENDPOINT,
  bufferSize: 10,
  flushInterval: 30000,
};
```

## 🔧 Entity API Örnekleri

### Product Entity API

```typescript
// src/entities/product/api/index.ts
import { z } from "zod";
import { apiClient } from "@/shared/api/client";
import {
  ApiResponseSchema,
  PaginatedResponseSchema,
} from "@/shared/lib/validation";

const ProductSchema = z.object({
  id: z.string(),
  name: z.string(),
  price: z.number(),
  description: z.string(),
  category: z.string(),
  stock: z.number(),
});

const CreateProductSchema = ProductSchema.omit({ id: true });
const UpdateProductSchema = ProductSchema.partial();

export const productApi = {
  // Get all products with pagination
  getProducts: (params?: {
    page?: number;
    limit?: number;
    category?: string;
  }) =>
    apiClient.get("/products", params, PaginatedResponseSchema(ProductSchema)),

  // Get single product
  getProduct: (id: string) =>
    apiClient.get(
      `/products/${id}`,
      undefined,
      ApiResponseSchema(ProductSchema)
    ),

  // Create product
  createProduct: (data: z.infer<typeof CreateProductSchema>) =>
    apiClient.post("/products", data, {
      request: CreateProductSchema,
      response: ApiResponseSchema(ProductSchema),
    }),

  // Update product
  updateProduct: (id: string, data: z.infer<typeof UpdateProductSchema>) =>
    apiClient.put(`/products/${id}`, data, {
      request: UpdateProductSchema,
      response: ApiResponseSchema(ProductSchema),
    }),

  // Delete product
  deleteProduct: (id: string) => apiClient.delete(`/products/${id}`),
};
```

### User Entity API

```typescript
// src/entities/user/api/index.ts
import { z } from "zod";
import { apiClient } from "@/shared/api/client";
import { ApiResponseSchema } from "@/shared/lib/validation";

const UserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  firstName: z.string(),
  lastName: z.string(),
  role: z.enum(["customer", "admin"]),
  createdAt: z.string(),
});

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const RegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
});

export const userApi = {
  login: (credentials: z.infer<typeof LoginSchema>) =>
    apiClient.post("/auth/login", credentials, {
      request: LoginSchema,
      response: ApiResponseSchema(
        z.object({
          user: UserSchema,
          token: z.string(),
        })
      ),
    }),

  register: (userData: z.infer<typeof RegisterSchema>) =>
    apiClient.post("/auth/register", userData, {
      request: RegisterSchema,
      response: ApiResponseSchema(UserSchema),
    }),

  getProfile: () =>
    apiClient.get("/auth/profile", undefined, ApiResponseSchema(UserSchema)),
};
```

## 🚨 Error Handling

### ValidationError Yakalama

```typescript
import { ValidationError } from "@/shared/lib/validation";

try {
  const result = await apiClient.post("/products", invalidData, {
    request: ProductSchema,
  });
} catch (error) {
  if (error instanceof ValidationError) {
    // Validation hatası
    console.log("Validation failed:", error.errors);
  } else {
    // API hatası
    console.log("API error:", error.message);
  }
}
```

### Global Error Handler

```typescript
// src/shared/lib/error-handler.ts
export const handleApiError = (error: any) => {
  if (error instanceof ValidationError) {
    // Validation hatalarını göster
    toast.error("Girilen veriler geçersiz");
    return error.errors;
  }

  if (error.status === 401) {
    // Unauthorized - redirect to login
    router.push("/login");
    return;
  }

  if (error.status >= 500) {
    // Server error
    toast.error("Sunucu hatası oluştu");
    return;
  }

  // Generic error
  toast.error(error.message || "Bir hata oluştu");
};
```

Bu yapı ile API çağrılarınız otomatik olarak validate edilecek, loglanacak ve hata durumlarında retry yapılacaktır!
