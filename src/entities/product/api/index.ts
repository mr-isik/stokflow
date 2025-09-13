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
}

export const productsAPI = {
    async getProducts({
        pageParam = 0,
        pageSize = 10,
        category = '',
    }: GetProductsParams): Promise<PaginatedProductsResponse> {
        try {
            const response = await apiClient.get<PaginatedProductsResponse>(
                '/products',
                {
                    page: pageParam,
                    limit: pageSize,
                    category,
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
