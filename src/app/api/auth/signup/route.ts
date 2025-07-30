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
            return Response.json({ error: error.message }, { status: 400 });
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
