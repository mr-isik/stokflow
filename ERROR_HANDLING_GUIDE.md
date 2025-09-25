# Error Handling System - Usage Guide

## 🎯 Overview

This system provides centralized error handling for all API operations:

- ✅ **Client-side**: React Query mutations and queries
- ✅ **Server-side**: API routes
- ✅ **User-friendly**: Clear error messages
- ✅ **Centralized**: Single point of management
- ✅ **Type-safe**: TypeScript support

## 🔧 Client-Side Usage

### 1. Form Mutations (Recommended)

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

const useAddToCart = () => {
    const queryClient = useQueryClient();

    return useAppMutation((productId: string) => CartAPI.addItem(productId), {
        onSuccess: () => {
            queryClient.invalidateQueries(['cart']);
            toast.success('Product added to cart');
        },
        // Error handling is automatic
    });
};
```

### 3. Queries

```tsx
import { useAppQuery } from '@/shared/hooks';

const useProductDetails = (productId: string) => {
    return useAppQuery(
        ['product', productId],
        () => ProductAPI.getById(productId),
        {
            enabled: !!productId,
            // Error handling is automatic
        }
    );
};
```

## 🔄 Server-Side Usage

### 1. API Route Handlers

```tsx
import { handleApiError } from '@/shared/lib/error-handling';

export async function POST(req: Request) {
    try {
        const data = await req.json();

        // Validation
        const result = userSchema.safeParse(data);
        if (!result.success) {
            return handleApiError(new ValidationError(result.error));
        }

        // Business logic
        const user = await createUser(data);

        return Response.json({ user });
    } catch (error) {
        return handleApiError(error);
    }
}
```

## 🧩 Error Types

### 1. API Error

Base error class for all API errors:

```tsx
import { ApiError } from '@/shared/lib/error-handling';

throw new ApiError({
    message: 'Something went wrong',
    statusCode: 500,
});
```

### 2. Validation Error

For form validation errors:

```tsx
import { ValidationError } from '@/shared/lib/error-handling';

throw new ValidationError({
    message: 'Validation failed',
    fields: {
        email: 'Invalid email format',
        password: 'Password must be at least 8 characters',
    },
});
```

### 3. Authentication Error

For auth-related errors:

```tsx
import { AuthError } from '@/shared/lib/error-handling';

throw new AuthError({
    message: 'Authentication failed',
    code: 'invalid_credentials',
});
```

### 4. Not Found Error

For resource not found errors:

```tsx
import { NotFoundError } from '@/shared/lib/error-handling';

throw new NotFoundError({
    message: 'Product not found',
    resource: 'product',
    id: productId,
});
```

### 5. Permission Error

For authorization errors:

```tsx
import { PermissionError } from '@/shared/lib/error-handling';

throw new PermissionError({
    message: 'You do not have permission to access this resource',
    requiredRole: 'admin',
});
```

## 🔍 Error Handling in Components

### 1. Form Components

```tsx
const SignupForm = () => {
    const { mutation, serverError, fieldErrors } = useSignupForm();

    return (
        <form onSubmit={handleSubmit(mutation.mutate)}>
            {serverError && <Alert variant="error">{serverError}</Alert>}

            <Input
                name="email"
                error={fieldErrors.email}
                {...register('email')}
            />

            <Button type="submit" loading={mutation.isLoading}>
                Sign Up
            </Button>
        </form>
    );
};
```

### 2. Query Components

```tsx
const ProductDetails = ({ productId }) => {
    const { data, isLoading, error } = useProductDetails(productId);

    if (isLoading) return <Spinner />;

    if (error) return <ErrorDisplay error={error} />;

    return <ProductView product={data} />;
};
```

## 🚀 Best Practices

1. **Always use the provided hooks** (`useAppQuery`, `useAppMutation`, `useFormMutation`) instead of raw React Query hooks
2. **Handle all errors in try/catch blocks** on the server
3. **Use specific error types** for better error handling
4. **Provide user-friendly error messages**
5. **Validate input data** before processing
6. **Log errors** for debugging purposes
7. **Use toast notifications** for non-critical errors
8. **Display inline errors** for form fields
9. **Provide fallback UI** for error states

## 📚 Error Handling Components

### 1. ErrorBoundary

Catches unhandled errors in the component tree:

```tsx
import { ErrorBoundary } from '@/shared/ui/error-boundary';

<ErrorBoundary fallback={<ErrorPage />}>
    <MyComponent />
</ErrorBoundary>;
```

### 2. ErrorDisplay

Displays formatted error messages:

```tsx
import { ErrorDisplay } from '@/shared/ui/error-display';

<ErrorDisplay error={error} retry={() => refetch()} />;
```

### 3. FormErrorMessage

Displays field-specific error messages:

```tsx
import { FormErrorMessage } from '@/shared/ui/form';

<FormField>
    <Input name="email" {...register('email')} />
    {fieldErrors.email && (
        <FormErrorMessage>{fieldErrors.email}</FormErrorMessage>
    )}
</FormField>;
```
