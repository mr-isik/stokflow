import { AuthAPI } from '@/entities/auth/api';
import { SignupFormData, signupSchema } from '@/entities/auth/model';
import { useFormHandler } from '@/shared/hooks/use-form-handler';
import { useRouter } from 'next/navigation';

export const useSignupForm = (
    setError: (message: string) => void,
    onSuccess?: () => void,
    redirectUrl?: string
) => {
    const router = useRouter();

    const { handleSubmit, register, formState, isSubmitting } = useFormHandler({
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
            const authApi = AuthAPI;
            await authApi.signup({
                email: data.email,
                password: data.password,
                name: data.name,
            });
            onSuccess?.();
            if (redirectUrl) {
                router.push(redirectUrl);
            }
        } catch (error) {
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : 'Kayıt olurken bir hata oluştu';
            setError(errorMessage);
        }
    };

    return {
        handleSubmit,
        onSubmit,
        register,
        formState,
        isSubmitting,
    };
};
