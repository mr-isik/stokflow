'use client';

import { useState } from 'react';
import { Card, CardBody, Breadcrumbs, BreadcrumbItem } from '@heroui/react';
import type { Product, ProductVariant } from '../../model';
import ProductImageGallery from './product-image-gallery';
import ProductInfo from './product-info';
import ProductVariants from './product-variants';
import ProductFeatures from './product-features';
import ProductReviews from './product-reviews';

interface ProductDetailProps {
    product: Product;
    onAddToCart?: (
        productId: number,
        variantId: number,
        quantity: number
    ) => void;
    onVariantChange?: (variant: ProductVariant) => void;
}

export function ProductDetail({
    product,
    onAddToCart,
    onVariantChange,
}: ProductDetailProps) {
    const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(
        product.product_variants[0]
    );
    const [quantity, setQuantity] = useState(1);

    const handleVariantChange = (variant: ProductVariant) => {
        setSelectedVariant(variant);
        onVariantChange?.(variant);
    };

    const handleAddToCart = () => {
        if (!onAddToCart) return;
        onAddToCart(product.id, selectedVariant.id, quantity);
    };

    return (
        <div className="w-full">
            {/* Breadcrumbs */}
            <div className="mb-6">
                <Breadcrumbs>
                    <BreadcrumbItem href="/">Ana Sayfa</BreadcrumbItem>
                    <BreadcrumbItem
                        href={`/category/${product.category.toLowerCase()}`}
                    >
                        {product.category}
                    </BreadcrumbItem>
                    <BreadcrumbItem
                        href={`/brand/${product.brand.toLowerCase()}`}
                    >
                        {product.brand}
                    </BreadcrumbItem>
                    <BreadcrumbItem>{product.title}</BreadcrumbItem>
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
                {/* Product Features */}
                <Card>
                    <CardBody>
                        <ProductFeatures
                            description={product.description}
                            features={product.features}
                        />
                    </CardBody>
                </Card>

                {/* Reviews */}
                <Card>
                    <CardBody>
                        <ProductReviews
                            reviews={product.reviews}
                            averageRating={product.average_rating}
                            totalReviews={product.total_reviews}
                        />
                    </CardBody>
                </Card>
            </div>
        </div>
    );
}

export default ProductDetail;
