import z from 'zod';

export const productsResponseSchema = z.array(
    z.object({
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
    })
);

export type ProductsResponse = z.infer<typeof productsResponseSchema>;
