'use client';

import { useState, useEffect } from 'react';
import { Card, CardBody, Breadcrumbs, BreadcrumbItem } from '@heroui/react';
import { useRouter } from 'next/navigation';
import type { ProductVariant } from '../../model';
import ProductImageGallery from './product-image-gallery';
import ProductInfo from './product-info';
import ProductVariants from './product-variants';
import ProductReviews from './product-reviews';
import ProductDetailSkeleton from './product-detail-skeleton';
import ErrorDisplay from './error-display';
import { useQueryProductDetail } from '../../queries';

interface ProductDetailProps {
    slug: string;
    onAddToCart?: (
        productId: number,
        variantId: number,
        quantity: number
    ) => void;
    onVariantChange?: (variant: ProductVariant) => void;
}

export function ProductDetail({
    slug: _slug,
    onAddToCart,
    onVariantChange,
}: ProductDetailProps) {
    const router = useRouter();
    const {
        data: product,
        isLoading,
        error,
        refetch,
    } = useQueryProductDetail(_slug);

    const [selectedVariant, setSelectedVariant] = useState<ProductVariant>();
    const [quantity, setQuantity] = useState(1);

    // Set initial variant when product is loaded
    useEffect(() => {
        if (product?.product_variants?.[0] && !selectedVariant) {
            setSelectedVariant(product.product_variants[0]);
        }
    }, [product, selectedVariant]);

    // Loading state with skeleton
    if (isLoading) {
        return <ProductDetailSkeleton />;
    }

    // Error state with professional error display
    if (error) {
        const isNetworkError =
            error.message.includes('network') ||
            error.message.includes('fetch');

        return (
            <ErrorDisplay
                type={isNetworkError ? 'network' : 'error'}
                message={error.message}
                onRetry={() => refetch()}
                onGoHome={() => router.push('/')}
            />
        );
    }

    // Not found state
    if (!product) {
        return (
            <ErrorDisplay type="not-found" onGoHome={() => router.push('/')} />
        );
    }

    // Don't render until we have both product and selectedVariant
    if (!selectedVariant) {
        return <ProductDetailSkeleton />;
    }

    const handleVariantChange = (variant: ProductVariant) => {
        setSelectedVariant(variant);
        onVariantChange?.(variant);
    };

    const handleAddToCart = () => {
        if (!onAddToCart || !product || !selectedVariant) return;
        onAddToCart(product.id, selectedVariant.id, quantity);
    };

    return (
        <div className="w-full">
            {/* Breadcrumbs */}
            <div className="mb-6">
                <Breadcrumbs>
                    <BreadcrumbItem href="/">Ana Sayfa</BreadcrumbItem>
                    <BreadcrumbItem>{product?.title}</BreadcrumbItem>
                </Breadcrumbs>
            </div>

            {/* Main Product Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-12">
                {/* Product Images */}
                <div className="w-full">
                    <ProductImageGallery images={product.product_images} />
                </div>

                {/* Product Info & Actions */}
                <div className="w-full space-y-6">
                    <ProductInfo
                        product={product}
                        selectedVariant={selectedVariant}
                        quantity={quantity}
                        onQuantityChange={setQuantity}
                        onAddToCart={handleAddToCart}
                    />

                    <ProductVariants
                        variants={product.product_variants}
                        selectedVariant={selectedVariant}
                        onVariantChange={handleVariantChange}
                    />
                </div>
            </div>

            {/* Additional Sections */}
            <div className="space-y-8">
                {/* Reviews */}
                <Card>
                    <CardBody>
                        <ProductReviews
                            reviews={[]}
                            averageRating={4.2}
                            totalReviews={0}
                        />
                    </CardBody>
                </Card>
            </div>
        </div>
    );
}

export default ProductDetail;
