import { z } from 'zod';

export const userSchema = z.object({
    name: z.string(),
    email: z.string(),
});

export const reviewSchema = z.object({
    id: z.number(),
    rating: z.number().min(1).max(5),
    comment: z.string(),
    created_at: z.string(),
    user_id: z.number(),
    product_id: z.number(),
});

export const reviewsSchema = z.array(reviewSchema);

export const paginatedReviewsSchema = z.object({
    data: reviewsSchema,
    pagination: z.object({
        page: z.number(),
        limit: z.number(),
        total: z.number(),
        totalPages: z.number(),
        hasNextPage: z.boolean(),
        hasPreviousPage: z.boolean(),
    }),
});

export type User = z.infer<typeof userSchema>;
export type Review = z.infer<typeof reviewSchema>;
export type PaginatedReviewsResponse = z.infer<typeof paginatedReviewsSchema>;
