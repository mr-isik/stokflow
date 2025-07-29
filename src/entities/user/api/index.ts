import { apiClient } from '@/shared/api/client';
import {
    UserCreate,
    UserCreateSchema,
    UserResponseSchema,
    UsersResponseSchema,
    UserUpdate,
    UserUpdateSchema,
} from '../model';

export const UserAPI = {
    async getAll() {
        const res = await apiClient.get('/users', {
            request: undefined,
            response: UsersResponseSchema,
        });
        return res;
    },

    async getById(id: string) {
        const res = await apiClient.get(`/users/${id}`, {
            request: undefined,
            response: UserResponseSchema,
        });
        return res;
    },

    async create(user: UserCreate) {
        const res = await apiClient.post('/users', user, {
            request: UserCreateSchema,
            response: UserResponseSchema,
        });
        return res;
    },

    async update(id: string, user: UserUpdate) {
        const res = await apiClient.put(`/users/${id}`, user, {
            request: UserUpdateSchema,
            response: UserResponseSchema,
        });
        return res;
    },

    async delete(id: string) {
        const res = await apiClient.delete(`/users/${id}`);
        return res;
    },
};
