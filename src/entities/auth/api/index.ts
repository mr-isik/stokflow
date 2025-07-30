import { apiClient } from '@/shared/api';
import {
    LoginFormData,
    loginSchema,
    SignupFormData,
    signupSchema,
} from '../model';

export interface AuthResponse {
    user: {
        id: string;
        email: string;
        name: string;
    };
    token: string;
}

export interface AuthError {
    message: string;
    code?: string;
}

export const AuthAPI = {
    async login(data: LoginFormData): Promise<AuthResponse> {
        try {
            const res = await apiClient.post('/auth/login', data, {
                request: loginSchema,
            });
            return res;
        } catch {
            throw new Error(
                'Giriş yapılamadı. Email veya şifrenizi kontrol edin.'
            );
        }
    },

    async signup(data: {
        email: string;
        password: string;
        name: string;
    }): Promise<AuthResponse> {
        try {
            const res = await apiClient.post('/auth/signup', data);
            return res;
        } catch (error) {
            throw new Error(
                'Kayıt oluşturulamadı. Lütfen bilgilerinizi kontrol edin.'
            );
        }
    },

    async logout(): Promise<void> {
        try {
            await apiClient.post('/auth/logout');
        } catch {
            throw new Error('Çıkış yapılamadı');
        }
    },

    async getCurrentUser(): Promise<AuthResponse['user'] | null> {
        try {
            const response = await apiClient.get('/auth/me');
            return response.user;
        } catch {
            return null;
        }
    },
};
