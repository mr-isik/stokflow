import { apiClient } from '@/shared/api/client';
import {
    PaginatedReviewsResponse,
    paginatedReviewsSchema,
    Review,
} from '../model';

export interface GetReviewsParams {
    productId: number;
    page?: number;
    limit?: number;
}

export interface CreateReviewParams {
    productId: number;
    rating: number;
    comment: string;
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

    async createReview(params: CreateReviewParams): Promise<Review> {
        try {
            const response = await apiClient.post<{ data: Review }>(
                `/reviews/${params.productId}`,
                {
                    rating: params.rating,
                    comment: params.comment,
                }
            );
            return response.data;
        } catch {
            throw new Error('Yorum gönderilemedi. Lütfen tekrar deneyin.');
        }
    },
};
