import { cartAPI } from '../api';
import { useAppQuery } from '@/shared/hooks';

export const useCart = () => {
    const { data, error, isLoading } = useAppQuery({
        queryKey: ['cart'],
        queryFn: cartAPI.getCart,
    });

    return {
        cart: data,
        isError: !!error,
        isLoading,
    };
};
