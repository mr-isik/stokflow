import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ProductCard } from '../ui/product-card';
import type { Product } from '../model';
import { render, mockProduct, mockProductWithoutImage } from './test-utilities';

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
    const mockOnProductClick = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders product card with all elements', () => {
        render(
            <ProductCard
                product={mockProduct}
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

    it('does not call onProductClick when it is not provided', async () => {
        const user = userEvent.setup();

        render(<ProductCard product={mockProduct} />);

        const productTitle = screen.getByText(mockProduct.title);
        await user.click(productTitle);

        // Should not throw any errors
        expect(mockOnProductClick).not.toHaveBeenCalled();
    });

    it('returns null when product has no images', () => {
        const { container } = render(
            <ProductCard
                product={mockProductWithoutImage}
                onProductClick={mockOnProductClick}
            />
        );

        expect(container.firstChild).toBeNull();
    });

    it('uses featured image when available', () => {
        render(
            <ProductCard
                product={mockProduct}
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
                onProductClick={mockOnProductClick}
                className={customClass}
            />
        );

        const card = screen
            .getByText(mockProduct.title)
            .closest('.custom-product-card');
        expect(card).toBeInTheDocument();
    });

    it('displays correct price from product variants', () => {
        render(
            <ProductCard
                product={mockProduct}
                onProductClick={mockOnProductClick}
            />
        );

        expect(screen.getByText('99.99 TL')).toBeInTheDocument();
    });

    it('truncates long product titles correctly', () => {
        const productWithLongTitle = {
            ...mockProduct,
            title: 'This is a very long product title that should be truncated when displayed in the product card to prevent layout issues',
        };

        render(
            <ProductCard
                product={productWithLongTitle}
                onProductClick={mockOnProductClick}
            />
        );

        const titleElement = screen.getByText(productWithLongTitle.title);
        expect(titleElement).toHaveClass('line-clamp-2');
    });
});
