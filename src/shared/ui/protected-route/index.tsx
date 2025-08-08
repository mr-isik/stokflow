'use client';

import React from 'react';
import { useRequireAuth } from '@/shared/hooks/use-auth';
import { Spinner } from '@heroui/react';

interface ProtectedRouteProps {
    children: React.ReactNode;
    redirectTo?: string;
    fallback?: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
    children,
    redirectTo = '/auth/login',
    fallback = (
        <div className="flex items-center justify-center min-h-screen">
            <Spinner size="lg" />
        </div>
    ),
}) => {
    const { shouldRender } = useRequireAuth(redirectTo);

    if (!shouldRender) {
        return <>{fallback}</>;
    }

    return <>{children}</>;
};
