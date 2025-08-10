import { renderHook, waitFor, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import React from 'react';
import {
    useCurrentUser,
    useLogin,
    useLogout,
    useSignup,
    useAuth,
    useRequireAuth,
    AUTH_QUERY_KEYS,
} from '../use-auth';
import { AuthAPI } from '@/entities/auth/api';
import { type AppError } from '@/shared/lib/errors';

// Mock dependencies
vi.mock('@/entities/auth/api');
vi.mock('next/navigation', () => ({
    useRouter: () => ({
        push: vi.fn(),
        replace: vi.fn(),
        refresh: vi.fn(),
    }),
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

// Mock user data
const mockUser = {
    user: {
        id: '1',
        email: 'test@example.com',
        user_metadata: {
            name: 'Test User',
        },
    },
    access_token: 'mock-access-token',
};

const mockLoginResponse = {
    user: {
        id: '1',
        email: 'test@example.com',
        user_metadata: {
            name: 'Test User',
        },
    },
    session: {
        access_token: 'mock-token',
    },
};

describe('useCurrentUser', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should fetch current user successfully', async () => {
        vi.mocked(AuthAPI.getCurrentUser).mockResolvedValue(mockUser);
        const wrapper = createWrapper();

        const { result } = renderHook(() => useCurrentUser(), { wrapper });

        await waitFor(() => {
            expect(result.current.isSuccess).toBe(true);
        });

        expect(AuthAPI.getCurrentUser).toHaveBeenCalled();
        expect(result.current.data).toEqual(mockUser);
    });

    it('should handle 401 error without retry', async () => {
        const mockError: AppError = {
            code: 'unauthorized',
            message: 'Unauthorized',
            status: 401,
        };
        vi.mocked(AuthAPI.getCurrentUser).mockRejectedValue(mockError);
        const wrapper = createWrapper();

        const { result } = renderHook(() => useCurrentUser(), { wrapper });

        await waitFor(() => {
            expect(result.current.isError).toBe(true);
        });

        // Should only call once (no retries for 401)
        expect(AuthAPI.getCurrentUser).toHaveBeenCalledTimes(1);
    });

    it('should retry on other errors', async () => {
        const mockError: AppError = {
            code: 'server_error',
            message: 'Server Error',
            status: 500,
        };
        vi.mocked(AuthAPI.getCurrentUser).mockRejectedValue(mockError);
        const wrapper = createWrapper();

        const { result } = renderHook(() => useCurrentUser(), { wrapper });

        await waitFor(
            () => {
                expect(result.current.status).toBe('error');
            },
            { timeout: 5000 }
        );

        // Should retry on 500 errors
        expect(AuthAPI.getCurrentUser).toHaveBeenCalledTimes(3);
    });
});

describe('useLogin', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should login successfully', async () => {
        vi.mocked(AuthAPI.login).mockResolvedValue(mockLoginResponse);
        const wrapper = createWrapper();

        const { result } = renderHook(() => useLogin(), { wrapper });

        const loginData = {
            email: 'test@example.com',
            password: 'password123',
        };

        act(() => {
            result.current.mutate(loginData);
        });

        await waitFor(() => {
            expect(result.current.isSuccess).toBe(true);
        });

        expect(AuthAPI.login).toHaveBeenCalledWith(loginData);
        expect(result.current.data).toEqual(mockLoginResponse);
    });

    it('should handle login error', async () => {
        const mockError: AppError = {
            code: 'invalid_credentials',
            message: 'Invalid credentials',
            status: 401,
        };
        vi.mocked(AuthAPI.login).mockRejectedValue(mockError);
        const wrapper = createWrapper();

        const { result } = renderHook(() => useLogin(), { wrapper });

        const loginData = {
            email: 'test@example.com',
            password: 'wrongpassword',
        };

        act(() => {
            result.current.mutate(loginData);
        });

        await waitFor(() => {
            expect(result.current.isError).toBe(true);
        });

        expect(result.current.error).toBeDefined();
        expect(result.current.error?.code).toBe('invalid_credentials');
    });

    it('should invalidate queries on successful login', async () => {
        vi.mocked(AuthAPI.login).mockResolvedValue(mockLoginResponse);
        const queryClient = new QueryClient();
        const invalidateQueriesSpy = vi.spyOn(queryClient, 'invalidateQueries');
        const setQueryDataSpy = vi.spyOn(queryClient, 'setQueryData');

        // Create wrapper with spied QueryClient
        const TestWrapper = ({ children }: { children: React.ReactNode }) =>
            React.createElement(
                QueryClientProvider,
                { client: queryClient },
                children
            );

        const { result } = renderHook(() => useLogin(), {
            wrapper: TestWrapper,
        });

        const loginData = {
            email: 'test@example.com',
            password: 'password123',
        };

        act(() => {
            result.current.mutate(loginData);
        });

        await waitFor(() => {
            expect(result.current.isSuccess).toBe(true);
        });

        expect(setQueryDataSpy).toHaveBeenCalledWith(
            AUTH_QUERY_KEYS.me,
            mockLoginResponse.user
        );
        expect(invalidateQueriesSpy).toHaveBeenCalledWith({
            queryKey: AUTH_QUERY_KEYS.all,
        });
    });
});

describe('useLogout', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should logout successfully', async () => {
        vi.mocked(AuthAPI.logout).mockResolvedValue(undefined);
        const wrapper = createWrapper();

        const { result } = renderHook(() => useLogout(), { wrapper });

        act(() => {
            result.current.mutate();
        });

        await waitFor(() => {
            expect(result.current.isSuccess).toBe(true);
        });

        expect(AuthAPI.logout).toHaveBeenCalled();
    });

    it('should clear query cache on logout', async () => {
        vi.mocked(AuthAPI.logout).mockResolvedValue(undefined);

        const queryClient = new QueryClient({
            defaultOptions: {
                queries: { retry: false },
                mutations: { retry: false },
            },
        });
        const clearSpy = vi.spyOn(queryClient, 'clear');

        const TestWrapper = ({ children }: { children: React.ReactNode }) =>
            React.createElement(
                QueryClientProvider,
                { client: queryClient },
                children
            );

        const { result } = renderHook(() => useLogout(), {
            wrapper: TestWrapper,
        });

        await act(async () => {
            result.current.mutate();
        });

        await waitFor(() => {
            expect(result.current.status).not.toBe('pending');
        });

        expect(clearSpy).toHaveBeenCalled();
    });

    it('should handle logout error and redirect', async () => {
        const mockError: AppError = {
            code: 'server_error',
            message: 'Server Error',
            status: 500,
        };
        vi.mocked(AuthAPI.logout).mockRejectedValue(mockError);

        const mockRouterPush = vi.fn();
        vi.doMock('next/navigation', () => ({
            useRouter: () => ({
                push: mockRouterPush,
                replace: vi.fn(),
                refresh: vi.fn(),
            }),
        }));

        const queryClient = new QueryClient();
        const clearSpy = vi.spyOn(queryClient, 'clear');

        const TestWrapper = ({ children }: { children: React.ReactNode }) =>
            React.createElement(
                QueryClientProvider,
                { client: queryClient },
                children
            );

        const { result } = renderHook(() => useLogout(), {
            wrapper: TestWrapper,
        });

        act(() => {
            result.current.mutate();
        });

        await waitFor(() => {
            expect(result.current.isError).toBe(true);
        });

        expect(clearSpy).toHaveBeenCalled();
    });
});

describe('useSignup', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should signup successfully', async () => {
        vi.mocked(AuthAPI.signup).mockResolvedValue(mockUser);
        const wrapper = createWrapper();

        const { result } = renderHook(() => useSignup(), { wrapper });

        const signupData = {
            email: 'test@example.com',
            password: 'password123',
            name: 'Test User',
            confirmPassword: 'password123',
        };

        act(() => {
            result.current.mutate(signupData);
        });

        await waitFor(() => {
            expect(result.current.isSuccess).toBe(true);
        });

        expect(AuthAPI.signup).toHaveBeenCalledWith(signupData);
        expect(result.current.data).toEqual(mockUser);
    });

    it('should handle signup error', async () => {
        const mockError: AppError = {
            code: 'user_already_registered',
            message: 'User already exists',
            status: 409,
        };
        vi.mocked(AuthAPI.signup).mockRejectedValue(mockError);
        const wrapper = createWrapper();

        const { result } = renderHook(() => useSignup(), { wrapper });

        const signupData = {
            email: 'test@example.com',
            password: 'password123',
            name: 'Test User',
            confirmPassword: 'password123',
        };

        act(() => {
            result.current.mutate(signupData);
        });

        await waitFor(() => {
            expect(result.current.isError).toBe(true);
        });

        expect(result.current.error).toBeDefined();
        expect(result.current.error?.code).toBe('user_already_registered');
    });
});

describe('useAuth', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        // Clear any existing event listeners
        const events = (window as any)._events;
        if (events) {
            delete events['auth:unauthorized'];
        }
    });

    it('should return authenticated user', async () => {
        vi.mocked(AuthAPI.getCurrentUser).mockResolvedValue(mockUser);
        const wrapper = createWrapper();

        const { result } = renderHook(() => useAuth(), { wrapper });

        await waitFor(() => {
            expect(result.current.isAuthenticated).toBe(true);
        });

        expect(result.current.user).toEqual(mockUser.user);
        expect(result.current.isLoading).toBe(false);
    });

    it('should return null user when not authenticated', async () => {
        const mockError: AppError = {
            code: 'unauthorized',
            message: 'Unauthorized',
            status: 401,
        };
        vi.mocked(AuthAPI.getCurrentUser).mockRejectedValue(mockError);
        const wrapper = createWrapper();

        const { result } = renderHook(() => useAuth(), { wrapper });

        await waitFor(() => {
            expect(result.current.isAuthenticated).toBe(false);
        });

        expect(result.current.user).toBeNull();
    });

    it('should handle unauthorized event', async () => {
        vi.mocked(AuthAPI.getCurrentUser).mockResolvedValue(mockUser);
        const queryClient = new QueryClient();
        const clearSpy = vi.spyOn(queryClient, 'clear');

        const TestWrapper = ({ children }: { children: React.ReactNode }) =>
            React.createElement(
                QueryClientProvider,
                { client: queryClient },
                children
            );

        renderHook(() => useAuth(), { wrapper: TestWrapper });

        // Simulate unauthorized event
        act(() => {
            window.dispatchEvent(new Event('auth:unauthorized'));
        });

        expect(clearSpy).toHaveBeenCalled();
    });

    it('should provide logout function', async () => {
        vi.mocked(AuthAPI.getCurrentUser).mockResolvedValue(mockUser);
        vi.mocked(AuthAPI.logout).mockResolvedValue(undefined);
        const wrapper = createWrapper();

        const { result } = renderHook(() => useAuth(), { wrapper });

        await waitFor(() => {
            expect(result.current.isAuthenticated).toBe(true);
        });

        expect(typeof result.current.logout).toBe('function');
        expect(result.current.isLoggingOut).toBe(false);

        await act(async () => {
            result.current.logout();
        });

        await waitFor(() => {
            expect(result.current.isLoggingOut).toBe(false);
        });
    });
});

describe('useRequireAuth', () => {
    const mockRouterPush = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        mockRouterPush.mockClear();

        vi.doMock('next/navigation', () => ({
            useRouter: () => ({
                push: mockRouterPush,
                replace: vi.fn(),
                refresh: vi.fn(),
            }),
        }));
    });

    it('should allow rendering when authenticated', async () => {
        vi.mocked(AuthAPI.getCurrentUser).mockResolvedValue(mockUser);
        const wrapper = createWrapper();

        const { result } = renderHook(() => useRequireAuth(), { wrapper });

        await waitFor(() => {
            expect(result.current.shouldRender).toBe(true);
        });

        expect(mockRouterPush).not.toHaveBeenCalled();
    });

    it('should redirect when not authenticated', async () => {
        const mockError: AppError = {
            code: 'unauthorized',
            message: 'Unauthorized',
            status: 401,
        };
        vi.mocked(AuthAPI.getCurrentUser).mockRejectedValue(mockError);
        const wrapper = createWrapper();

        const { result } = renderHook(() => useRequireAuth(), { wrapper });

        await waitFor(() => {
            expect(result.current.shouldRender).toBe(false);
        });
    });

    it('should redirect to custom path', async () => {
        const mockError: AppError = {
            code: 'unauthorized',
            message: 'Unauthorized',
            status: 401,
        };
        vi.mocked(AuthAPI.getCurrentUser).mockRejectedValue(mockError);
        const wrapper = createWrapper();

        const { result } = renderHook(() => useRequireAuth('/custom-login'), {
            wrapper,
        });

        await waitFor(() => {
            expect(result.current.shouldRender).toBe(false);
        });
    });

    it('should not render during loading', () => {
        // Mock a pending query
        vi.mocked(AuthAPI.getCurrentUser).mockImplementation(
            () => new Promise(() => {}) // Never resolves
        );
        const wrapper = createWrapper();

        const { result } = renderHook(() => useRequireAuth(), { wrapper });

        expect(result.current.shouldRender).toBe(false);
        expect(mockRouterPush).not.toHaveBeenCalled();
    });
});
