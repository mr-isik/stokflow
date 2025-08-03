'use client';

// import { useParams } from 'next/navigation';
import { ProductDetail } from '@/entities/product/ui/product-detail';
import { mockProductDetail } from '@/entities/product/api/mock-data';
import type { ProductVariant } from '@/entities/product/model';
import MaxWidthWrapper from '@/shared/ui/max-width-wrapper';

export default function ProductDetailPage() {
    // const params = useParams();
    // const productId = params.productId as string;

    // In a real app, you would fetch the product by ID
    // For now, we'll use mock data
    const product = mockProductDetail;

    const handleAddToCart = async (
        id: number,
        variantId: number,
        quantity: number
    ) => {
        try {
            // Here you would integrate with your cart API
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 500));

            // Show success feedback (you can integrate with a toast library later)
            alert(`${quantity} adet ürün sepete eklendi!`);
        } catch {
            alert('Ürün sepete eklenirken bir hata oluştu.');
        }
    };

    const handleVariantChange = (_variant: ProductVariant) => {
        // Handle variant change logic here
        // You could update URL params, trigger analytics, etc.
    };

    return (
        <MaxWidthWrapper className="py-8">
            <ProductDetail
                product={product}
                onAddToCart={handleAddToCart}
                onVariantChange={handleVariantChange}
            />
        </MaxWidthWrapper>
    );
}
