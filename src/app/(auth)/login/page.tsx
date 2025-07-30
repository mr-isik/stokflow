'use client';

import { useRouter } from 'next/navigation';
import { AuthCard } from '@/shared/ui/auth-card';
import { LoginForm } from '@/features/auth/ui/login-form';

const LoginPage = () => {
    const router = useRouter();

    const handleLoginSuccess = () => {
        router.push('/');
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
