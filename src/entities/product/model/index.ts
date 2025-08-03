import { z } from 'zod';

export const productImageSchema = z.object({
    url: z.string().url(),
    alt: z.string(),
    is_featured: z.boolean(),
});

export const productVariantSchema = z.object({
    id: z.number(),
    price: z.number(),
    size: z.string().optional(),
    color: z.string().optional(),
    stock: z.number(),
    sku: z.string(),
});

export const reviewSchema = z.object({
    id: z.number(),
    user_name: z.string(),
    rating: z.number().min(1).max(5),
    comment: z.string(),
    created_at: z.string(),
    helpful_count: z.number(),
});

export const productSchema = z.object({
    id: z.number(),
    title: z.string(),
    slug: z.string(),
    description: z.string(),
    brand: z.string(),
    category: z.string(),
    features: z.array(z.string()),
    product_images: z.array(productImageSchema),
    product_variants: z.array(productVariantSchema),
    reviews: z.array(reviewSchema),
    average_rating: z.number(),
    total_reviews: z.number(),
});

export const productsResponseSchema = z.array(productSchema);

export type Product = z.infer<typeof productSchema>;
export type ProductVariant = z.infer<typeof productVariantSchema>;
export type ProductImage = z.infer<typeof productImageSchema>;
export type Review = z.infer<typeof reviewSchema>;
export type ProductsResponse = z.infer<typeof productsResponseSchema>;

export const paginatedProductsSchema = z.object({
    data: productsResponseSchema,
    pagination: z.object({
        page: z.number(),
        limit: z.number(),
        total: z.number(),
        totalPages: z.number(),
        hasNextPage: z.boolean(),
        hasPreviousPage: z.boolean(),
    }),
});

export type PaginatedProductsResponse = z.infer<typeof paginatedProductsSchema>;
