import { z } from 'zod';

// Login Schema
export const loginSchema = z.object({
    email: z.email('Geçerli bir e-posta adresi girin'),
    password: z
        .string()
        .min(1, 'Şifre gerekli')
        .min(6, 'Şifre en az 6 karakter olmalı'),
});

export const signupSchema = z
    .object({
        name: z
            .string()
            .min(1, 'Ad ve soyad gerekli')
            .min(2, 'Ad ve soyad en az 2 karakter olmalı')
            .max(50, 'Ad ve soyad en fazla 50 karakter olabilir'),
        email: z.email('Geçerli bir e-posta adresi girin'),
        password: z
            .string()
            .min(1, 'Şifre gerekli')
            .min(8, 'Şifre en az 8 karakter olmalı')
            .regex(/[A-Z]/, 'Şifre en az bir büyük harf içermeli')
            .regex(/[a-z]/, 'Şifre en az bir küçük harf içermeli')
            .regex(/[0-9]/, 'Şifre en az bir rakam içermeli')
            .regex(/[^a-zA-Z0-9]/, 'Şifre en az bir özel karakter içermeli'),
        confirmPassword: z.string().min(1, 'Şifre tekrarı gerekli'),
    })
    .refine(data => data.password === data.confirmPassword, {
        message: 'Şifreler eşleşmiyor',
        path: ['confirmPassword'],
    });

export const currentUserResponseSchema = z.object({
    user: z.object({
        id: z.string(),
        email: z.string().email(),
        user_metadata: z.object({
            name: z.string().max(100).optional(),
        }),
    }),
    access_token: z.string(),
});

export const loginResponseSchema = z.object({
    user: z.object({
        id: z.string(),
        email: z.string().email(),
        user_metadata: z.object({
            name: z.string().max(100).optional(),
        }),
    }),
    session: z.object({
        access_token: z.string(),
    }),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type SignupFormData = z.infer<typeof signupSchema>;
export type CurrentUserData = z.infer<typeof currentUserResponseSchema>;
export type LoginResponseData = z.infer<typeof loginResponseSchema>;

export interface User {
    id: string;
    name: string;
    email: string;
    role: 'user' | 'admin';
    createdAt: Date;
    updatedAt: Date;
}

export interface AuthState {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
}
