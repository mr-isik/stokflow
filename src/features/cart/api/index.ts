import { apiClient } from '@/shared/api';
import { cartResponseSchema } from '../model';

export const cartAPI = {
    async getCart() {
        return await apiClient.get('/carts', {}, cartResponseSchema);
    },

    async addToCart(variant_id: number, quantity = 1) {
        return await apiClient.post(`/carts`, { variant_id, quantity });
    },

    async updateCartItem(itemId: number, quantity: number) {
        return await apiClient.put(`/cart-items/${itemId}`, { quantity });
    },

    async removeCartItem(itemId: number) {
        return await apiClient.delete(`/cart-items/${itemId}`);
    },
};
