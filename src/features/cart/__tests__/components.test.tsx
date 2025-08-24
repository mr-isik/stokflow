import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import {
    QuantityControls,
    RemoveButton,
    CartItemImage,
    VariantOptions,
    CartItemPrice,
} from '../ui/components';
import { mockCartItems, mockAuthStates } from './test-data';
import { useAuth } from '@/shared/hooks';

// Mock dependencies
vi.mock('@/shared/hooks', () => ({
    useAuth: vi.fn(),
}));

vi.mock('@heroui/react', () => ({
    Button: ({
        children,
        onPress,
        isDisabled,
        size,
        variant,
        color,
        isLoading,
        startContent,
        ...props
    }: any) => (
        <button
            onClick={onPress}
            disabled={isDisabled || isLoading}
            data-testid={`button-${variant || 'default'}-${color || 'default'}`}
            data-size={size}
            data-loading={isLoading}
            {...props}
        >
            {startContent && (
                <span data-testid="button-start-content">{startContent}</span>
            )}
            {isLoading ? 'Loading...' : children}
        </button>
    ),
    Spinner: () => <div data-testid="spinner">Loading...</div>,
    Image: ({ src, alt, width, height, ...props }: any) => (
        <div
            data-testid="cart-item-image"
            data-src={src}
            data-alt={alt}
            data-width={width}
            data-height={height}
            {...props}
        />
    ),
    Chip: ({ children, size, variant }: any) => (
        <span data-testid="chip" data-size={size} data-variant={variant}>
            {children}
        </span>
    ),
}));

// Mock icons
vi.mock('react-icons/io5', () => ({
    IoAdd: () => <span data-testid="icon-add">+</span>,
    IoRemove: () => <span data-testid="icon-remove">-</span>,
    IoTrashOutline: () => <span data-testid="icon-trash">🗑</span>,
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

describe('Cart UI Components', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.mocked(useAuth).mockReturnValue({
            ...mockAuthStates.authenticated,
            logout: vi.fn(),
            isLoggingOut: false,
        } as any);
    });

    describe('QuantityControls', () => {
        const mockItem = mockCartItems[0];
        const mockProps = {
            item: mockItem,
            onUpdateQuantity: vi.fn(),
        };

        it('renders quantity controls correctly', () => {
            render(<QuantityControls {...mockProps} />, {
                wrapper: createWrapper(),
            });

            expect(screen.getByTestId('icon-remove')).toBeInTheDocument();
            expect(screen.getByText('2')).toBeInTheDocument(); // quantity from mock item
            expect(screen.getByTestId('icon-add')).toBeInTheDocument();
        });

        it('calls onUpdateQuantity when decrease button is clicked', () => {
            render(<QuantityControls {...mockProps} />, {
                wrapper: createWrapper(),
            });

            const decreaseButton = screen
                .getByTestId('icon-remove')
                .closest('button');
            fireEvent.click(decreaseButton!);

            expect(mockProps.onUpdateQuantity).toHaveBeenCalledWith(1, 1);
        });

        it('calls onUpdateQuantity when increase button is clicked', () => {
            render(<QuantityControls {...mockProps} />, {
                wrapper: createWrapper(),
            });

            const increaseButton = screen
                .getByTestId('icon-add')
                .closest('button');
            fireEvent.click(increaseButton!);

            expect(mockProps.onUpdateQuantity).toHaveBeenCalledWith(1, 3);
        });

        it('shows loading state', () => {
            render(<QuantityControls {...mockProps} isLoading={true} />, {
                wrapper: createWrapper(),
            });

            const buttons = screen.getAllByTestId('button-light-default');
            expect(buttons[0]).toHaveAttribute('data-loading', 'true');
            expect(buttons[0]).toBeDisabled();
        });

        it('shows disabled state', () => {
            render(<QuantityControls {...mockProps} isDisabled={true} />, {
                wrapper: createWrapper(),
            });

            const decreaseButton = screen
                .getByTestId('icon-remove')
                .closest('button');
            const increaseButton = screen
                .getByTestId('icon-add')
                .closest('button');

            expect(decreaseButton).toBeDisabled();
            expect(increaseButton).toBeDisabled();
        });

        it('renders compact variant correctly', () => {
            render(<QuantityControls {...mockProps} variant="compact" />, {
                wrapper: createWrapper(),
            });

            const buttons = screen.getAllByTestId('button-flat-default');
            expect(buttons.length).toBeGreaterThan(0);
            expect(screen.getByText('2')).toBeInTheDocument();
        });
    });

    describe('RemoveButton', () => {
        const mockProps = {
            itemId: 1,
            onRemove: vi.fn(),
        };

        it('renders remove button correctly', () => {
            render(<RemoveButton {...mockProps} />, {
                wrapper: createWrapper(),
            });

            expect(
                screen.getByTestId('button-light-danger')
            ).toBeInTheDocument();
            expect(screen.getByText('Kaldır')).toBeInTheDocument();
            expect(screen.getByTestId('icon-trash')).toBeInTheDocument();
        });

        it('calls onRemove when clicked', () => {
            render(<RemoveButton {...mockProps} />, {
                wrapper: createWrapper(),
            });

            const removeButton = screen.getByTestId('button-light-danger');
            fireEvent.click(removeButton);

            expect(mockProps.onRemove).toHaveBeenCalledWith(1);
        });

        it('shows loading state', () => {
            render(<RemoveButton {...mockProps} isLoading={true} />, {
                wrapper: createWrapper(),
            });

            expect(screen.getByText('Loading...')).toBeInTheDocument();
            expect(screen.getByTestId('button-light-danger')).toBeDisabled();
        });

        it('renders icon-only variant correctly', () => {
            render(<RemoveButton {...mockProps} variant="icon-only" />, {
                wrapper: createWrapper(),
            });

            expect(
                screen.getByTestId('button-light-danger')
            ).toBeInTheDocument();
            expect(screen.getByTestId('icon-trash')).toBeInTheDocument();
            expect(screen.queryByText('Kaldır')).not.toBeInTheDocument();
        });
    });

    describe('CartItemImage', () => {
        const mockItem = mockCartItems[0];

        it('renders product image when available', () => {
            render(<CartItemImage item={mockItem} />, {
                wrapper: createWrapper(),
            });

            const image = screen.getByTestId('cart-item-image');
            expect(image).toBeInTheDocument();
            expect(image).toHaveAttribute(
                'data-src',
                'https://example.com/featured.jpg'
            );
            expect(image).toHaveAttribute('data-alt', 'Featured Product Image');
        });

        it('renders placeholder when no image available', () => {
            const itemWithoutImage = {
                ...mockItem,
                variants: {
                    ...mockItem.variants,
                    product: {
                        ...mockItem.variants.product,
                        product_images: [],
                    },
                },
            };

            render(<CartItemImage item={itemWithoutImage} />, {
                wrapper: createWrapper(),
            });

            expect(screen.getByText('No Image')).toBeInTheDocument();
        });

        it('uses custom size', () => {
            render(<CartItemImage item={mockItem} size={80} />, {
                wrapper: createWrapper(),
            });

            const image = screen.getByTestId('cart-item-image');
            expect(image).toHaveAttribute('data-width', '80');
            expect(image).toHaveAttribute('data-height', '80');
        });
    });

    describe('VariantOptions', () => {
        const mockItem = mockCartItems[0];

        it('renders variant options correctly', () => {
            render(<VariantOptions item={mockItem} />, {
                wrapper: createWrapper(),
            });

            expect(screen.getByText('Renk: Kırmızı')).toBeInTheDocument();
            expect(screen.getByText('Beden: M')).toBeInTheDocument();
        });

        it('renders multiple variant options as chips', () => {
            render(<VariantOptions item={mockItem} />, {
                wrapper: createWrapper(),
            });

            const chips = screen.getAllByTestId('chip');
            expect(chips).toHaveLength(2);
        });

        it('renders nothing when no variant options', () => {
            const itemWithoutOptions = {
                ...mockItem,
                variants: {
                    ...mockItem.variants,
                    variant_options: [],
                },
            };

            const { container } = render(
                <VariantOptions item={itemWithoutOptions} />,
                { wrapper: createWrapper() }
            );

            expect(container.firstChild).toBeNull();
        });

        it('renders nothing when only one variant option', () => {
            const itemWithOneOption = {
                ...mockItem,
                variants: {
                    ...mockItem.variants,
                    variant_options: [mockItem.variants.variant_options[0]],
                },
            };

            const { container } = render(
                <VariantOptions item={itemWithOneOption} />,
                { wrapper: createWrapper() }
            );

            expect(container.firstChild).toBeNull();
        });
    });

    describe('CartItemPrice', () => {
        const mockItem = mockCartItems[0]; // quantity: 2, variants.price: 100

        it('renders item price correctly', () => {
            render(<CartItemPrice item={mockItem} />, {
                wrapper: createWrapper(),
            });

            // Mock item has variants.price: 100, quantity: 2
            // Total should be 200
            expect(screen.getByText('₺200,00')).toBeInTheDocument(); // total price (2 x 100)
        });

        it('shows unit price when showUnitPrice is true', () => {
            render(<CartItemPrice item={mockItem} showUnitPrice={true} />, {
                wrapper: createWrapper(),
            });

            expect(screen.getByText('₺200,00')).toBeInTheDocument(); // total price
            expect(screen.getByText('₺100,00 / adet')).toBeInTheDocument(); // unit price
        });

        it('calculates total price correctly for different quantities', () => {
            const item = {
                ...mockItem,
                quantity: 3,
                variants: {
                    ...mockItem.variants,
                    price: 100,
                },
            };
            render(<CartItemPrice item={item} />, { wrapper: createWrapper() });

            expect(screen.getByText('₺300,00')).toBeInTheDocument(); // total price (3 x 100)
        });
    });
});
