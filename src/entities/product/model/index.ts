import { z } from 'zod';

export const productSchema = z.object({
    id: z.string(),
    title: z.string(),
    slug: z.string(),
    product_images: z.array(
        z.object({
            url: z.url(),
            alt: z.string(),
            is_featured: z.boolean(),
        })
    ),
    product_variants: z.array(
        z.object({
            price: z.number(),
        })
    ),
});

export const productsResponseSchema = z.array(productSchema);

export type Product = z.infer<typeof productSchema>;
export type ProductsResponse = z.infer<typeof productsResponseSchema>;

// Paginated response schema
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
