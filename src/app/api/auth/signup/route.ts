import { createClient } from '@/shared/lib/supabase/server';
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient();
        const { name, email, password } = await request.json();

        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    name: name,
                },
            },
        });

        if (error) {
            console.error('Supabase signup error:', error);

            // Supabase hata kodlarına göre özel mesajlar
            let errorMessage = error.message;

            if (error.message.includes('User already registered')) {
                errorMessage = 'Bu e-posta adresi zaten kayıtlı';
            } else if (error.message.includes('Invalid email')) {
                errorMessage = 'Geçersiz e-posta adresi';
            } else if (error.message.includes('Password should be')) {
                errorMessage = 'Şifre en az 6 karakter olmalı';
            } else if (error.message.includes('Signup is disabled')) {
                errorMessage = 'Kayıt işlemi şu anda kapalı';
            }

            return Response.json(
                {
                    error: errorMessage,
                    code: error.code || 'signup_error',
                },
                { status: 400 }
            );
        }

        const { error: userError } = await supabase
            .from('users')
            .insert({
                email,
                role: 'user',
            })
            .select('*')
            .single();

        if (userError) {
            console.error('Error inserting user:', userError);
            return Response.json({ message: 'Sunucu hatası' }, { status: 500 });
        }

        return Response.json(data, { status: 200 });
    } catch (error: unknown) {
        const errorMessage =
            error instanceof Error
                ? error.message
                : 'An unknown error occurred';
        return Response.json({ error: errorMessage }, { status: 500 });
    }
}
