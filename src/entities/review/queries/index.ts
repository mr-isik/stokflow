import { useAppQuery } from '@/shared/hooks/use-error-handler';
import { GetReviewsParams, reviewAPI } from '../api';

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
