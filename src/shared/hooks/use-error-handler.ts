'use client';

import {
    useMutation,
    UseMutationOptions,
    useQuery,
    UseQueryOptions,
    useInfiniteQuery,
} from '@tanstack/react-query';
import {
    normalizeError,
    organizeFormErrors,
    type AppError,
} from '@/shared/lib/errors';

export function useAppMutation<TData = unknown, TVariables = void>(
    mutationFn: (variables: TVariables) => Promise<TData>,
    options?: Omit<
        UseMutationOptions<TData, AppError, TVariables>,
        'mutationFn'
    >
) {
    return useMutation<TData, AppError, TVariables>({
        mutationFn: async (variables: TVariables) => {
            try {
                return await mutationFn(variables);
            } catch (error) {
                // Normalize error before throwing
                const normalizedError = normalizeError(error);
                throw normalizedError;
            }
        },
        ...options,
        onError: (error, variables, context) => {
            console.error('Mutation failed:', error);

            options?.onError?.(error, variables, context);
        },
    });
}

// Query wrapper with error handling
export function useAppQuery<TData = unknown>(
    options: UseQueryOptions<TData, AppError> & {
        queryKey: unknown[];
        queryFn: () => Promise<TData>;
    }
) {
    return useQuery<TData, AppError>({
        ...options,
        retry: (failureCount, error) => {
            // Don't retry on client errors (4xx)
            if (error?.status && error.status >= 400 && error.status < 500) {
                return false;
            }
            return failureCount < 2;
        },
    });
}

// Infinite Query wrapper with error handling (simplified)
export function useAppInfiniteQuery<TData = unknown, TPageParam = unknown>(
    options: any // Simplified for now
) {
    return useInfiniteQuery({
        ...options,
        retry: (failureCount: number, error: any) => {
            // Don't retry on client errors (4xx)
            if (error?.status && error.status >= 400 && error.status < 500) {
                return false;
            }
            return failureCount < 2;
        },
    });
}

// Form mutation hook with built-in error handling
export function useFormMutation<TData = unknown, TVariables = unknown>(
    mutationFn: (variables: TVariables) => Promise<TData>,
    options?: {
        onSuccess?: (data: TData, variables: TVariables) => void;
        onError?: (error: AppError, variables: TVariables) => void;
        setFieldError?: (field: string, message: string) => void;
        setServerError?: (message: string) => void;
        clearErrors?: () => void;
    }
) {
    return useAppMutation(mutationFn, {
        onSuccess: (data, variables) => {
            options?.clearErrors?.();
            options?.onSuccess?.(data, variables);
        },
        onError: (error, variables) => {
            const { serverError, fieldErrors } = organizeFormErrors(error);

            // Clear previous errors
            options?.clearErrors?.();

            // Set field errors
            Object.entries(fieldErrors).forEach(([field, message]) => {
                options?.setFieldError?.(field, message);
            });

            // Set server error
            if (serverError) {
                options?.setServerError?.(serverError);
            }

            options?.onError?.(error, variables);
        },
    });
}

export function useErrorHandler() {
    const handleError = (
        error: unknown,
        fallbackMessage = 'Bir hata oluştu'
    ) => {
        const normalizedError = normalizeError(error);

        // Log for debugging
        console.error('Handled error:', normalizedError);

        return normalizedError.message || fallbackMessage;
    };

    const handleFormError = (
        error: unknown,
        setFieldError?: (field: string, message: string) => void,
        setServerError?: (message: string) => void
    ) => {
        const normalizedError = normalizeError(error);
        const { serverError, fieldErrors } =
            organizeFormErrors(normalizedError);

        // Set field errors
        Object.entries(fieldErrors).forEach(([field, message]) => {
            setFieldError?.(field, message);
        });

        // Set server error
        if (serverError) {
            setServerError?.(serverError);
        }

        return normalizedError;
    };

    return { handleError, handleFormError };
}
