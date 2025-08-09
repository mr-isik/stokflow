import { apiClient, ApiError } from '@/shared/api';
import {
    CurrentUserData,
    currentUserResponseSchema,
    LoginFormData,
    LoginResponseData,
    loginResponseSchema,
    loginSchema,
} from '../model';

export interface AuthError {
    message: string;
    code?: string;
}

export const AuthAPI = {
    async login(data: LoginFormData): Promise<LoginResponseData> {
        const res = await apiClient.post('/auth/login', data, {
            request: loginSchema,
            response: loginResponseSchema,
        });
        return res;
    },

    async signup(data: {
        email: string;
        password: string;
        name: string;
    }): Promise<CurrentUserData> {
        const res = await apiClient.post('/auth/signup', data);
        return res;
    },

    async logout(): Promise<void> {
        await apiClient.post('/auth/logout');
    },

    async getCurrentUser(): Promise<CurrentUserData | null> {
        try {
            const response = await apiClient.get(
                '/users/me',
                {},
                currentUserResponseSchema
            );
            return response;
        } catch (error) {
            return null;
        }
    },

    async validateToken(): Promise<boolean> {
        try {
            const user = await this.getCurrentUser();
            return !!user;
        } catch {
            return false;
        }
    },
};
