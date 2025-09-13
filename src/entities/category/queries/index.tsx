import { useAppQuery } from '@/shared/hooks';
import { categoryAPI } from '../api';

export const useQueryCategories = () => {
    return useAppQuery({
        queryKey: ['categories'],
        queryFn: () => categoryAPI.getCategories(),
        refetchOnWindowFocus: false,
        retry: 1,
        staleTime: 1000 * 60 * 5,
    });
};
