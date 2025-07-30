'use client';

import { useState } from 'react';
import { Link } from '@heroui/react';
import { IoEye, IoEyeOff } from 'react-icons/io5';
import { useForm } from '@/shared/hooks/use-form';
import { FormInput } from '@/shared/ui/form-input';
import { FormButton } from '@/shared/ui/form-button';
import { loginSchema, type LoginFormData } from '@/entities/auth/model';
import { AuthAPI } from '@/entities/auth/api';

interface LoginFormProps {
    onSuccess?: () => void;
    redirectUrl?: string;
}

export const LoginForm = ({ onSuccess, redirectUrl }: LoginFormProps) => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [serverError, setServerError] = useState<string>('');

    const togglePasswordVisibility = () =>
        setIsPasswordVisible(!isPasswordVisible);

    const { values, errors, isSubmitting, setValue, handleSubmit } =
        useForm<LoginFormData>({
            schema: loginSchema,
            defaultValues: {
                email: '',
                password: '',
            },
            onSubmit: async (data: LoginFormData) => {
                try {
                    setServerError('');
                    const authApi = AuthAPI;
                    await authApi.login(data);
                    onSuccess?.();
                    if (redirectUrl) {
                        window.location.href = redirectUrl;
                    }
                } catch (error) {
                    setServerError(
                        error instanceof Error
                            ? error.message
                            : 'Bir hata oluştu'
                    );
                }
            },
        });

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {serverError && (
                <div className="p-3 rounded-lg bg-danger-50 border border-danger-200">
                    <p className="text-danger-600 text-sm">{serverError}</p>
                </div>
            )}

            <FormInput
                label="Email"
                type="email"
                placeholder="ornek@email.com"
                value={values.email || ''}
                error={errors.email}
                onChange={e => setValue('email', e.target.value)}
                autoComplete="email"
                isRequired
            />

            <FormInput
                label="Şifre"
                type={isPasswordVisible ? 'text' : 'password'}
                placeholder="Şifrenizi girin"
                value={values.password || ''}
                error={errors.password}
                onChange={e => setValue('password', e.target.value)}
                autoComplete="current-password"
                isRequired
                endContent={
                    <button
                        className="focus:outline-none"
                        type="button"
                        onClick={togglePasswordVisibility}
                        aria-label="toggle password visibility"
                    >
                        {isPasswordVisible ? (
                            <IoEyeOff className="w-5 h-5 text-default-400 pointer-events-none" />
                        ) : (
                            <IoEye className="w-5 h-5 text-default-400 pointer-events-none" />
                        )}
                    </button>
                }
            />

            <div className="flex justify-end">
                <Link
                    href="/auth/forgot-password"
                    size="sm"
                    className="text-primary-600 hover:text-primary-700"
                >
                    Şifremi unuttum
                </Link>
            </div>

            <FormButton isLoading={isSubmitting}>Giriş Yap</FormButton>
        </form>
    );
};
