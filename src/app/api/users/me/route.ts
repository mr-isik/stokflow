import { createClient } from '@/shared/lib/supabase/server';

export async function GET() {
    const supabase = await createClient();

    try {
        const {
            data: { session },
            error,
        } = await supabase.auth.getSession();
        if (error || !session) {
            return Response.json({ message: 'Unauthorized' }, { status: 401 });
        }
        return Response.json(session, { status: 200 });
    } catch (error) {
        return Response.json(
            { message: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
