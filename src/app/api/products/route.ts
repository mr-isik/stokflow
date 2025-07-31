import { createClient } from '@/shared/lib/supabase/server';

export async function GET() {
    const supabase = await createClient();

    try {
        const { data, error } = await supabase
            .from('products')
            .select(
                'id, title, slug, product_images(url, alt, is_featured), product_variants(price)'
            );

        if (error) {
            return Response.json({ error: error.message }, { status: 400 });
        }

        return Response.json(data, { status: 200 });
    } catch (error: any) {
        return Response.json({ error: error.message }, { status: 500 });
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
    } catch (error: any) {
        return Response.json({ error: error.message }, { status: 500 });
    }
}
