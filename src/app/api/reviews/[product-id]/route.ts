import { createClient } from '@/shared/lib/supabase/server';
import { NextRequest } from 'next/server';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ 'product-id': string }> }
) {
    const { 'product-id': id } = await params;
    const supabase = await createClient();

    // URL'den pagination parametrelerini al
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '0');
    const limit = parseInt(searchParams.get('limit') || '10');

    const offset = page * limit;

    try {
        // Toplam review sayısını al
        const { count } = await supabase
            .from('product_reviews')
            .select('id', { count: 'exact', head: true })
            .eq('product_id', id);

        const { data, error } = await supabase
            .from('product_reviews')
            .select('id, rating, comment, created_at, user_id, product_id')
            .eq('product_id', id)
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
