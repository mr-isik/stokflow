import { apiClient } from '@/shared/api';
import {
    DetailedProduct,
    detailedProductSchema,
    PaginatedProductsResponse,
    paginatedProductsSchema,
} from '../model';

interface GetProductsParams {
    pageParam?: number;
    pageSize?: number;
    category?: string;
    query?: string;
    priceRange?: [number, number];
    sort?: 'price_asc' | 'price_desc' | 'highest_rated' | 'most_reviewed';
}

export const productsAPI = {
    async getProducts({
        pageParam = 0,
        pageSize = 10,
        category = '',
        query = '',
        priceRange,
    }: GetProductsParams): Promise<PaginatedProductsResponse> {
        try {
            const response = await apiClient.get<PaginatedProductsResponse>(
                '/products',
                {
                    page: pageParam,
                    limit: pageSize,
                    category,
                    query,
                    minPrice: priceRange ? priceRange[0] : undefined,
                    maxPrice: priceRange ? priceRange[1] : undefined,
                },
                paginatedProductsSchema
            );
            return response;
        } catch {
            throw new Error('Ürünler alınamadı. Lütfen tekrar deneyin.');
        }
    },

    async getProductDetail(slug: string): Promise<DetailedProduct> {
        try {
            const response = await apiClient.get<DetailedProduct>(
                `/products/${slug}`,
                {},
                detailedProductSchema
            );
            return response;
        } catch {
            throw new Error('Ürün detayları alınamadı. Lütfen tekrar deneyin.');
        }
    },
};
