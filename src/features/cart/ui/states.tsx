/**
 * Cart state templates and loading states
 * Shared components for different cart states
 */

import { Button, Spinner } from '@heroui/react';
import { IoStorefrontOutline } from 'react-icons/io5';
import Link from 'next/link';

interface CartStateProps {
    className?: string;
}

export const CartLoadingState = ({ className }: CartStateProps) => (
    <div className={`flex items-center justify-center h-64 ${className || ''}`}>
        <Spinner size="lg" />
    </div>
);

export const CartErrorState = ({ className }: CartStateProps) => (
    <div className={`text-center py-16 ${className || ''}`}>
        <h2 className="text-2xl font-bold text-danger mb-4">
            Sepet yüklenirken bir hata oluştu
        </h2>
        <Button color="primary" onPress={() => window.location.reload()}>
            Tekrar Dene
        </Button>
    </div>
);

interface EmptyCartStateProps extends CartStateProps {
    title?: string;
    description?: string;
    actionText?: string;
    actionHref?: string;
    compact?: boolean;
}

export const EmptyCartState = ({
    className,
    title = 'Sepetiniz Boş',
    description = 'Alışverişe başlamak için ürünlerimizi keşfetmeye başlayın',
    actionText = 'Alışverişe Başla',
    actionHref = '/',
    compact = false,
}: EmptyCartStateProps) => (
    <div
        className={`text-center ${compact ? 'py-8' : 'py-16'} ${className || ''}`}
    >
        <IoStorefrontOutline
            className={`mx-auto mb-6 text-default-300 ${compact ? 'w-16 h-16' : 'w-24 h-24'}`}
        />
        <h2
            className={`font-bold text-default-700 mb-4 ${compact ? 'text-xl' : 'text-3xl'}`}
        >
            {title}
        </h2>
        <p
            className={`text-default-500 mb-8 max-w-md mx-auto ${compact ? 'text-sm' : ''}`}
        >
            {description}
        </p>
        <Button
            as={Link}
            href={actionHref}
            color="primary"
            size={compact ? 'md' : 'lg'}
            className={compact ? 'px-6' : 'px-8'}
        >
            {actionText}
        </Button>
    </div>
);

// Higher-order component for cart state management
interface WithCartStateProps {
    isLoading: boolean;
    isError: boolean;
    isEmpty: boolean;
    children: React.ReactNode;
    loadingComponent?: React.ReactNode;
    errorComponent?: React.ReactNode;
    emptyComponent?: React.ReactNode;
    wrapper?: React.ComponentType<{ children: React.ReactNode }>;
}

export const WithCartState = ({
    isLoading,
    isError,
    isEmpty,
    children,
    loadingComponent,
    errorComponent,
    emptyComponent,
    wrapper: Wrapper = ({ children }) => <>{children}</>,
}: WithCartStateProps) => {
    if (isLoading) {
        return <Wrapper>{loadingComponent || <CartLoadingState />}</Wrapper>;
    }

    if (isError) {
        return <Wrapper>{errorComponent || <CartErrorState />}</Wrapper>;
    }

    if (isEmpty) {
        return <Wrapper>{emptyComponent || <EmptyCartState />}</Wrapper>;
    }

    return <Wrapper>{children}</Wrapper>;
};
