'use client';

import { Card, CardBody, CardFooter } from '@heroui/react';
import { useState } from 'react';
import type { Product } from '../../model';
import ProductImage from './product-image';
import ProductPrice from './product-price';
import ProductActions from './product-actions';

interface ProductCardProps {
    product: Product;
    onAddToCart?: (productId: number) => void;
    onProductClick?: (productId: number, slug: string) => void;
    className?: string;
}

export function ProductCard({
    product,
    onAddToCart,
    onProductClick,
    className = '',
}: ProductCardProps) {
    const [isLoading, setIsLoading] = useState(false);

    const handleAddToCart = async () => {
        if (!onAddToCart) return;

        setIsLoading(true);
        try {
            await onAddToCart(product.id);
        } finally {
            setIsLoading(false);
        }
    };

    const handleProductClick = () => {
        onProductClick?.(product.id, product.slug);
    };

    const featuredImage =
        product.product_images.find(
            (img: Product['product_images'][0]) => img.is_featured
        ) || product.product_images[0];

    if (!featuredImage) {
        return null; // Early return for invalid state
    }

    return (
        <Card
            className={`group hover:shadow-lg transition-all duration-300 shadow-none border border-foreground-200 ${className}`}
            onPress={handleProductClick}
        >
            <CardBody className="p-0">
                {/* Image Section */}
                <div className="relative overflow-hidden">
                    <ProductImage image={featuredImage} title={product.title} />

                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
            </CardBody>

            <CardFooter className="flex-col items-start gap-2 p-4">
                {/* Product Info */}
                <div className="w-full flex flex-col items-start">
                    <h3
                        className="font-semibold text-left line-clamp-2 mb-2 hover:text-primary transition-colors cursor-pointer"
                        onClick={handleProductClick}
                    >
                        {product.title}
                    </h3>

                    <ProductPrice variants={product.product_variants} />
                </div>

                {/* Actions */}
                {onAddToCart && (
                    <ProductActions
                        onAddToCart={handleAddToCart}
                        isLoading={isLoading}
                    />
                )}
            </CardFooter>
        </Card>
    );
}

// Export types for external use
export type { ProductCardProps };
