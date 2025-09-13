import { createClient } from '@/shared/lib/supabase/server';

export async function GET() {
    const supabase = await createClient();

    try {
        const { data, error } = await supabase
            .from('categories')
            .select('id, name, slug');
        if (error) {
            return Response.json({ error: error.message }, { status: 400 });
        }

        return Response.json(data, { status: 200 });
    } catch (error) {
        const errorMessage =
            error instanceof Error ? error.message : 'Unknown error';
        return Response.json({ error: errorMessage }, { status: 500 });
    }
}
