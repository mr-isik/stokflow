import { createClient } from '@/shared/lib/supabase/server';
import { NextRequest } from 'next/server';

export async function GET() {
    try {
        const supabase = await createClient();
        const { data: recipes, error } = await supabase
            .from('recipes')
            .select('*');

        if (error) {
            return new Response(
                JSON.stringify({
                    message: 'An error occurred while fetching recipes.',
                }),
                {
                    status: 500,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
        }

        return new Response(JSON.stringify(recipes), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        return new Response(
            JSON.stringify({
                message: 'An error occurred while fetching recipes.',
            }),
            {
                status: 500,
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient();
        const { email, password } = await request.json();

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            return Response.json({ error: error.message }, { status: 400 });
        }

        return Response.json(data, { status: 200 });
    } catch (error: any) {
        return Response.json({ error: error.message }, { status: 500 });
    }
}
