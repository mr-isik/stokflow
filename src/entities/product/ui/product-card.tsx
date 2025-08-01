'use client';

import { Card, CardBody, CardFooter, Image, Button } from '@heroui/react';
import { IoCartOutline } from 'react-icons/io5';
import { useState } from 'react';
import type { ProductsResponse } from '../model';

// Single Responsibility: Her component tek bir görevi var
interface ProductImageProps {
    image: ProductsResponse[0]['product_images'][0];
    title: string;
}

// Open/Closed: Yeni image display türleri eklenebilir
function ProductImage({ image, title }: ProductImageProps) {
    return (
        <Image
            src={image.url}
            alt={image.alt || title}
            className="w-full h-64 object-cover"
            classNames={{
                wrapper: 'w-full h-64',
                img: 'w-full h-64 object-cover',
            }}
            fallbackSrc="/placeholder-product.jpg"
            loading="lazy"
        />
    );
}

// Single Responsibility: Sadece price display
interface ProductPriceProps {
    variants: ProductsResponse[0]['product_variants'];
}

function ProductPrice({ variants }: ProductPriceProps) {
    return (
        <div className="font-semibold text-primary">{variants[0].price} TL</div>
    );
}

// Single Responsibility: Action buttons
interface ProductActionsProps {
    onAddToCart: () => void;
    isLoading?: boolean;
}

function ProductActions({
    onAddToCart,
    isLoading = false,
}: ProductActionsProps) {
    return (
        <div className="flex gap-2 mt-4 w-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Button
                color="primary"
                className="flex-1 text-sm font-medium"
                startContent={<IoCartOutline className="w-4 h-4" />}
                onPress={onAddToCart}
                isLoading={isLoading}
                size="sm"
            >
                Sepete Ekle
            </Button>
        </div>
    );
}

// Interface Segregation: Sadece gerekli props
interface ProductCardProps {
    product: ProductsResponse[0];
    onAddToCart?: (productId: string) => void;
    onProductClick?: (productId: string, slug: string) => void;
    className?: string;
}

// Dependency Inversion: External dependencies injection ile
export function ProductCard({
    product,
    onAddToCart,
    onProductClick,
    className = '',
}: ProductCardProps) {
    const [isLoading, setIsLoading] = useState(false);

    // Single Responsibility: Event handlers
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

    // Featured image selection
    const featuredImage =
        product.product_images.find(img => img.is_featured) ||
        product.product_images[0];

    if (!featuredImage) {
        return null; // Early return for invalid state
    }

    return (
        <Card
            className={`group hover:shadow-lg transition-all duration-300 shadow-none border border-foreground-200 ${className}`}
            isPressable={!!onProductClick}
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
                <div className="w-full flex flex-col gap-1 items-start">
                    <h3
                        className="font-semibold text-left line-clamp-2 mb-4 hover:text-primary transition-colors cursor-pointer"
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
export type {
    ProductCardProps,
    ProductImageProps,
    ProductPriceProps,
    ProductActionsProps,
};
