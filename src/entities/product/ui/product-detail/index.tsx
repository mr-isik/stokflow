'use client';

import { useAddToCart } from '@/features/cart/hooks/mutations';
import { BreadcrumbItem, Breadcrumbs, Card, CardBody } from '@heroui/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { ProductVariant } from '../../model';
import { useQueryProductDetail } from '../../queries';
import ErrorDisplay from './error-display';
import ProductDetailSkeleton from './product-detail-skeleton';
import ProductImageGallery from './product-image-gallery';
import ProductInfo from './product-info';
import ProductReviews from './product-reviews';
import ProductVariants from './product-variants';

interface ProductDetailProps {
    slug: string;
    onVariantChange?: (variant: ProductVariant) => void;
}

export function ProductDetail({
    slug: _slug,
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

    const { mutate: addToCart, isPending: isAddingToCart } = useAddToCart(
        selectedVariant?.id || 0,
        quantity
    );

    useEffect(() => {
        if (product?.product_variants?.[0] && !selectedVariant) {
            setSelectedVariant(product.product_variants[0]);
        }
    }, [product, selectedVariant]);

    if (isLoading) {
        return <ProductDetailSkeleton />;
    }

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

    if (!product) {
        return (
            <ErrorDisplay type="not-found" onGoHome={() => router.push('/')} />
        );
    }

    if (!selectedVariant) {
        return <ProductDetailSkeleton />;
    }

    const handleVariantChange = (variant: ProductVariant) => {
        setSelectedVariant(variant);
        onVariantChange?.(variant);
    };

    const handleAddToCart = () => {
        if (!product || !selectedVariant) return;
        addToCart();
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
                        isAddingToCart={isAddingToCart}
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
                <Card className="shadow-none border border-gray-200">
                    <CardBody>
                        <ProductReviews productId={product.id} />
                    </CardBody>
                </Card>
            </div>
        </div>
    );
}

export default ProductDetail;
