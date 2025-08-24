import { useState } from 'react';
import { useFormHandler, useFormMutation } from '@/shared/hooks';
import { reviewFormSchema, type ReviewFormData } from '../model';
import { reviewAPI, type CreateReviewParams } from '@/entities/review/api';
import { useQueryClient } from '@tanstack/react-query';

interface UseReviewFormProps {
    productId: number;
    onSuccess?: () => void;
}

export function useReviewForm({ productId, onSuccess }: UseReviewFormProps) {
    const [serverError, setServerError] = useState('');
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
    const queryClient = useQueryClient();

    const form = useFormHandler({
        schema: reviewFormSchema,
        defaultValues: {
            rating: 0,
            comment: '',
        },
        mode: 'onChange',
    });

    // Form mutation with error handling
    const mutation = useFormMutation(
        (data: ReviewFormData) =>
            reviewAPI.createReview({
                productId,
                rating: data.rating,
                comment: data.comment,
            } as CreateReviewParams),
        ['reviews', 'create'],
        {
            onSuccess: _data => {
                // Clear form
                form.resetForm();
                setServerError('');
                setFieldErrors({});

                // Invalidate reviews queries for this product
                queryClient.invalidateQueries({
                    queryKey: ['reviews', productId],
                });

                // Call success callback
                onSuccess?.();
            },
            setServerError,
            setFieldError: (field: string, message: string) => {
                setFieldErrors(prev => ({ ...prev, [field]: message }));
            },
            clearErrors: () => {
                setServerError('');
                setFieldErrors({});
            },
        }
    );

    const handleSubmit = form.handleSubmit(
        (data: ReviewFormData) => {
            // Clear previous errors
            setServerError('');
            setFieldErrors({});

            // Submit form
            mutation.mutate(data);
        },
        formErrors => {
            // Handle form validation errors
            console.warn('Form validation errors:', formErrors);
        }
    );

    const clearErrors = () => {
        setServerError('');
        setFieldErrors({});
        form.clearErrors();
    };

    return {
        // Form state
        form,
        values: form.values,
        errors: { ...form.errors, ...fieldErrors },
        isSubmitting: mutation.isPending,

        // Actions
        handleSubmit,
        clearErrors,

        // Error states
        serverError,
        fieldErrors,

        // Mutation state
        mutation,
        isSuccess: mutation.isSuccess,
        isError: mutation.isError,
    };
}
