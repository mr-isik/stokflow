import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import {
    CartLoadingState,
    CartErrorState,
    EmptyCartState,
    WithCartState,
} from '../ui/states';

// Mock dependencies
vi.mock('@heroui/react', () => ({
    Spinner: () => <div data-testid="spinner">Loading...</div>,
    Button: ({
        children,
        onPress,
        variant,
        color,
        size,
        as: Component = 'button',
        href,
        ...props
    }: any) => (
        <Component
            onClick={onPress}
            data-testid={`button-${variant || 'default'}-${color || 'default'}`}
            data-size={size}
            href={href}
            {...props}
        >
            {children}
        </Component>
    ),
}));

vi.mock('react-icons/io5', () => ({
    IoStorefrontOutline: () => <span data-testid="icon-storefront">🏪</span>,
}));

vi.mock('next/link', () => ({
    default: ({
        children,
        href,
    }: {
        children: React.ReactNode;
        href: string;
    }) => (
        <a href={href} data-testid="link">
            {children}
        </a>
    ),
}));

const createWrapper = () => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: { retry: false },
        },
    });

    return ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
};

describe('Cart States Components', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('CartLoadingState', () => {
        it('renders loading spinner', () => {
            render(<CartLoadingState />, { wrapper: createWrapper() });

            expect(screen.getByTestId('spinner')).toBeInTheDocument();
        });

        it('applies custom className', () => {
            const { container } = render(
                <CartLoadingState className="custom-class" />,
                { wrapper: createWrapper() }
            );

            expect(container.firstChild).toHaveClass('custom-class');
        });
    });

    describe('CartErrorState', () => {
        it('renders error message and retry button', () => {
            render(<CartErrorState />, { wrapper: createWrapper() });

            expect(
                screen.getByText('Sepet yüklenirken bir hata oluştu')
            ).toBeInTheDocument();
            expect(
                screen.getByTestId('button-default-primary')
            ).toBeInTheDocument();
            expect(screen.getByText('Tekrar Dene')).toBeInTheDocument();
        });

        it('applies custom className', () => {
            const { container } = render(
                <CartErrorState className="custom-class" />,
                { wrapper: createWrapper() }
            );

            expect(container.firstChild).toHaveClass('custom-class');
        });

        it('reloads page when retry button is clicked', () => {
            const originalReload = window.location.reload;
            window.location.reload = vi.fn();

            render(<CartErrorState />, { wrapper: createWrapper() });

            const retryButton = screen.getByTestId('button-default-primary');
            retryButton.click();

            expect(window.location.reload).toHaveBeenCalled();

            window.location.reload = originalReload;
        });
    });

    describe('EmptyCartState', () => {
        it('renders default empty cart message and shopping link', () => {
            render(<EmptyCartState />, { wrapper: createWrapper() });

            expect(screen.getByTestId('icon-storefront')).toBeInTheDocument();
            expect(screen.getByText('Sepetiniz Boş')).toBeInTheDocument();
            expect(
                screen.getByText(
                    'Alışverişe başlamak için ürünlerimizi keşfetmeye başlayın'
                )
            ).toBeInTheDocument();
            expect(screen.getByTestId('link')).toBeInTheDocument();
            expect(screen.getByText('Alışverişe Başla')).toBeInTheDocument();
        });

        it('renders with custom title and description', () => {
            render(
                <EmptyCartState
                    title="Özel Başlık"
                    description="Özel açıklama"
                />,
                { wrapper: createWrapper() }
            );

            expect(screen.getByText('Özel Başlık')).toBeInTheDocument();
            expect(screen.getByText('Özel açıklama')).toBeInTheDocument();
        });

        it('links to home page by default', () => {
            render(<EmptyCartState />, { wrapper: createWrapper() });

            const link = screen.getByTestId('link');
            expect(link).toHaveAttribute('href', '/');
        });

        it('renders with custom action text and href', () => {
            render(
                <EmptyCartState
                    actionText="Ürünlere Göz At"
                    actionHref="/products"
                />,
                { wrapper: createWrapper() }
            );

            expect(screen.getByText('Ürünlere Göz At')).toBeInTheDocument();
            const link = screen.getByTestId('link');
            expect(link).toHaveAttribute('href', '/products');
        });

        it('renders in compact mode', () => {
            const { container } = render(<EmptyCartState compact={true} />, {
                wrapper: createWrapper(),
            });

            expect(container.firstChild).toHaveClass('py-8');
        });

        it('applies custom className', () => {
            const { container } = render(
                <EmptyCartState className="custom-class" />,
                { wrapper: createWrapper() }
            );

            expect(container.firstChild).toHaveClass('custom-class');
        });
    });

    describe('WithCartState', () => {
        const mockChildren = <div data-testid="cart-content">Cart Content</div>;

        it('renders loading state when isLoading is true', () => {
            render(
                <WithCartState isLoading={true} isError={false} isEmpty={false}>
                    {mockChildren}
                </WithCartState>,
                { wrapper: createWrapper() }
            );

            expect(screen.getByTestId('spinner')).toBeInTheDocument();
            expect(
                screen.queryByTestId('cart-content')
            ).not.toBeInTheDocument();
        });

        it('renders error state when isError is true', () => {
            render(
                <WithCartState isLoading={false} isError={true} isEmpty={false}>
                    {mockChildren}
                </WithCartState>,
                { wrapper: createWrapper() }
            );

            expect(
                screen.getByText('Sepet yüklenirken bir hata oluştu')
            ).toBeInTheDocument();
            expect(
                screen.queryByTestId('cart-content')
            ).not.toBeInTheDocument();
        });

        it('renders empty state when isEmpty is true', () => {
            render(
                <WithCartState isLoading={false} isError={false} isEmpty={true}>
                    {mockChildren}
                </WithCartState>,
                { wrapper: createWrapper() }
            );

            expect(screen.getByTestId('icon-storefront')).toBeInTheDocument();
            expect(screen.getByText('Sepetiniz Boş')).toBeInTheDocument();
            expect(
                screen.queryByTestId('cart-content')
            ).not.toBeInTheDocument();
        });

        it('renders children when no special state is active', () => {
            render(
                <WithCartState
                    isLoading={false}
                    isError={false}
                    isEmpty={false}
                >
                    {mockChildren}
                </WithCartState>,
                { wrapper: createWrapper() }
            );

            expect(screen.getByTestId('cart-content')).toBeInTheDocument();
            expect(screen.queryByTestId('spinner')).not.toBeInTheDocument();
        });

        it('prioritizes loading state over error state', () => {
            render(
                <WithCartState isLoading={true} isError={true} isEmpty={false}>
                    {mockChildren}
                </WithCartState>,
                { wrapper: createWrapper() }
            );

            expect(screen.getByTestId('spinner')).toBeInTheDocument();
            expect(
                screen.queryByText('Sepet yüklenirken bir hata oluştu')
            ).not.toBeInTheDocument();
        });

        it('prioritizes error state over empty state', () => {
            render(
                <WithCartState isLoading={false} isError={true} isEmpty={true}>
                    {mockChildren}
                </WithCartState>,
                { wrapper: createWrapper() }
            );

            expect(
                screen.getByText('Sepet yüklenirken bir hata oluştu')
            ).toBeInTheDocument();
            expect(
                screen.queryByTestId('icon-storefront')
            ).not.toBeInTheDocument();
        });

        it('renders custom loading component', () => {
            const customLoading = (
                <div data-testid="custom-loading">Custom Loading</div>
            );

            render(
                <WithCartState
                    isLoading={true}
                    isError={false}
                    isEmpty={false}
                    loadingComponent={customLoading}
                >
                    {mockChildren}
                </WithCartState>,
                { wrapper: createWrapper() }
            );

            expect(screen.getByTestId('custom-loading')).toBeInTheDocument();
            expect(screen.queryByTestId('spinner')).not.toBeInTheDocument();
        });

        it('renders custom error component', () => {
            const customError = (
                <div data-testid="custom-error">Custom Error</div>
            );

            render(
                <WithCartState
                    isLoading={false}
                    isError={true}
                    isEmpty={false}
                    errorComponent={customError}
                >
                    {mockChildren}
                </WithCartState>,
                { wrapper: createWrapper() }
            );

            expect(screen.getByTestId('custom-error')).toBeInTheDocument();
            expect(
                screen.queryByText('Sepet yüklenirken bir hata oluştu')
            ).not.toBeInTheDocument();
        });

        it('renders custom empty component', () => {
            const customEmpty = (
                <div data-testid="custom-empty">Custom Empty</div>
            );

            render(
                <WithCartState
                    isLoading={false}
                    isError={false}
                    isEmpty={true}
                    emptyComponent={customEmpty}
                >
                    {mockChildren}
                </WithCartState>,
                { wrapper: createWrapper() }
            );

            expect(screen.getByTestId('custom-empty')).toBeInTheDocument();
            expect(
                screen.queryByTestId('icon-storefront')
            ).not.toBeInTheDocument();
        });

        it('uses custom wrapper component', () => {
            const CustomWrapper = ({
                children,
            }: {
                children: React.ReactNode;
            }) => <div data-testid="custom-wrapper">{children}</div>;

            render(
                <WithCartState
                    isLoading={false}
                    isError={false}
                    isEmpty={false}
                    wrapper={CustomWrapper}
                >
                    {mockChildren}
                </WithCartState>,
                { wrapper: createWrapper() }
            );

            expect(screen.getByTestId('custom-wrapper')).toBeInTheDocument();
            expect(screen.getByTestId('cart-content')).toBeInTheDocument();
        });
    });
});
