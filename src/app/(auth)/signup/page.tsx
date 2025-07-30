'use client';

import { useRouter } from 'next/navigation';
import { AuthCard } from '@/shared/ui/auth-card';
import { SignupForm } from '@/features/auth/ui/signup-form';

const SignupPage = () => {
    const router = useRouter();

    const handleSignupSuccess = () => {
        router.push('/login');
    };

    const handleNavigateToLogin = () => {
        router.push('/login');
    };

    return (
        <AuthCard title="Hesap Oluştur">
            <SignupForm
                onSuccess={handleSignupSuccess}
                onNavigateToLogin={handleNavigateToLogin}
            />
        </AuthCard>
    );
};

export default SignupPage;
