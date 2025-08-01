import { apiClient } from '@/shared/api';
import { PaginatedProductsResponse, paginatedProductsSchema } from '../model';

interface GetProductsParams {
    pageParam?: number;
    pageSize?: number;
}

export const productsAPI = {
    async getProducts({
        pageParam = 0,
        pageSize = 10,
    }: GetProductsParams): Promise<PaginatedProductsResponse> {
        try {
            const response = await apiClient.get<PaginatedProductsResponse>(
                '/products',
                {
                    page: pageParam,
                    limit: pageSize,
                },
                paginatedProductsSchema
            );
            return response;
        } catch (error) {
            throw new Error('Ürünler alınamadı. Lütfen tekrar deneyin.');
        }
    },

    /* TODO: Implement other product-related API calls */
};
