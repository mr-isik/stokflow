import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ProductCard } from '../ui/product-card';
import type { Product } from '../model';
import {
    render,
    mockProduct,
    mockProductWithoutImage,
} from './test-utilities.test';

// Mock the subcomponents
vi.mock('../ui/product-card/product-image', () => ({
    default: ({
        image,
        title,
    }: {
        image: Product['product_images'][0];
        title: string;
    }) => (
        <div data-testid="product-image">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={image.url} alt={image.alt || title} />
        </div>
    ),
}));

vi.mock('../ui/product-card/product-price', () => ({
    default: ({ variants }: { variants: Product['product_variants'] }) => (
        <div data-testid="product-price">{variants[0]?.price} TL</div>
    ),
}));

vi.mock('../ui/product-card/product-actions', () => ({
    default: ({
        onAddToCart,
        isLoading,
    }: {
        onAddToCart: () => void;
        isLoading: boolean;
    }) => (
        <div data-testid="product-actions">
            <button
                onClick={onAddToCart}
                disabled={isLoading}
                data-testid="add-to-cart-btn"
            >
                {isLoading ? 'Ekleniyor...' : 'Sepete Ekle'}
            </button>
        </div>
    ),
}));

describe('ProductCard', () => {
    const mockOnAddToCart = vi.fn();
    const mockOnProductClick = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders product card with all elements', () => {
        render(
            <ProductCard
                product={mockProduct}
                onAddToCart={mockOnAddToCart}
                onProductClick={mockOnProductClick}
            />
        );

        expect(screen.getByTestId('product-image')).toBeInTheDocument();
        expect(screen.getByText(mockProduct.title)).toBeInTheDocument();
        expect(screen.getByTestId('product-price')).toBeInTheDocument();
        expect(screen.getByTestId('product-actions')).toBeInTheDocument();
    });

    it('calls onProductClick when product info is clicked', async () => {
        const user = userEvent.setup();

        render(
            <ProductCard
                product={mockProduct}
                onAddToCart={mockOnAddToCart}
                onProductClick={mockOnProductClick}
            />
        );

        const productTitle = screen.getByText(mockProduct.title);
        await user.click(productTitle);

        expect(mockOnProductClick).toHaveBeenCalledWith(
            mockProduct.id,
            mockProduct.slug
        );
    });

    it('calls onProductClick when image is clicked', async () => {
        const user = userEvent.setup();

        render(
            <ProductCard
                product={mockProduct}
                onAddToCart={mockOnAddToCart}
                onProductClick={mockOnProductClick}
            />
        );

        const productImage = screen.getByTestId('product-image');
        await user.click(productImage);

        expect(mockOnProductClick).toHaveBeenCalledWith(
            mockProduct.id,
            mockProduct.slug
        );
    });

    it('calls onAddToCart when add to cart button is clicked', async () => {
        const user = userEvent.setup();

        render(
            <ProductCard
                product={mockProduct}
                onAddToCart={mockOnAddToCart}
                onProductClick={mockOnProductClick}
            />
        );

        const addToCartBtn = screen.getByTestId('add-to-cart-btn');
        await user.click(addToCartBtn);

        await waitFor(() => {
            expect(mockOnAddToCart).toHaveBeenCalledWith(mockProduct.id);
        });
    });

    it('shows loading state when add to cart is processing', async () => {
        const slowAddToCart = vi
            .fn()
            .mockImplementation(
                () => new Promise(resolve => setTimeout(resolve, 100))
            );

        render(
            <ProductCard
                product={mockProduct}
                onAddToCart={slowAddToCart}
                onProductClick={mockOnProductClick}
            />
        );

        const addToCartBtn = screen.getByTestId('add-to-cart-btn');
        fireEvent.click(addToCartBtn);

        // Should show loading state
        expect(addToCartBtn).toHaveTextContent('Ekleniyor...');
        expect(addToCartBtn).toBeDisabled();

        // Wait for loading to complete
        await waitFor(() => {
            expect(addToCartBtn).toHaveTextContent('Sepete Ekle');
            expect(addToCartBtn).not.toBeDisabled();
        });
    });

    it('does not render add to cart actions when onAddToCart is not provided', () => {
        render(
            <ProductCard
                product={mockProduct}
                onProductClick={mockOnProductClick}
            />
        );

        expect(screen.queryByTestId('product-actions')).not.toBeInTheDocument();
    });

    it('does not call onProductClick when it is not provided', async () => {
        const user = userEvent.setup();

        render(
            <ProductCard product={mockProduct} onAddToCart={mockOnAddToCart} />
        );

        const productTitle = screen.getByText(mockProduct.title);
        await user.click(productTitle);

        // Should not throw any errors
        expect(mockOnProductClick).not.toHaveBeenCalled();
    });

    it('returns null when product has no images', () => {
        const { container } = render(
            <ProductCard
                product={mockProductWithoutImage}
                onAddToCart={mockOnAddToCart}
                onProductClick={mockOnProductClick}
            />
        );

        expect(container.firstChild).toBeNull();
    });

    it('uses featured image when available', () => {
        render(
            <ProductCard
                product={mockProduct}
                onAddToCart={mockOnAddToCart}
                onProductClick={mockOnProductClick}
            />
        );

        const image = screen.getByAltText(mockProduct.product_images[0].alt);
        expect(image).toHaveAttribute('src', mockProduct.product_images[0].url);
    });

    it('uses first image when no featured image is available', () => {
        const productWithoutFeatured = {
            ...mockProduct,
            product_images: [
                {
                    url: 'https://example.com/first.jpg',
                    alt: 'First Image',
                    is_featured: false,
                },
                {
                    url: 'https://example.com/second.jpg',
                    alt: 'Second Image',
                    is_featured: false,
                },
            ],
        };

        render(
            <ProductCard
                product={productWithoutFeatured}
                onAddToCart={mockOnAddToCart}
                onProductClick={mockOnProductClick}
            />
        );

        const image = screen.getByAltText('First Image');
        expect(image).toHaveAttribute('src', 'https://example.com/first.jpg');
    });

    it('applies custom className when provided', () => {
        const customClass = 'custom-product-card';

        render(
            <ProductCard
                product={mockProduct}
                onAddToCart={mockOnAddToCart}
                onProductClick={mockOnProductClick}
                className={customClass}
            />
        );

        const card = screen
            .getByText(mockProduct.title)
            .closest('.custom-product-card');
        expect(card).toBeInTheDocument();
    });

    it('handles add to cart errors gracefully', async () => {
        const errorAddToCart = vi
            .fn()
            .mockRejectedValue(new Error('Network error'));

        render(
            <ProductCard
                product={mockProduct}
                onAddToCart={errorAddToCart}
                onProductClick={mockOnProductClick}
            />
        );

        const addToCartBtn = screen.getByTestId('add-to-cart-btn');
        fireEvent.click(addToCartBtn);

        // Should still reset loading state even after error
        await waitFor(() => {
            expect(addToCartBtn).toHaveTextContent('Sepete Ekle');
            expect(addToCartBtn).not.toBeDisabled();
        });

        expect(errorAddToCart).toHaveBeenCalledWith(mockProduct.id);
    });

    it('displays correct price from product variants', () => {
        render(
            <ProductCard
                product={mockProduct}
                onAddToCart={mockOnAddToCart}
                onProductClick={mockOnProductClick}
            />
        );

        expect(screen.getByText('299.99 TL')).toBeInTheDocument();
    });

    it('truncates long product titles correctly', () => {
        const productWithLongTitle = {
            ...mockProduct,
            title: 'This is a very long product title that should be truncated when displayed in the product card to prevent layout issues',
        };

        render(
            <ProductCard
                product={productWithLongTitle}
                onAddToCart={mockOnAddToCart}
                onProductClick={mockOnProductClick}
            />
        );

        const titleElement = screen.getByText(productWithLongTitle.title);
        expect(titleElement).toHaveClass('line-clamp-2');
    });
});
