'use client';

import { ProductCard } from './product-card';
import type { ProductsResponse } from '../model';

// Mock data example
const mockProduct: ProductsResponse[0] = {
    id: '1',
    title: 'Premium Bluetooth Kulaklık',
    slug: 'premium-bluetooth-kulaklik',
    product_images: [
        {
            url: 'https://example.com/headphones.jpg',
            alt: 'Premium Bluetooth Kulaklık',
            is_featured: true,
        },
        {
            url: 'https://example.com/headphones-2.jpg',
            alt: 'Premium Bluetooth Kulaklık - Yan Görünüm',
            is_featured: false,
        },
    ],
    product_variants: [{ price: 1299 }, { price: 1599 }, { price: 1899 }],
};

// Example component using ProductCard
export function ProductGrid() {
    const handleAddToCart = async (productId: string) => {
        console.log('Adding to cart:', productId);
        // API call here
    };

    const handleProductClick = (productId: string, slug: string) => {
        console.log('Navigate to product:', { productId, slug });
        // Router navigation here
    };

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            <ProductCard
                product={mockProduct}
                onAddToCart={handleAddToCart}
                onProductClick={handleProductClick}
            />

            <ProductCard
                product={mockProduct}
                onAddToCart={handleAddToCart}
                onProductClick={handleProductClick}
            />

            <ProductCard
                product={mockProduct}
                onAddToCart={handleAddToCart}
                onProductClick={handleProductClick}
            />

            <ProductCard
                product={mockProduct}
                onAddToCart={handleAddToCart}
                onProductClick={handleProductClick}
            />

            <ProductCard
                product={mockProduct}
                onAddToCart={handleAddToCart}
                onProductClick={handleProductClick}
            />

            <ProductCard
                product={mockProduct}
                onAddToCart={handleAddToCart}
                onProductClick={handleProductClick}
            />
        </div>
    );
}
