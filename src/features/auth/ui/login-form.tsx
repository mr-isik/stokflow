'use client';

import { useEffect, useState } from 'react';
import { Link } from '@heroui/react';
import { IoEye, IoEyeOff } from 'react-icons/io5';
import { FormInput } from '@/shared/ui/form-input';
import { FormButton } from '@/shared/ui/form-button';
import { useLoginForm } from '../hooks/use-login-form';

interface LoginFormProps {
    onSuccess?: () => void;
    redirectUrl?: string;
}

export const LoginForm = ({ onSuccess, redirectUrl }: LoginFormProps) => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [serverError, setServerError] = useState<string>('');

    const togglePasswordVisibility = () =>
        setIsPasswordVisible(!isPasswordVisible);

    const { handleSubmit, register, formState, onSubmit, isSubmitting } =
        useLoginForm(
            message => setServerError(message),
            onSuccess,
            redirectUrl
        );

    const { errors } = formState;

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {serverError && (
                <div className="p-3 rounded-lg bg-danger-50 border border-danger-200">
                    <p className="text-danger-600 text-sm">{serverError}</p>
                </div>
            )}

            <FormInput
                label="Email"
                type="email"
                placeholder="ornek@email.com"
                error={errors.email}
                autoComplete="email"
                isRequired
                {...register('email')}
            />

            <FormInput
                label="Şifre"
                type={isPasswordVisible ? 'text' : 'password'}
                placeholder="Şifrenizi girin"
                error={errors.password}
                autoComplete="current-password"
                isRequired
                {...register('password')}
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
