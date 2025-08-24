import { useAppMutation } from '@/shared/hooks';
import { useQueryClient } from '@tanstack/react-query';
import { cartAPI } from '../api';
import { addToast, Button } from '@heroui/react';
import Link from 'next/link';

export const useAddToCart = (variantId: number, quantity: number = 1) => {
    const queryClient = useQueryClient();

    const mutation = useAppMutation(
        async () => {
            await cartAPI.addToCart(variantId, quantity);
        },
        ['cart', variantId],
        {
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['cart'] });
                addToast({
                    title: 'Ürün başarıyla sepete eklendi',
                    color: 'success',
                    endContent: (
                        <Link href="/cart">
                            <Button color="success" className="text-white">
                                Sepete Git
                            </Button>
                        </Link>
                    ),
                });
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

export const useUpdateCartItem = () => {
    const queryClient = useQueryClient();

    const mutation = useAppMutation(
        async ({ itemId, quantity }: { itemId: number; quantity: number }) => {
            await cartAPI.updateCartItem(itemId, quantity);
        },
        ['cart-item'],
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
        }
    );

    return mutation;
};

export const useRemoveCartItem = () => {
    const queryClient = useQueryClient();

    const mutation = useAppMutation(
        async (itemId: number) => {
            await cartAPI.removeCartItem(itemId);
        },
        ['cart-item'],
        {
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['cart'] });
                addToast({
                    title: 'Ürün sepetinizden çıkarıldı',
                    color: 'success',
                });
            },

            onError: error => {
                addToast({
                    title: error.message,
                    color: 'danger',
                });
            },
        }
    );

    return mutation;
};
