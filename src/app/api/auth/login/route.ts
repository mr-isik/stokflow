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

        const { data: fetchedUser, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .maybeSingle();

        if (userError) {
            console.error('Error fetching user:', userError);
            return Response.json({ message: 'Sunucu hatası' }, { status: 500 });
        }

        if (!fetchedUser) {
            const { error: createUserError } = await supabase
                .from('users')
                .insert({
                    email,
                    role: 'user',
                })
                .select('*')
                .single();

            if (createUserError) {
                console.error('Error creating user:', createUserError);
                return Response.json(
                    { message: 'Sunucu hatası' },
                    { status: 500 }
                );
            }
        }

        return Response.json(data, { status: 200 });
    } catch (error: any) {
        return Response.json({ error: error.message }, { status: 500 });
    }
}
