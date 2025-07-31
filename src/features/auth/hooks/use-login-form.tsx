import { AuthAPI } from '@/entities/auth/api';
import { LoginFormData, loginSchema } from '@/entities/auth/model';
import { useFormHandler } from '@/shared/hooks/use-form-handler';
import { useRouter } from 'next/navigation';

export const useLoginForm = (
    setError: (message: string) => void,
    onSuccess?: () => void,
    redirectUrl?: string
) => {
    const router = useRouter();

    const { handleSubmit, errors, register, formState, isSubmitting } =
        useFormHandler({
            schema: loginSchema,
            defaultValues: {
                email: '',
                password: '',
            },
            mode: 'onBlur', // Changed from 'onSubmit' to 'onBlur' for immediate validation
        });

    const onSubmit = async (data: LoginFormData) => {
        try {
            setError('');
            const authApi = AuthAPI;
            await authApi.login(data);
            onSuccess?.();
            if (redirectUrl) {
                router.push(redirectUrl);
            }
        } catch (error) {
            setError(
                error instanceof Error ? error.message : 'Bir hata oluştu'
            );
        }
    };

    return {
        handleSubmit,
        onSubmit,
        register,
        isSubmitting,
        formState: {
            ...formState,
            errors, // Include the errors in formState
        },
    };
};
