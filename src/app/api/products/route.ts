import { createClient } from '@/shared/lib/supabase/server';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
    const supabase = await createClient();

    // URL'den pagination parametrelerini al
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '0');
    const limit = parseInt(searchParams.get('limit') || '10');

    const offset = page * limit;

    try {
        const { count } = await supabase
            .from('products')
            .select('id', { count: 'exact', head: true });

        const { data, error } = await supabase
            .from('products')
            .select(
                'id, title, slug, product_images(url, alt, is_featured), product_variants(id, price)'
            )
            .range(offset, offset + limit - 1)
            .order('created_at', { ascending: false });

        if (error) {
            return Response.json({ error: error.message }, { status: 400 });
        }

        const totalPages = Math.ceil((count || 0) / limit);

        const response = {
            data: data || [],
            pagination: {
                page,
                limit,
                total: count || 0,
                totalPages,
                hasNextPage: page < totalPages - 1,
                hasPreviousPage: page > 0,
            },
        };

        return Response.json(response, { status: 200 });
    } catch (error) {
        const errorMessage =
            error instanceof Error ? error.message : 'Unknown error';
        return Response.json({ error: errorMessage }, { status: 500 });
    }
}

export async function POST(request: Request) {
    const supabase = await createClient();
    const body = await request.json();

    try {
        const { data, error } = await supabase
            .from('products')
            .insert([body])
            .select()
            .single();

        if (error) {
            return Response.json({ error: error.message }, { status: 400 });
        }

        return Response.json(data, { status: 201 });
    } catch (error) {
        const errorMessage =
            error instanceof Error ? error.message : 'Unknown error';
        return Response.json({ error: errorMessage }, { status: 500 });
    }
}
