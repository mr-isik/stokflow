'use client';

import React from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useAppQuery, useAppMutation } from './use-error-handler';
import { type AppError } from '@/shared/lib/errors';
import { AuthAPI } from '@/entities/auth/api';
import {
    CurrentUserData,
    LoginResponseData,
    SignupFormData,
    type LoginFormData,
} from '@/entities/auth/model';
import { useRouter } from 'next/navigation';

export const AUTH_QUERY_KEYS = {
    me: ['auth', 'me'] as const,
    all: ['auth'] as const,
} as const;

export const AUTH_MUTATION_KEYS = {
    login: ['auth', 'login'] as const,
    logout: ['auth', 'logout'] as const,
    signup: ['auth', 'signup'] as const,
} as const;

export const useCurrentUser = () => {
    return useAppQuery({
        queryKey: [...AUTH_QUERY_KEYS.me],
        queryFn: async () => {
            return await AuthAPI.getCurrentUser();
        },
        staleTime: 1000 * 60 * 5,
        retry: (failureCount: number, error: AppError) => {
            if (error.status === 401) {
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
        AUTH_MUTATION_KEYS.login,
        {
            onSuccess: (response: LoginResponseData) => {
                queryClient.setQueryData(AUTH_QUERY_KEYS.me, response.user);

                queryClient.invalidateQueries({
                    queryKey: AUTH_QUERY_KEYS.all,
                });
            },
            onError: (error: AppError) => {
                console.error('Login failed:', error);
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
        AUTH_MUTATION_KEYS.logout,
        {
            onSuccess: () => {
                queryClient.clear();
            },
            onError: (error: AppError) => {
                console.error('Logout failed:', error);
                queryClient.clear();
                router.push('/login');
            },
        }
    );
};

export const useSignup = () => {
    const queryClient = useQueryClient();

    return useAppMutation(
        async (data: SignupFormData): Promise<CurrentUserData> => {
            return await AuthAPI.signup(data);
        },
        AUTH_MUTATION_KEYS.signup,
        {
            onSuccess: (response: CurrentUserData) => {
                queryClient.setQueryData(AUTH_QUERY_KEYS.me, response.user);

                queryClient.invalidateQueries({
                    queryKey: AUTH_QUERY_KEYS.all,
                });
            },
            onError: (error: AppError) => {
                console.error('Signup failed:', error);
                queryClient.removeQueries({ queryKey: AUTH_QUERY_KEYS.me });
            },
        }
    );
};

export const useAuth = () => {
    const queryClient = useQueryClient();
    const { data: user, isLoading, error } = useCurrentUser();

    const logout = useLogout();

    React.useEffect(() => {
        const handleUnauthorized = () => {
            queryClient.clear();
        };

        window.addEventListener('auth:unauthorized', handleUnauthorized);
        return () => {
            window.removeEventListener('auth:unauthorized', handleUnauthorized);
        };
    }, [queryClient]);

    if (error && (error as AppError)?.status === 401) {
        queryClient.clear();
    }

    return {
        user: user?.user || null,
        isAuthenticated: !!user,
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
