import { z } from 'zod';

export const productImageSchema = z.object({
    url: z.url(),
    alt: z.string().min(2).max(100),
    is_featured: z.boolean(),
});

export const productVariantOptionSchema = z.object({
    id: z.number(),
    name: z.string(),
    value: z.string(),
});

export const productVariantSchema = z.object({
    id: z.number(),
    price: z.number().gt(0),
    stock: z.number().min(0),
    sku: z.string(),
    compare_at_price: z.number().optional(),
    product_variant_options: z.array(productVariantOptionSchema),
});

export const productSchema = z.object({
    id: z.number(),
    title: z.string(),
    slug: z.string(),
    product_images: z.array(productImageSchema),
    product_variants: z
        .array(
            z.object({
                id: z.number(),
                price: z.number().gt(0),
            })
        )
        .nonempty(),
});

export const detailedProductSchema = productSchema.extend({
    description: z.string(),
    product_variants: z.array(productVariantSchema),
});

export const productsResponseSchema = z.array(productSchema);

export type Product = z.infer<typeof productSchema>;
export type DetailedProduct = z.infer<typeof detailedProductSchema>;
export type ProductVariant = z.infer<typeof productVariantSchema>;
export type ProductImage = z.infer<typeof productImageSchema>;
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
