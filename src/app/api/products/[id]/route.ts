import { createClient } from '@/shared/lib/supabase/server';

export async function GET({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const supabase = await createClient();

    try {
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            return Response.json({ error: error.message }, { status: 400 });
        }

        if (!data) {
            return Response.json(
                { message: 'Product not found.' },
                { status: 404 }
            );
        }

        return Response.json(data, { status: 200 });
    } catch (error: any) {
        return Response.json({ error: error.message }, { status: 500 });
    }
}
