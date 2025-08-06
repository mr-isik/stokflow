import { createClient } from '@/shared/lib/supabase/server';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    const { slug } = await params;

    const supabase = await createClient();

    try {
        const { data, error } = await supabase
            .from('products')
            .select(
                'id, title, slug, description, product_variants(id, price, stock, sku, compare_at_price, product_variant_options(id, name, value)), product_images(url, alt, is_featured))'
            )
            .eq('slug', slug)
            .single();

        if (error) {
            return Response.json({ error: error.message }, { status: 400 });
        }

        if (!data) {
            return Response.json(
                { message: 'Ürün bulunamadı' },
                { status: 404 }
            );
        }

        return Response.json(data, { status: 200 });
    } catch (error: any) {
        return Response.json({ error: error.message }, { status: 500 });
    }
}

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const supabase = await createClient();
    const body = await request.json();

    try {
        const { data, error } = await supabase
            .from('products')
            .update(body)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            return Response.json({ error: error.message }, { status: 400 });
        }

        if (!data) {
            return Response.json(
                { message: 'Ürün bulunamadı' },
                { status: 404 }
            );
        }

        return Response.json(data, { status: 200 });
    } catch (error: any) {
        return Response.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const supabase = await createClient();

    try {
        const { data, error } = await supabase
            .from('products')
            .delete()
            .eq('id', id)
            .select()
            .single();

        if (error) {
            return Response.json({ error: error.message }, { status: 400 });
        }

        if (!data) {
            return Response.json(
                { message: 'Ürün bulunamadı' },
                { status: 404 }
            );
        }

        return Response.json(
            { message: 'Ürün başarıyla silindi' },
            { status: 200 }
        );
    } catch (error: any) {
        return Response.json({ error: error.message }, { status: 500 });
    }
}
