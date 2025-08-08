'use client';

import React from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useAppQuery, useAppMutation } from './use-error-handler';
import { type AppError } from '@/shared/lib/errors';
import { AuthAPI } from '@/entities/auth/api';
import {
    CurrentUserData,
    LoginResponseData,
    type LoginFormData,
} from '@/entities/auth/model';
import { useRouter } from 'next/navigation';

export const AUTH_QUERY_KEYS = {
    me: ['auth', 'me'] as const,
    all: ['auth'] as const,
} as const;

const getStoredToken = (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('auth_token');
};

const setStoredAuth = (user: CurrentUserData['user'], token: string) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('auth_token', token);
    localStorage.setItem('auth_user', JSON.stringify(user));
};

const clearStoredAuth = () => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
};

export const useCurrentUser = () => {
    return useAppQuery({
        queryKey: [...AUTH_QUERY_KEYS.me],
        queryFn: async () => {
            const token = getStoredToken();
            if (!token) {
                throw new Error('No token found');
            }
            return await AuthAPI.getCurrentUser();
        },
        enabled: !!getStoredToken(),
        staleTime: 1000 * 60 * 5,
        retry: (failureCount: number, error: AppError) => {
            if (error.status === 401) {
                clearStoredAuth();
                return false;
            }
            return failureCount < 2;
        },
    });
};

export const useLogin = () => {
    const queryClient = useQueryClient();

    return useAppMutation(
        async (data: LoginFormData): Promise<LoginResponseData> => {
            return await AuthAPI.login(data);
        },
        {
            onSuccess: (response: LoginResponseData) => {
                setStoredAuth(response.user, response.session.access_token);

                queryClient.setQueryData(AUTH_QUERY_KEYS.me, response.user);

                queryClient.invalidateQueries({
                    queryKey: AUTH_QUERY_KEYS.all,
                });
            },
            onError: (error: AppError) => {
                console.error('Login failed:', error);
                clearStoredAuth();
                queryClient.removeQueries({ queryKey: AUTH_QUERY_KEYS.me });
            },
        }
    );
};

export const useLogout = () => {
    const queryClient = useQueryClient();
    const router = useRouter();

    return useAppMutation(
        async () => {
            await AuthAPI.logout();
        },
        {
            onSuccess: () => {
                clearStoredAuth();

                queryClient.clear();
            },
            onError: (error: AppError) => {
                console.error('Logout failed:', error);
                clearStoredAuth();
                queryClient.clear();
                router.push('/login');
            },
        }
    );
};

export const useSignup = () => {
    const queryClient = useQueryClient();

    return useAppMutation(
        async (data: {
            email: string;
            password: string;
            name: string;
        }): Promise<CurrentUserData> => {
            return await AuthAPI.signup(data);
        },
        {
            onSuccess: (response: CurrentUserData) => {
                setStoredAuth(response.user, response.access_token);

                queryClient.setQueryData(AUTH_QUERY_KEYS.me, response.user);

                queryClient.invalidateQueries({
                    queryKey: AUTH_QUERY_KEYS.all,
                });
            },
            onError: (error: AppError) => {
                console.error('Signup failed:', error);
                clearStoredAuth();
                queryClient.removeQueries({ queryKey: AUTH_QUERY_KEYS.me });
            },
        }
    );
};

export const useAuth = () => {
    const queryClient = useQueryClient();
    const { data: user, isLoading, error } = useCurrentUser();
    const token = getStoredToken();

    const logout = useLogout();

    React.useEffect(() => {
        const handleUnauthorized = () => {
            clearStoredAuth();
            queryClient.clear();
        };

        window.addEventListener('auth:unauthorized', handleUnauthorized);
        return () => {
            window.removeEventListener('auth:unauthorized', handleUnauthorized);
        };
    }, [queryClient]);

    if (error && (error as AppError)?.status === 401) {
        clearStoredAuth();
        queryClient.clear();
    }

    return {
        user: user?.user || null,
        token,
        isAuthenticated: !!user && !!token,
        isLoading,
        logout: logout.mutate,
        isLoggingOut: logout.isPending,
    };
};

export const useRequireAuth = (redirectTo = '/login') => {
    const router = useRouter();
    const { isAuthenticated, isLoading } = useAuth();

    if (!isLoading && !isAuthenticated) {
        router.push(redirectTo);
        return { shouldRender: false };
    }

    return { shouldRender: !isLoading && isAuthenticated };
};
