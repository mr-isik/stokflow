import { apiClient } from '@/shared/api';
import { Categories, categoriesSchema } from '../model';

export const CATEGORY_API_URL = '/categories';

export const categoryAPI = {
    async getCategories(): Promise<Categories> {
        try {
            const response = await apiClient.get(
                CATEGORY_API_URL,
                categoriesSchema
            );
            return response;
        } catch (error) {
            console.error('Error fetching categories:', error);
            throw new Error('Kategoriler alınamadı. Lütfen tekrar deneyin.');
        }
    },
};
