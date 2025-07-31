import { apiClient } from '@/shared/api';
import { ProductsResponse, productsResponseSchema } from '../model';

export const productsAPI = {
    async getProducts(): Promise<ProductsResponse> {
        try {
            const res = await apiClient.get('/products', {
                response: productsResponseSchema,
            });
            return res;
        } catch (error) {
            throw new Error('Ürünler alınamadı. Lütfen tekrar deneyin.');
        }
    },

    /* TODO: Implement other product-related API calls */
};
