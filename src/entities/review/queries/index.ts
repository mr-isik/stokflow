import { useQueryClient } from '@tanstack/react-query';
import { useAppQuery, useAppMutation } from '@/shared/hooks/use-error-handler';
import { GetReviewsParams, CreateReviewParams, reviewAPI } from '../api';

export const useReviews = ({
    productId,
    page = 0,
    limit = 10,
}: GetReviewsParams) => {
    return useAppQuery({
        queryKey: ['reviews', productId, page, limit],
        queryFn: () => reviewAPI.getReviews({ productId, page, limit }),
        enabled: !!productId,
        refetchOnWindowFocus: false,
        retry: 1,
    });
};

export const useCreateReview = () => {
    const queryClient = useQueryClient();

    return useAppMutation(
        (params: CreateReviewParams) => reviewAPI.createReview(params),
        ['reviews', 'create'],
        {
            onSuccess: (data, variables) => {
                // Invalidate reviews queries for this product
                queryClient.invalidateQueries({
                    queryKey: ['reviews', variables.productId],
                });
            },
            onError: error => {
                console.error('Yorum gönderilirken hata:', error);
            },
        }
    );
};
