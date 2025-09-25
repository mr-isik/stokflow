import { prefetchProductDetails } from '@/entities/product/queries/prefetch';
import { ProductDetail } from '@/entities/product/ui/product-detail';
import MaxWidthWrapper from '@/shared/ui/max-width-wrapper';
import { HydrationBoundary } from '@tanstack/react-query';
import { notFound } from 'next/navigation';

export default async function ProductDetailPage({
    params,
}: {
    params: Promise<{ productSlug: string }>;
}) {
    const { productSlug } = await params;

    if (productSlug.includes('.')) {
        notFound();
    }

    const { dehydratedState } = await prefetchProductDetails(productSlug);

    return (
        <HydrationBoundary state={dehydratedState}>
            <MaxWidthWrapper className="py-8">
                <ProductDetail slug={productSlug} />
            </MaxWidthWrapper>
        </HydrationBoundary>
    );
}
