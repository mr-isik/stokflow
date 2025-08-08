import { signupSchema } from '@/entities/auth/model';
import { useLogin, useSignup } from '@/shared/hooks/use-auth';
import { useFormHandler } from '@/shared/hooks/use-form-handler';
import { useRouter } from 'next/navigation';

interface SignupFormData {
    email: string;
    password: string;
    name: string;
}

export const useSignupForm = (
    setError: (message: string) => void,
    onSuccess?: () => void,
    redirectUrl?: string
) => {
    const router = useRouter();
    const signupMutation = useSignup();
    const loginMutation = useLogin();

    const { handleSubmit, errors, register, formState, isSubmitting } =
        useFormHandler({
            schema: signupSchema,
            defaultValues: {
                email: '',
                password: '',
                name: '',
                confirmPassword: '',
            },
            mode: 'onBlur',
        });

    const onSubmit = async (data: SignupFormData) => {
        try {
            setError('');
            await signupMutation.mutateAsync(data);

            onSuccess?.();
            await loginMutation.mutateAsync(data);
            if (redirectUrl) {
                router.push(redirectUrl);
            }
        } catch (error: any) {
            console.error('Signup failed:', error);

            // Error mesajını daha akıllı şekilde çıkar
            let errorMessage = 'Bir hata oluştu';

            if (error?.details?.error) {
                errorMessage = error.details.error;
            } else if (error?.details?.message) {
                errorMessage = error.details.message;
            } else if (error?.message) {
                errorMessage = error.message;
            }

            // Kullanıcı dostu mesajlara çevir
            if (
                errorMessage.includes('already registered') ||
                errorMessage.includes('User already exists')
            ) {
                errorMessage =
                    'Bu e-posta adresi zaten kayıtlı. Giriş yapmayı deneyin.';
            } else if (errorMessage.includes('invalid email')) {
                errorMessage = 'Geçersiz e-posta adresi';
            } else if (errorMessage.includes('weak password')) {
                errorMessage = 'Şifre yeterince güçlü değil';
            } else if (errorMessage.includes('too many requests')) {
                errorMessage =
                    'Çok fazla deneme yaptınız. Lütfen daha sonra tekrar deneyin.';
            }

            setError(errorMessage);
        }
    };

    return {
        handleSubmit,
        onSubmit,
        register,
        isSubmitting: isSubmitting || signupMutation.isPending,
        formState: {
            ...formState,
            errors,
        },
    };
};
