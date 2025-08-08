import { InfiniteData } from '@tanstack/react-query';
import {
    useAppQuery,
    useAppInfiniteQuery,
} from '@/shared/hooks/use-error-handler';
import { productsAPI } from '../api';
import type { PaginatedProductsResponse } from '../model';

export const useInfiniteQueryProducts = () => {
    return useAppInfiniteQuery({
        queryKey: ['products'],
        queryFn: ({ pageParam = 0 }) =>
            productsAPI.getProducts({
                pageParam,
                pageSize: 10,
            }),
        initialPageParam: 0,
        getNextPageParam: (lastPage: PaginatedProductsResponse) => {
            const { pagination } = lastPage;
            return pagination.hasNextPage ? pagination.page + 1 : undefined;
        },
        getPreviousPageParam: (firstPage: PaginatedProductsResponse) => {
            const { pagination } = firstPage;
            return pagination.hasPreviousPage ? pagination.page - 1 : undefined;
        },
    });
};

export const useQueryProductDetail = (slug: string) => {
    return useAppQuery({
        queryKey: ['productDetail', slug],
        queryFn: () => productsAPI.getProductDetail(slug),
        enabled: !!slug,
        refetchOnWindowFocus: false,
        retry: 1,
    });
};
