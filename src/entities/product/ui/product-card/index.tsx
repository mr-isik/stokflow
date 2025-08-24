'use client';

import { Card, CardBody, CardFooter } from '@heroui/react';
import type { Product } from '../../model';
import ProductImage from './product-image';
import ProductPrice from './product-price';
import ProductActions from './product-actions';

interface ProductCardProps {
    product: Product;
    onProductClick?: (productId: number, slug: string) => void;
    className?: string;
}

export function ProductCard({
    product,
    onProductClick,
    className = '',
}: ProductCardProps) {
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
            data-testid={`product-card-${product.id}`}
        >
            <CardBody
                className="p-0 cursor-pointer"
                onClick={handleProductClick}
                data-testid={`product-click-${product.id}`}
            >
                {/* Image Section */}
                <div className="relative overflow-hidden">
                    <ProductImage image={featuredImage} title={product.title} />
                </div>
            </CardBody>

            <CardFooter className="flex-col items-start gap-2 p-4">
                {/* Product Info */}
                <div
                    className="w-full flex flex-col items-start cursor-pointer"
                    onClick={handleProductClick}
                >
                    <h3 className="font-semibold text-left line-clamp-2 mb-2">
                        {product.title}
                    </h3>

                    <ProductPrice variants={product.product_variants} />
                </div>

                {/* Actions */}
                <ProductActions variantId={product.product_variants[0].id} />
            </CardFooter>
        </Card>
    );
}

// Export types for external use
export type { ProductCardProps };
