import {
    useInfiniteQuery,
    InfiniteData,
    useQuery,
} from '@tanstack/react-query';
import { productsAPI } from '../api';
import type { PaginatedProductsResponse } from '../model';

export const useInfiniteQueryProducts = () => {
    return useInfiniteQuery<
        PaginatedProductsResponse,
        Error,
        InfiniteData<PaginatedProductsResponse>,
        string[],
        number
    >({
        queryKey: ['products'],
        queryFn: ({ pageParam = 0 }) =>
            productsAPI.getProducts({
                pageParam,
                pageSize: 10,
            }),
        initialPageParam: 0,
        getNextPageParam: lastPage => {
            const { pagination } = lastPage;
            return pagination.hasNextPage ? pagination.page + 1 : undefined;
        },
        getPreviousPageParam: firstPage => {
            const { pagination } = firstPage;
            return pagination.hasPreviousPage ? pagination.page - 1 : undefined;
        },
    });
};

export const useQueryProductDetail = (slug: string) => {
    return useQuery({
        queryKey: ['productDetail', slug],
        queryFn: () => productsAPI.getProductDetail(slug),
        enabled: !!slug,
        refetchOnWindowFocus: false,
        retry: 1,
    });
};
