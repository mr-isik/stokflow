import { createClient } from '@/shared/lib/supabase/server';

export async function GET() {
    const supabase = await createClient();

    try {
        const { data, error } = await supabase.from('products').select('*');

        if (error) {
            return Response.json({ error: error.message }, { status: 400 });
        }

        return Response.json(data, { status: 200 });
    } catch (error: any) {
        return Response.json({ error: error.message }, { status: 500 });
    }
}
