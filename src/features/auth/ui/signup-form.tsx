'use client';

import { useEffect, useState } from 'react';
import { Button } from '@heroui/react';
import { IoEye, IoEyeOff } from 'react-icons/io5';

import { FormInput } from '@/shared/ui/form-input';
import { FormButton } from '@/shared/ui/form-button';
import { useSignupForm } from '../hooks/use-signup-form';

interface SignupFormProps {
    onSuccess?: () => void;
    onNavigateToLogin?: () => void;
    redirectUrl?: string;
}

export function SignupForm({ onSuccess, onNavigateToLogin }: SignupFormProps) {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
        useState(false);
    const [serverError, setServerError] = useState<string>('');

    const { handleSubmit, register, formState, onSubmit, isSubmitting } =
        useSignupForm(message => setServerError(message), onSuccess, '/login');

    const { errors } = formState;

    const togglePasswordVisibility = () =>
        setIsPasswordVisible(!isPasswordVisible);
    const toggleConfirmPasswordVisibility = () =>
        setIsConfirmPasswordVisible(!isConfirmPasswordVisible);

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-6">
            {/* Server Error */}
            {serverError && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200">
                    <p className="text-sm text-red-600">{serverError}</p>
                </div>
            )}

            {/* Form Fields */}
            <div className="space-y-4">
                {/* Name Field */}
                <FormInput
                    type="text"
                    label="Ad Soyad"
                    placeholder="Adınızı ve soyadınızı girin"
                    error={errors.name}
                    isRequired
                    {...register('name')}
                />

                {/* Email Field */}
                <FormInput
                    label="Email"
                    type="email"
                    placeholder="ornek@email.com"
                    error={errors.email}
                    autoComplete="email"
                    isRequired
                    {...register('email')}
                />

                {/* Password Field */}
                <FormInput
                    type={isPasswordVisible ? 'text' : 'password'}
                    label="Şifre"
                    placeholder="Şifrenizi girin"
                    error={errors.password}
                    isRequired
                    {...register('password')}
                    endContent={
                        <Button
                            className="focus:outline-none"
                            type="button"
                            onClick={togglePasswordVisibility}
                            aria-label="toggle password visibility"
                            variant="light"
                            isIconOnly
                            size="sm"
                        >
                            {isPasswordVisible ? (
                                <IoEyeOff className="w-5 h-5 text-default-400 pointer-events-none" />
                            ) : (
                                <IoEye className="w-5 h-5 text-default-400 pointer-events-none" />
                            )}
                        </Button>
                    }
                />

                {/* Confirm Password Field */}
                <FormInput
                    type={isConfirmPasswordVisible ? 'text' : 'password'}
                    label="Şifreyi Onayla"
                    placeholder="Şifrenizi tekrar girin"
                    error={errors.confirmPassword}
                    isRequired
                    {...register('confirmPassword')}
                    endContent={
                        <Button
                            className="focus:outline-none"
                            type="button"
                            onClick={toggleConfirmPasswordVisibility}
                            aria-label="toggle password visibility"
                            variant="light"
                            isIconOnly
                            size="sm"
                        >
                            {isConfirmPasswordVisible ? (
                                <IoEyeOff className="w-5 h-5 text-default-400 pointer-events-none" />
                            ) : (
                                <IoEye className="w-5 h-5 text-default-400 pointer-events-none" />
                            )}
                        </Button>
                    }
                />
            </div>

            {/* Password Requirements */}
            <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
                <p className="text-xs text-blue-600 font-medium mb-2">
                    Şifre gereksinimleri:
                </p>
                <ul className="text-xs text-blue-600 space-y-1">
                    <li>• En az 6 karakter</li>
                    <li>• En az bir büyük harf (A-Z)</li>
                    <li>• En az bir küçük harf (a-z)</li>
                    <li>• En az bir rakam (0-9)</li>
                </ul>
            </div>

            {/* Submit Button */}
            <FormButton
                type="submit"
                isLoading={isSubmitting}
                className="w-full"
            >
                {isSubmitting ? 'Hesap oluşturuluyor...' : 'Hesap Oluştur'}
            </FormButton>

            {/* Login Link */}
            <div className="text-center">
                <p className="text-sm text-gray-600">
                    Zaten hesabınız var mı?{' '}
                    <Button
                        variant="light"
                        size="sm"
                        className="p-0 h-auto text-blue-600 hover:text-blue-700 font-medium"
                        onClick={onNavigateToLogin}
                    >
                        Giriş yapın
                    </Button>
                </p>
            </div>
        </form>
    );
}
