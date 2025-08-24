import { createClient } from '@/shared/lib/supabase/server';

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const supabase = await createClient();

    try {
        const {
            data: { user: session },
            error,
        } = await supabase.auth.getUser();

        if (error || !session) {
            return Response.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { quantity } = body;

        if (!quantity || quantity < 1) {
            return Response.json(
                { message: 'Geçersiz miktar' },
                { status: 400 }
            );
        }

        // Check if cart item belongs to current user
        const { data: cartItem } = await supabase
            .from('cart_items')
            .select('*, carts!inner(user_id), product_variants(stock)')
            .eq('id', id)
            .single();

        if (!cartItem) {
            return Response.json(
                { message: 'Ürün bulunamadı' },
                { status: 404 }
            );
        }

        const { data: user } = await supabase
            .from('users')
            .select('id')
            .eq('email', session.email)
            .single();

        if (cartItem.carts.user_id !== user?.id) {
            return Response.json(
                { message: 'Yetkisiz erişim' },
                { status: 403 }
            );
        }

        // Check stock availability
        if (quantity > cartItem.product_variants.stock) {
            return Response.json({ message: 'Stok yetersiz' }, { status: 400 });
        }

        const { error: updateError } = await supabase
            .from('cart_items')
            .update({ quantity })
            .eq('id', id);

        if (updateError) {
            console.error('Error updating cart item:', updateError);
            return Response.json({ message: 'Sunucu hatası' }, { status: 500 });
        }

        return Response.json(
            { message: 'Miktar güncellendi' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error updating cart item:', error);
        return Response.json({ message: 'Sunucu hatası' }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const supabase = await createClient();

    try {
        const {
            data: { user: session },
            error,
        } = await supabase.auth.getUser();

        if (error || !session) {
            return Response.json({ message: 'Unauthorized' }, { status: 401 });
        }

        // Check if cart item belongs to current user
        const { data: cartItem } = await supabase
            .from('cart_items')
            .select('*, carts!inner(user_id)')
            .eq('id', id)
            .single();

        if (!cartItem) {
            return Response.json(
                { message: 'Ürün bulunamadı' },
                { status: 404 }
            );
        }

        const { data: user } = await supabase
            .from('users')
            .select('id')
            .eq('email', session.email)
            .single();

        if (cartItem.carts.user_id !== user?.id) {
            return Response.json(
                { message: 'Yetkisiz erişim' },
                { status: 403 }
            );
        }

        const { error: deleteError } = await supabase
            .from('cart_items')
            .delete()
            .eq('id', id);

        if (deleteError) {
            console.error('Error deleting cart item:', deleteError);
            return Response.json({ message: 'Sunucu hatası' }, { status: 500 });
        }

        return Response.json(
            { message: 'Ürün sepetten çıkarıldı' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error deleting cart item:', error);
        return Response.json({ message: 'Sunucu hatası' }, { status: 500 });
    }
}
