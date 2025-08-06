// import { useParams } from 'next/navigation';
import { ProductDetail } from '@/entities/product/ui/product-detail';
import { mockProductDetail } from '@/entities/product/api/mock-data';
import type { ProductVariant } from '@/entities/product/model';
import MaxWidthWrapper from '@/shared/ui/max-width-wrapper';
import { useQueryProductDetail } from '@/entities/product/queries';

export default async function ProductDetailPage({
    params,
}: {
    params: Promise<{ productSlug: string }>;
}) {
    const { productSlug } = await params;

    return (
        <MaxWidthWrapper className="py-8">
            <ProductDetail slug={productSlug} />
        </MaxWidthWrapper>
    );
}
