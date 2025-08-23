import { useAppMutation } from '@/shared/hooks';
import { useQueryClient } from '@tanstack/react-query';
import { cartAPI } from '../api';
import { addToast } from '@heroui/react';

export const useAddToCart = (variantId: number) => {
    const queryClient = useQueryClient();

    const mutation = useAppMutation(
        async () => {
            await cartAPI.addToCart(variantId);
        },
        ['cart', variantId],
        {
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['cart'] });
            },

            onError: error => {
                addToast({
                    title: error.message,
                    color: 'danger',
                });
            },
            retry: 3,
        }
    );

    return mutation;
};
