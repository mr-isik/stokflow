import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import React from 'react';
import {
    useAppMutation,
    useAppQuery,
    useAppInfiniteQuery,
    useFormMutation,
    useErrorHandler,
} from '../use-error-handler';
import { normalizeError, organizeFormErrors } from '@/shared/lib/errors';

// Mock dependencies
vi.mock('@/shared/lib/errors', () => ({
    normalizeError: vi.fn(),
    organizeFormErrors: vi.fn(),
}));

// Test wrapper component
const createWrapper = () => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                retry: false,
            },
            mutations: {
                retry: false,
            },
        },
    });

    return ({ children }: { children: React.ReactNode }) =>
        React.createElement(
            QueryClientProvider,
            { client: queryClient },
            children
        );
};

describe('useAppMutation', () => {
    let consoleErrorSpy: any;

    beforeEach(() => {
        consoleErrorSpy = vi
            .spyOn(console, 'error')
            .mockImplementation(() => {});
        vi.mocked(normalizeError).mockImplementation(error => ({
            message: 'Normalized error',
            status: 500,
            code: 'TEST_ERROR',
            details: error,
        }));
    });

    afterEach(() => {
        consoleErrorSpy.mockRestore();
        vi.clearAllMocks();
    });

    it('should successfully execute mutation', async () => {
        const mockMutationFn = vi.fn().mockResolvedValue('success');
        const wrapper = createWrapper();

        const { result } = renderHook(
            () => useAppMutation(mockMutationFn, ['test-data']),
            {
                wrapper,
            }
        );

        result.current.mutate('test-data');

        await waitFor(() => {
            expect(result.current.isSuccess).toBe(true);
        });

        expect(mockMutationFn).toHaveBeenCalledWith('test-data');
        expect(result.current.data).toBe('success');
    });

    it('should handle mutation errors', async () => {
        const mockError = new Error('Test error');
        const mockMutationFn = vi.fn().mockRejectedValue(mockError);
        const wrapper = createWrapper();

        const { result } = renderHook(
            () => useAppMutation(mockMutationFn, ['test-data']),
            {
                wrapper,
            }
        );

        result.current.mutate('test-data');

        await waitFor(() => {
            expect(result.current.isError).toBe(true);
        });

        expect(normalizeError).toHaveBeenCalledWith(mockError);
        expect(consoleErrorSpy).toHaveBeenCalledWith(
            'Mutation failed:',
            expect.any(Object)
        );
    });

    it('should call custom onError callback', async () => {
        const mockError = new Error('Test error');
        const mockMutationFn = vi.fn().mockRejectedValue(mockError);
        const mockOnError = vi.fn();
        const wrapper = createWrapper();

        const { result } = renderHook(
            () =>
                useAppMutation(mockMutationFn, ['test-data'], {
                    onError: mockOnError,
                }),
            { wrapper }
        );

        result.current.mutate('test-data');

        await waitFor(() => {
            expect(result.current.isError).toBe(true);
        });

        expect(mockOnError).toHaveBeenCalled();
    });
});

describe('useAppQuery', () => {
    beforeEach(() => {
        vi.mocked(normalizeError).mockImplementation(error => ({
            message: 'Normalized error',
            status: 500,
            code: 'TEST_ERROR',
            details: error,
        }));
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('should successfully execute query', async () => {
        const mockQueryFn = vi.fn().mockResolvedValue('query-result');
        const wrapper = createWrapper();

        const { result } = renderHook(
            () =>
                useAppQuery({
                    queryKey: ['test'],
                    queryFn: mockQueryFn,
                }),
            { wrapper }
        );

        await waitFor(() => {
            expect(result.current.isSuccess).toBe(true);
        });

        expect(mockQueryFn).toHaveBeenCalled();
        expect(result.current.data).toBe('query-result');
    });

    it('should not retry on 4xx errors', async () => {
        const mockError = { status: 404, message: 'Not found' };
        const mockQueryFn = vi.fn().mockRejectedValue(mockError);
        const wrapper = createWrapper();

        const { result } = renderHook(
            () =>
                useAppQuery({
                    queryKey: ['test'],
                    queryFn: mockQueryFn,
                }),
            { wrapper }
        );

        await waitFor(() => {
            expect(result.current.isError).toBe(true);
        });

        // Query function should only be called once (no retries)
        expect(mockQueryFn).toHaveBeenCalledTimes(1);
    });

    it('should retry on 5xx errors', async () => {
        const mockError = { status: 500, message: 'Server error' };
        const mockQueryFn = vi.fn().mockRejectedValue(mockError);
        const wrapper = createWrapper();

        const { result } = renderHook(
            () =>
                useAppQuery({
                    queryKey: ['test'],
                    queryFn: mockQueryFn,
                }),
            { wrapper }
        );

        await waitFor(
            () => {
                expect(result.current.status).toBe('error');
            },
            { timeout: 5000 }
        );

        // Should retry up to 2 times (total 3 calls)
        expect(mockQueryFn).toHaveBeenCalledTimes(3);
    });
});

describe('useFormMutation', () => {
    let consoleErrorSpy: any;

    beforeEach(() => {
        consoleErrorSpy = vi
            .spyOn(console, 'error')
            .mockImplementation(() => {});
        vi.mocked(normalizeError).mockImplementation(error => ({
            message: 'Normalized error',
            status: 500,
            code: 'TEST_ERROR',
            details: error,
        }));
        vi.mocked(organizeFormErrors).mockReturnValue({
            serverError: 'Server error message',
            fieldErrors: {
                email: 'Invalid email',
                password: 'Password too short',
            },
        });
    });

    afterEach(() => {
        if (consoleErrorSpy) {
            consoleErrorSpy.mockRestore();
        }
        vi.clearAllMocks();
    });

    it('should clear errors on success', async () => {
        const mockMutationFn = vi.fn().mockResolvedValue('success');
        const mockClearErrors = vi.fn();
        const mockOnSuccess = vi.fn();
        const wrapper = createWrapper();

        const { result } = renderHook(
            () =>
                useFormMutation(mockMutationFn, ['test-data'], {
                    clearErrors: mockClearErrors,
                    onSuccess: mockOnSuccess,
                }),
            { wrapper }
        );

        result.current.mutate('test-data');

        await waitFor(() => {
            expect(result.current.isSuccess).toBe(true);
        });

        expect(mockClearErrors).toHaveBeenCalled();
        expect(mockOnSuccess).toHaveBeenCalledWith('success', 'test-data');
    });

    it('should handle form errors correctly', async () => {
        const mockError = new Error('Form error');
        const mockMutationFn = vi.fn().mockRejectedValue(mockError);
        const mockClearErrors = vi.fn();
        const mockSetFieldError = vi.fn();
        const mockSetServerError = vi.fn();
        const wrapper = createWrapper();

        const { result } = renderHook(
            () =>
                useFormMutation(mockMutationFn, ['test-data'], {
                    clearErrors: mockClearErrors,
                    setFieldError: mockSetFieldError,
                    setServerError: mockSetServerError,
                }),
            { wrapper }
        );

        result.current.mutate('test-data');

        await waitFor(() => {
            expect(result.current.isError).toBe(true);
        });

        expect(mockClearErrors).toHaveBeenCalled();
        expect(mockSetFieldError).toHaveBeenCalledWith(
            'email',
            'Invalid email'
        );
        expect(mockSetFieldError).toHaveBeenCalledWith(
            'password',
            'Password too short'
        );
        expect(mockSetServerError).toHaveBeenCalledWith('Server error message');
        expect(organizeFormErrors).toHaveBeenCalled();
    });
});

describe('useErrorHandler', () => {
    beforeEach(() => {
        vi.mocked(normalizeError).mockImplementation(error => ({
            message: 'Normalized error message',
            status: 500,
            code: 'TEST_ERROR',
            details: error,
        }));
        vi.mocked(organizeFormErrors).mockReturnValue({
            serverError: 'Server error',
            fieldErrors: {
                username: 'Username is required',
            },
        });
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('should handle general errors', () => {
        const { result } = renderHook(() => useErrorHandler());
        const testError = new Error('Test error');

        const message = result.current.handleError(testError);

        expect(normalizeError).toHaveBeenCalledWith(testError);
        expect(message).toBe('Normalized error message');
    });

    it('should return fallback message when error has no message', () => {
        vi.mocked(normalizeError).mockReturnValue({
            message: '',
            status: 500,
            code: 'TEST_ERROR',
            details: {},
        });

        const { result } = renderHook(() => useErrorHandler());
        const testError = new Error('Test error');

        const message = result.current.handleError(
            testError,
            'Custom fallback'
        );

        expect(message).toBe('Custom fallback');
    });

    it('should handle form errors', () => {
        const { result } = renderHook(() => useErrorHandler());
        const testError = new Error('Form error');
        const mockSetFieldError = vi.fn();
        const mockSetServerError = vi.fn();

        const normalizedError = result.current.handleFormError(
            testError,
            mockSetFieldError,
            mockSetServerError
        );

        expect(normalizeError).toHaveBeenCalledWith(testError);
        expect(organizeFormErrors).toHaveBeenCalled();
        expect(mockSetFieldError).toHaveBeenCalledWith(
            'username',
            'Username is required'
        );
        expect(mockSetServerError).toHaveBeenCalledWith('Server error');
        expect(normalizedError).toEqual(
            expect.objectContaining({
                message: 'Normalized error message',
            })
        );
    });

    it('should handle form errors without callbacks', () => {
        const { result } = renderHook(() => useErrorHandler());
        const testError = new Error('Form error');

        const normalizedError = result.current.handleFormError(testError);

        expect(normalizeError).toHaveBeenCalledWith(testError);
        expect(organizeFormErrors).toHaveBeenCalled();
        expect(normalizedError).toEqual(
            expect.objectContaining({
                message: 'Normalized error message',
            })
        );
    });
});

describe('useAppInfiniteQuery', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should apply retry logic to infinite queries', async () => {
        const mockQueryFn = vi.fn().mockResolvedValue({
            data: ['item1', 'item2'],
            nextCursor: null,
        });
        const wrapper = createWrapper();

        const { result } = renderHook(
            () =>
                useAppInfiniteQuery({
                    queryKey: ['infinite-test'],
                    queryFn: mockQueryFn,
                    initialPageParam: 0,
                    getNextPageParam: (lastPage: any) => lastPage.nextCursor,
                }),
            { wrapper }
        );

        await waitFor(() => {
            expect(result.current.isSuccess).toBe(true);
        });

        expect(mockQueryFn).toHaveBeenCalled();
    });

    it('should not retry on 4xx errors for infinite queries', async () => {
        const mockError = { status: 401, message: 'Unauthorized' };
        const mockQueryFn = vi.fn().mockRejectedValue(mockError);
        const wrapper = createWrapper();

        const { result } = renderHook(
            () =>
                useAppInfiniteQuery({
                    queryKey: ['infinite-test'],
                    queryFn: mockQueryFn,
                    initialPageParam: 0,
                    getNextPageParam: (lastPage: any) => lastPage.nextCursor,
                }),
            { wrapper }
        );

        await waitFor(() => {
            expect(result.current.isError).toBe(true);
        });

        // Should only be called once (no retries)
        expect(mockQueryFn).toHaveBeenCalledTimes(1);
    });
});
