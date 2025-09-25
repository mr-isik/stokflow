'use client';

import { LoginForm } from '@/features/auth/ui/login-form';
import { AuthCard } from '@/shared/ui/auth-card';
import { QueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

const LoginPage = () => {
    const router = useRouter();
    const queryClient = new QueryClient();

    const handleLoginSuccess = () => {
        router.push('/');
        queryClient.resetQueries({
            queryKey: ['cart'],
        });
    };

    const handleNavigateToSignup = () => {
        router.push('/signup');
    };

    return (
        <AuthCard title="Giriş Yap">
            <LoginForm onSuccess={handleLoginSuccess} />

            {/* Signup Link */}
            <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                    Hesabınız yok mu?{' '}
                    <button
                        onClick={handleNavigateToSignup}
                        className="text-blue-600 hover:text-blue-700 font-medium hover:underline"
                    >
                        Kayıt olun
                    </button>
                </p>
            </div>
        </AuthCard>
    );
};

export default LoginPage;
