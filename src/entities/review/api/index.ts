import { apiClient } from '@/shared/api/client';
import { PaginatedReviewsResponse, paginatedReviewsSchema } from '../model';

export interface GetReviewsParams {
    productId: number;
    page?: number;
    limit?: number;
}

export const reviewAPI = {
    async getReviews(
        params: GetReviewsParams
    ): Promise<PaginatedReviewsResponse> {
        try {
            const response = await apiClient.get<PaginatedReviewsResponse>(
                `/reviews/${params.productId}`,
                {
                    page: params.page || 0,
                    limit: params.limit || 10,
                },
                paginatedReviewsSchema
            );
            return response;
        } catch {
            throw new Error('Yorumlar alınamadı. Lütfen tekrar deneyin.');
        }
    },

    /* TODO: add review */
};
