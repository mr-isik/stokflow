# API Client with Validation and Logging Usage Guide

## 🚀 Basic Usage

### 1. Schema Definition

```typescript
import { z } from 'zod';
import { ApiResponseSchema } from '@/shared/lib/validation';

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

### 2. Enhanced API Client Usage

```typescript
import { apiClient } from '@/shared/api/client';
import { ProductResponseSchema, ProductListResponseSchema } from './schemas';

// Get product with validation
const getProduct = async (id: string) => {
    return apiClient.get(`/products/${id}`, {
        schema: ProductResponseSchema,
    });
};

// Get product list with validation
const getProducts = async () => {
    return apiClient.get('/products', {
        schema: ProductListResponseSchema,
    });
};

// Create product with validation
const createProduct = async (data: z.infer<typeof CreateProductSchema>) => {
    return apiClient.post('/products', {
        data,
        schema: ProductResponseSchema,
    });
};

// Update product with validation
const updateProduct = async (
    id: string,
    data: z.infer<typeof UpdateProductSchema>
) => {
    return apiClient.patch(`/products/${id}`, {
        data,
        schema: ProductResponseSchema,
    });
};
```

## 🔒 Validation Features

### Response Validation

The API client automatically validates responses against the provided schema:

```typescript
// This will throw a ValidationError if the response doesn't match the schema
const product = await getProduct('123');
```

### Request Validation

Request data is validated before sending:

```typescript
// This will throw a ValidationError if the data doesn't match the schema
const newProduct = await createProduct({
    name: 'Product Name',
    price: 99.99,
    description: 'Product description',
    category: 'electronics',
    stock: 10,
});
```

## 📝 Logging Features

### Request Logging

All requests are automatically logged with:

- Request method
- URL
- Request data
- Headers (sensitive data redacted)

### Response Logging

All responses are logged with:

- Status code
- Response data
- Response time

### Error Logging

Errors are logged with:

- Error message
- Stack trace
- Request details
- Response details (if available)

## ⚠️ Error Handling

### Centralized Error Handling

The API client provides centralized error handling:

```typescript
import { useErrorHandler } from '@/shared/hooks/use-error-handler';

const { handleError } = useErrorHandler();

try {
    const product = await getProduct('123');
} catch (error) {
    handleError(error);
}
```

### Error Types

The API client differentiates between different error types:

- `ValidationError` - Schema validation errors
- `ApiError` - HTTP errors from the API
- `NetworkError` - Network connectivity issues
- `TimeoutError` - Request timeout errors

## 🔄 Retry Logic

### Automatic Retries

The API client automatically retries failed requests:

```typescript
// This will retry up to 3 times with exponential backoff
const products = await getProducts();
```

### Custom Retry Configuration

You can customize retry behavior:

```typescript
const getProductWithRetry = async (id: string) => {
    return apiClient.get(`/products/${id}`, {
        schema: ProductResponseSchema,
        retry: {
            maxRetries: 5,
            retryDelay: 1000,
            retryStatusCodes: [500, 502, 503, 504],
        },
    });
};
```

## 🔍 Advanced Usage

### Custom Headers

```typescript
const getProductWithHeaders = async (id: string) => {
    return apiClient.get(`/products/${id}`, {
        schema: ProductResponseSchema,
        headers: {
            'X-Custom-Header': 'value',
        },
    });
};
```

### Request Cancellation

```typescript
import { createAbortController } from '@/shared/api/utils';

const { controller, signal } = createAbortController();

const getProductCancellable = async (id: string) => {
    return apiClient.get(`/products/${id}`, {
        schema: ProductResponseSchema,
        signal,
    });
};

// Cancel the request
controller.abort();
```

### Request Transformation

```typescript
const createProductWithTransform = async (
    data: z.infer<typeof CreateProductSchema>
) => {
    return apiClient.post('/products', {
        data,
        schema: ProductResponseSchema,
        transformRequest: data => ({
            ...data,
            createdAt: new Date().toISOString(),
        }),
    });
};
```

### Response Transformation

```typescript
const getProductWithTransform = async (id: string) => {
    return apiClient.get(`/products/${id}`, {
        schema: ProductResponseSchema,
        transformResponse: data => ({
            ...data,
            price: `$${data.price.toFixed(2)}`,
        }),
    });
};
```

## 🧪 Testing

### Mocking API Responses

```typescript
import { mockApiResponse } from '@/shared/api/testing';

// Mock a successful response
mockApiResponse({
    url: '/products/123',
    method: 'GET',
    status: 200,
    data: {
        id: '123',
        name: 'Test Product',
        price: 99.99,
        description: 'Test description',
        category: 'test',
        stock: 10,
    },
});

// Now any call to getProduct("123") will return the mocked data
const product = await getProduct('123');
```

### Mocking API Errors

```typescript
import { mockApiError } from '@/shared/api/testing';

// Mock an error response
mockApiError({
    url: '/products/123',
    method: 'GET',
    status: 404,
    message: 'Product not found',
});

// Now any call to getProduct("123") will throw the mocked error
try {
    const product = await getProduct('123');
} catch (error) {
    // Handle error
}
```

## 📚 Best Practices

1. **Define schemas in a separate file** for better organization
2. **Use TypeScript inference** with Zod schemas for type safety
3. **Centralize API functions** in dedicated files per entity
4. **Handle errors consistently** using the error handler hook
5. **Use request cancellation** for components that unmount during requests
6. **Write tests** for API functions using the mocking utilities
