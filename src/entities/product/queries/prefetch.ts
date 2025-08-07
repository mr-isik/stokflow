import { dehydrate, QueryClient } from '@tanstack/react-query';
import { productsAPI } from '../api';

export const prefetchInfiniteProducts = async () => {
    const queryClient = new QueryClient();

    await queryClient.prefetchInfiniteQuery({
        queryKey: ['products'],
        queryFn: ({ pageParam = 0 }) =>
            productsAPI.getProducts({
                pageParam,
                pageSize: 10,
            }),
        initialPageParam: 0,
    });

    return {
        dehydratedState: dehydrate(queryClient),
    };
};

export const prefetchProductDetails = async (slug: string) => {
    const queryClient = new QueryClient();

    await queryClient.prefetchQuery({
        queryKey: ['product', slug],
        queryFn: () => productsAPI.getProductDetail(slug),
    });

    return {
        dehydratedState: dehydrate(queryClient),
    };
};
