import z from 'zod';

export const cartItemVariantSchema = z.object({
    id: z.number(),
    sku: z.string(),
    price: z.number().min(0).default(0),
    product: z.object({
        id: z.number(),
        title: z.string(),
        slug: z.string(),
    }),
    variant_options: z.array(
        z.object({
            name: z.string(),
            value: z.string(),
        })
    ),
});

export const cartItemSchema = z.object({
    id: z.number(),
    quantity: z.number().min(1).default(1),
    unit_price: z.number().min(0).default(0),
    variants: cartItemVariantSchema,
});

export const cartResponseSchema = z.object({
    id: z.number(),
    items: z.array(cartItemSchema),
});

export type CartItem = z.infer<typeof cartItemSchema>;
export type CartResponse = z.infer<typeof cartResponseSchema>;
