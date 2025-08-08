import { createClient } from '@/shared/lib/supabase/server';
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient();
        const { email, password } = await request.json();

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            console.error('Supabase login error:', error);

            // Supabase hata kodlarına göre özel mesajlar
            let errorMessage = error.message;

            if (error.message.includes('Invalid login credentials')) {
                errorMessage = 'E-posta veya şifre hatalı';
            } else if (error.message.includes('Email not confirmed')) {
                errorMessage = 'E-posta adresinizi doğrulamanız gerekiyor';
            } else if (error.message.includes('Too many requests')) {
                errorMessage =
                    'Çok fazla deneme yaptınız. Lütfen daha sonra tekrar deneyin';
            } else if (error.message.includes('User not found')) {
                errorMessage =
                    'Bu e-posta adresiyle kayıtlı kullanıcı bulunamadı';
            }

            return Response.json(
                {
                    error: errorMessage,
                    code: error.code || 'login_error',
                },
                { status: 400 }
            );
        }

        return Response.json(data, { status: 200 });
    } catch (error: any) {
        return Response.json({ error: error.message }, { status: 500 });
    }
}
