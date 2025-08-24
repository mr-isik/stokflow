/**
 * Custom hooks for cart item operations
 * Shared between cart page and cart sheet components
 */

import { useState, useCallback } from 'react';
import { useUpdateCartItem, useRemoveCartItem } from './mutations';

export interface UseCartItemsProps {
    onItemUpdate?: (itemId: number) => void;
    onItemRemove?: (itemId: number) => void;
}

export const useCartItems = ({
    onItemUpdate,
    onItemRemove,
}: UseCartItemsProps = {}) => {
    const { mutate: updateCartItem } = useUpdateCartItem();
    const { mutate: removeCartItem } = useRemoveCartItem();

    const [updatingItems, setUpdatingItems] = useState<Set<number>>(new Set());
    const [removingItems, setRemovingItems] = useState<Set<number>>(new Set());

    const updateQuantity = useCallback(
        (itemId: number, newQuantity: number) => {
            setUpdatingItems(prev => new Set(prev).add(itemId));

            if (newQuantity <= 0) {
                setRemovingItems(prev => new Set(prev).add(itemId));
                removeCartItem(itemId, {
                    onSettled: () => {
                        setRemovingItems(prev => {
                            const newSet = new Set(prev);
                            newSet.delete(itemId);
                            return newSet;
                        });
                        setUpdatingItems(prev => {
                            const newSet = new Set(prev);
                            newSet.delete(itemId);
                            return newSet;
                        });
                        onItemRemove?.(itemId);
                    },
                });
                return;
            }

            updateCartItem(
                { itemId, quantity: newQuantity },
                {
                    onSettled: () => {
                        setUpdatingItems(prev => {
                            const newSet = new Set(prev);
                            newSet.delete(itemId);
                            return newSet;
                        });
                        onItemUpdate?.(itemId);
                    },
                }
            );
        },
        [updateCartItem, removeCartItem, onItemUpdate, onItemRemove]
    );

    const handleRemoveItem = useCallback(
        (itemId: number) => {
            setRemovingItems(prev => new Set(prev).add(itemId));
            removeCartItem(itemId, {
                onSettled: () => {
                    setRemovingItems(prev => {
                        const newSet = new Set(prev);
                        newSet.delete(itemId);
                        return newSet;
                    });
                    onItemRemove?.(itemId);
                },
            });
        },
        [removeCartItem, onItemRemove]
    );

    const isItemLoading = useCallback(
        (itemId: number) => {
            return updatingItems.has(itemId) || removingItems.has(itemId);
        },
        [updatingItems, removingItems]
    );

    const isItemUpdating = useCallback(
        (itemId: number) => {
            return updatingItems.has(itemId);
        },
        [updatingItems]
    );

    const isItemRemoving = useCallback(
        (itemId: number) => {
            return removingItems.has(itemId);
        },
        [removingItems]
    );

    return {
        updateQuantity,
        handleRemoveItem,
        isItemLoading,
        isItemUpdating,
        isItemRemoving,
        updatingItems,
        removingItems,
    };
};
