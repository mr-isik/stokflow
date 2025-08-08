# Error Handling Sistemi - Kullanım Kılavuzu

## 🎯 Genel Bakış

Bu sistem tüm API işlemleri için merkezi hata yönetimi sağlar:

- ✅ **Client-side**: React Query mutations ve queries
- ✅ **Server-side**: API routes
- ✅ **Kullanıcı dostu**: Türkçe hata mesajları
- ✅ **Merkezi**: Tek yerden yönetim
- ✅ **Tip güvenli**: TypeScript desteği

## 🔧 Client-Side Kullanım

### 1. Form Mutations (Önerilen)

```tsx
import { useFormMutation } from '@/shared/hooks';

const useMyForm = () => {
    const [serverError, setServerError] = useState('');
    const [fieldErrors, setFieldErrors] = useState({});

    const mutation = useFormMutation(data => AuthAPI.signup(data), {
        onSuccess: data => {
            // Success handling
            router.push('/dashboard');
        },
        setServerError,
        setFieldError: (field, message) => {
            setFieldErrors(prev => ({ ...prev, [field]: message }));
        },
        clearErrors: () => {
            setServerError('');
            setFieldErrors({});
        },
    });

    return {
        mutation,
        serverError,
        fieldErrors,
    };
};
```

### 2. Basic Mutations

```tsx
import { useAppMutation } from '@/shared/hooks';

const mutation = useAppMutation(data => AuthAPI.login(data), {
    onSuccess: data => {
        console.log('Success:', data);
    },
    onError: error => {
        // error.message otomatik Türkçe
        setError(error.message);
    },
});
```

### 3. Queries

```tsx
import { useAppQuery } from '@/shared/hooks';

const { data, error, isLoading } = useAppQuery({
    queryKey: ['products'],
    queryFn: () => ProductAPI.getAll(),
});

// error.message otomatik Türkçe
if (error) {
    return <div>Hata: {error.message}</div>;
}
```

### 4. Manuel Error Handling

```tsx
import { useErrorHandler } from '@/shared/hooks';

const { handleError, handleFormError } = useErrorHandler();

try {
    await someAPICall();
} catch (error) {
    const message = handleError(error);
    setError(message);
}
```

## 🛠 Server-Side Kullanım

### 1. API Route Wrapper (Önerilen)

```tsx
// app/api/products/route.ts
import { createApiHandler } from '@/shared/lib/api/server-utils';
import { productSchema } from '@/entities/product/model';

export const POST = createApiHandler(
    async (data: ProductData) => {
        // Your business logic
        const product = await createProduct(data);
        return product;
    },
    {
        requestSchema: productSchema, // Otomatik validation
        requireAuth: true, // Otomatik auth check
    }
);
```

### 2. Manuel Error Handling

```tsx
import { handleApiError, validateRequest } from '@/shared/lib/api/server-utils';

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // Validation
        const validation = validateRequest(productSchema, body);
        if (!validation.success) {
            return validation.response;
        }

        // Business logic
        const result = await someOperation(validation.data);

        return successResponse(result);
    } catch (error) {
        return handleApiError(error);
    }
}
```

## 📝 Hata Mesajları

### Yaygın Hata Kodları

```typescript
'user_already_registered' → 'Bu e-posta adresi zaten kayıtlı'
'invalid_credentials' → 'E-posta veya şifre hatalı'
'validation_failed' → 'Girilen bilgileri kontrol edin'
'network_error' → 'İnternet bağlantısını kontrol edin'
'server_error' → 'Sunucu hatası. Lütfen daha sonra tekrar deneyin'
```

### Yeni Hata Mesajı Ekleme

```typescript
// shared/lib/errors/index.ts
export const ERROR_MESSAGES = {
    // Mevcut mesajlar...
    custom_error: 'Özel hata mesajınız',
} as const;
```

## 🎨 Kullanım Örnekleri

### Signup Form

```tsx
const useSignupForm = setError => {
    const mutation = useFormMutation(data => AuthAPI.signup(data), {
        onSuccess: () => router.push('/welcome'),
        setServerError: setError,
        clearErrors: () => setError(''),
    });

    const onSubmit = data => {
        mutation.mutate(data);
    };

    return { onSubmit, isLoading: mutation.isPending };
};
```

### Product List

```tsx
const ProductList = () => {
    const {
        data: products,
        error,
        isLoading,
    } = useAppQuery({
        queryKey: ['products'],
        queryFn: () => ProductAPI.getAll(),
    });

    if (isLoading) return <Spinner />;
    if (error) return <ErrorMessage>{error.message}</ErrorMessage>;

    return <ProductGrid products={products} />;
};
```

## 🚀 Faydalar

1. **Kod Tekrarı Azaltır**: Merkezi error handling
2. **Tutarlı UX**: Aynı hata mesajları her yerde
3. **Tip Güvenliği**: TypeScript desteği
4. **Kolay Maintenance**: Tek yerden güncelleme
5. **Developer Experience**: Basit API

Bu sistem ile artık her API işleminde ayrı ayrı error handling yapmaya gerek yok! 🎉
