'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthAPI } from '@/entities/auth/api';

interface User {
    id: string;
    email: string;
    name: string;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    setAuth: (user: User, token: string) => void;
    clearAuth: () => void;
    isAuthenticated: boolean;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

interface AuthProviderProps {
    children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // localStorage'dan auth bilgilerini yükle ve token'ı doğrula
    useEffect(() => {
        const initializeAuth = async () => {
            if (typeof window !== 'undefined') {
                const savedToken = localStorage.getItem('auth_token');
                const savedUser = localStorage.getItem('auth_user');

                if (savedToken && savedUser) {
                    try {
                        const parsedUser = JSON.parse(savedUser);
                        setToken(savedToken);
                        setUser(parsedUser);

                        // Token'ı server'da doğrula
                        const isValid = await AuthAPI.validateToken();
                        if (!isValid) {
                            // Token geçersizse temizle
                            clearAuth();
                        }
                    } catch (error) {
                        console.error('Auth initialization error:', error);
                        clearAuth();
                    }
                }
            }
            setIsLoading(false);
        };

        initializeAuth();
    }, []);

    const setAuth = (userData: User, authToken: string) => {
        setUser(userData);
        setToken(authToken);

        // localStorage'a kaydet
        if (typeof window !== 'undefined') {
            localStorage.setItem('auth_token', authToken);
            localStorage.setItem('auth_user', JSON.stringify(userData));
        }
    };

    const clearAuth = () => {
        setUser(null);
        setToken(null);

        // localStorage'dan temizle
        if (typeof window !== 'undefined') {
            localStorage.removeItem('auth_token');
            localStorage.removeItem('auth_user');
        }
    };

    const value: AuthContextType = {
        user,
        token,
        setAuth,
        clearAuth,
        isAuthenticated: !!user && !!token,
        isLoading,
    };

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
};
