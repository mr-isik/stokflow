import {
    useAppInfiniteQuery,
    useAppQuery,
} from '@/shared/hooks/use-error-handler';
import { productsAPI } from '../api';
import type { PaginatedProductsResponse } from '../model';

export const useInfiniteQueryProducts = ({
    pageSize = 10,
    category,
    query,
    priceRange,
}: {
    pageSize?: number;
    category?: string;
    query?: string;
    priceRange?: [number, number];
}) => {
    return useAppInfiniteQuery({
        queryKey: ['products'],
        queryFn: ({ pageParam = 0 }) =>
            productsAPI.getProducts({
                pageParam,
                pageSize,
                category,
                query,
                priceRange,
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

export const useQuerySearchProducts = (searchTerm: string) => {
    return useAppQuery({
        queryKey: ['searchProducts', searchTerm],
        queryFn: () => productsAPI.getProducts({ query: searchTerm }),
        enabled: !!searchTerm,
        refetchOnWindowFocus: false,
        retry: 1,
        staleTime: 5 * 60 * 1000,
    });
};
