import { prefetchInfiniteProducts } from '@/entities/product/queries/prefetch';
import { ProductList } from '@/entities/product/ui/product-list';
import MaxWidthWrapper from '@/shared/ui/max-width-wrapper';
import { HydrationBoundary } from '@tanstack/react-query';

const HomePage = async () => {
    const { dehydratedState } = await prefetchInfiniteProducts();

    return (
        <HydrationBoundary state={dehydratedState}>
            <MaxWidthWrapper className="py-8">
                <ProductList />
            </MaxWidthWrapper>
        </HydrationBoundary>
    );
};

export default HomePage;
