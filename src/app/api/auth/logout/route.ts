import { createClient } from '@/shared/lib/supabase/server';

export const POST = async () => {
    const supabase = await createClient();

    try {
        const { error } = await supabase.auth.signOut();
        if (error) {
            return Response.json(
                { message: 'Çıkış yapılamadı' },
                { status: 500 }
            );
        }
        return Response.json({ message: 'Çıkış yapıldı' }, { status: 200 });
    } catch (error) {
        return Response.json(
            { message: `Sunucu hatası: ${error}` },
            { status: 500 }
        );
    }
};
