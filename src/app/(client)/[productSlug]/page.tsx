// import { useParams } from 'next/navigation';
import { ProductDetail } from '@/entities/product/ui/product-detail';
import MaxWidthWrapper from '@/shared/ui/max-width-wrapper';

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
