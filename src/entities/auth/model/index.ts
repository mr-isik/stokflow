import { z } from 'zod';

// Login Schema
export const loginSchema = z.object({
    email: z
        .string()
        .min(1, 'E-posta adresi gerekli')
        .email('Geçerli bir e-posta adresi girin'),
    password: z
        .string()
        .min(1, 'Şifre gerekli')
        .min(6, 'Şifre en az 6 karakter olmalı'),
});

// Signup Schema
export const signupSchema = z
    .object({
        name: z
            .string()
            .min(1, 'İsim gerekli')
            .min(2, 'İsim en az 2 karakter olmalı')
            .max(50, 'İsim en fazla 50 karakter olabilir'),
        email: z
            .string()
            .min(1, 'E-posta adresi gerekli')
            .email('Geçerli bir e-posta adresi girin'),
        password: z
            .string()
            .min(1, 'Şifre gerekli')
            .min(6, 'Şifre en az 6 karakter olmalı')
            .regex(/[A-Z]/, 'Şifre en az bir büyük harf içermeli')
            .regex(/[a-z]/, 'Şifre en az bir küçük harf içermeli')
            .regex(/[0-9]/, 'Şifre en az bir rakam içermeli'),
        confirmPassword: z.string().min(1, 'Şifre tekrarı gerekli'),
    })
    .refine(data => data.password === data.confirmPassword, {
        message: 'Şifreler eşleşmiyor',
        path: ['confirmPassword'],
    });

// Types
export type LoginFormData = z.infer<typeof loginSchema>;
export type SignupFormData = z.infer<typeof signupSchema>;

// Auth User Type
export interface User {
    id: string;
    name: string;
    email: string;
    role: 'user' | 'admin';
    createdAt: Date;
    updatedAt: Date;
}

// Auth State Type
export interface AuthState {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
}
