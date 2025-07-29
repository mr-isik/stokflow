import z from 'zod';

export const UserResponseSchema = z.object({
    id: z.string(),
    name: z.string().min(1, 'Username is required'),
    email: z.string().email('Invalid email format'),
    created_at: z.string().optional(),
});

export const UsersResponseSchema = z.array(UserResponseSchema);

export const UserUpdateSchema = z.object({
    name: z.string().min(1, 'Username is required').optional(),
    email: z.string().email('Invalid email format').optional(),
});

export const UserCreateSchema = z.object({
    name: z.string().min(1, 'Username is required'),
    email: z.string().email('Invalid email format'),
    role: z.enum(['USER', 'ADMIN']),
});

export type User = z.infer<typeof UserResponseSchema>;
export type UserUpdate = z.infer<typeof UserUpdateSchema>;
export type UserCreate = z.infer<typeof UserCreateSchema>;
