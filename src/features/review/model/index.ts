import z from 'zod';

// Review form validation schema
export const reviewFormSchema = z.object({
    rating: z
        .number()
        .min(1, 'Lütfen bir puan verin')
        .max(5, 'Maksimum 5 puan verilebilir'),
    comment: z
        .string()
        .min(10, 'Yorum en az 10 karakter olmalıdır')
        .max(500, 'Yorum maksimum 500 karakter olabilir')
        .trim(),
});

export type ReviewFormData = z.infer<typeof reviewFormSchema>;
