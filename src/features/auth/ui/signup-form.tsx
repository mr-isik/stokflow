'use client';

import { useState } from 'react';
import { Button } from '@heroui/react';
import { IoEye, IoEyeOff } from 'react-icons/io5';

import { useForm } from '@/shared/hooks/use-form';
import { FormInput } from '@/shared/ui/form-input';
import { FormButton } from '@/shared/ui/form-button';
import { signupSchema, type SignupFormData } from '@/entities/auth/model';
import { AuthAPI } from '@/entities/auth/api';

interface SignupFormProps {
    onSuccess?: () => void;
    onNavigateToLogin?: () => void;
}

export function SignupForm({ onSuccess, onNavigateToLogin }: SignupFormProps) {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
        useState(false);
    const [serverError, setServerError] = useState<string>('');

    const { values, errors, isSubmitting, setValue, handleSubmit } =
        useForm<SignupFormData>({
            schema: signupSchema,
            defaultValues: {
                name: '',
                email: '',
                password: '',
                confirmPassword: '',
            },
            onSubmit: async formData => {
                try {
                    setServerError('');
                    const authApi = AuthAPI;
                    await authApi.signup({
                        name: formData.name,
                        email: formData.email,
                        password: formData.password,
                    });
                    onSuccess?.();
                } catch (error) {
                    const errorMessage =
                        error instanceof Error
                            ? error.message
                            : 'Kayıt olurken bir hata oluştu';
                    setServerError(errorMessage);
                }
            },
        });

    const togglePasswordVisibility = () =>
        setIsPasswordVisible(!isPasswordVisible);
    const toggleConfirmPasswordVisibility = () =>
        setIsConfirmPasswordVisible(!isConfirmPasswordVisible);

    return (
        <form onSubmit={handleSubmit} className="w-full space-y-6">
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
                    name="name"
                    type="text"
                    label="Ad Soyad"
                    placeholder="Adınızı ve soyadınızı girin"
                    value={values.name || ''}
                    error={errors.name}
                    isRequired
                    onChange={e => setValue('name', e.target.value)}
                />

                {/* Email Field */}
                <FormInput
                    name="email"
                    type="email"
                    label="E-posta"
                    placeholder="E-posta adresinizi girin"
                    value={values.email || ''}
                    error={errors.email}
                    isRequired
                    onChange={e => setValue('email', e.target.value)}
                />

                {/* Password Field */}
                <FormInput
                    name="password"
                    type={isPasswordVisible ? 'text' : 'password'}
                    label="Şifre"
                    placeholder="Şifrenizi girin"
                    value={values.password || ''}
                    error={errors.password}
                    isRequired
                    onChange={e => setValue('password', e.target.value)}
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
                    name="confirmPassword"
                    type={isConfirmPasswordVisible ? 'text' : 'password'}
                    label="Şifre Tekrarı"
                    placeholder="Şifrenizi tekrar girin"
                    value={values.confirmPassword || ''}
                    error={errors.confirmPassword}
                    isRequired
                    onChange={e => setValue('confirmPassword', e.target.value)}
                    endContent={
                        <Button
                            className="focus:outline-none"
                            type="button"
                            onClick={toggleConfirmPasswordVisibility}
                            aria-label="toggle confirm password visibility"
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
