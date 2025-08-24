import { createClient } from '@/shared/lib/supabase/server';

export async function GET() {
    const supabase = await createClient();

    try {
        const {
            data: { user: session },
            error,
        } = await supabase.auth.getUser();
        if (error || !session) {
            return Response.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const { data: user } = await supabase
            .from('users')
            .select('id')
            .eq('email', session.email)
            .single();

        const { data: cart } = await supabase
            .from('carts')
            .select(
                'id, items:cart_items(id, quantity, unit_price, variants:product_variants(id, sku, price, product:products(id, title, slug, product_images(url, alt, is_featured)), variant_options:product_variant_options(name, value)))'
            )
            .eq('user_id', user?.id)
            .single();

        if (!cart) {
            return Response.json(
                { message: 'Cart not found' },
                { status: 404 }
            );
        }

        return Response.json(cart, { status: 200 });
    } catch (error) {
        console.error('Error fetching session:', error);
        return Response.json(
            { message: 'Internal Server Error' },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    const supabase = await createClient();

    try {
        const {
            data: { user: session },
            error,
        } = await supabase.auth.getUser();

        if (error || !session) {
            return Response.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const { data: user } = await supabase
            .from('users')
            .select('*')
            .eq('email', session.email)
            .single();

        const body = await request.json();
        const { variant_id, quantity } = body;

        const { data: variant, error: vErr } = await supabase
            .from('product_variants')
            .select('*')
            .eq('id', variant_id)
            .single();

        if (vErr || !variant) {
            console.error('Error fetching variant:', vErr);
            return Response.json({ message: 'Sunucu hatası' }, { status: 500 });
        }

        if (variant.stock < quantity) {
            return Response.json({ message: 'Stok yetersiz' }, { status: 400 });
        }

        const { data: existingCart } = await supabase
            .from('carts')
            .select('*, cart_items(*)')
            .eq('user_id', user.id)
            .maybeSingle();

        let cart = existingCart;

        if (!cart) {
            const { data: newCart } = await supabase
                .from('carts')
                .insert({ user_id: user.id })
                .select('*, cart_items(*)')
                .single();

            cart = newCart;
        }

        const { data: existingItem } = await supabase
            .from('cart_items')
            .select('*')
            .eq('cart_id', cart.id)
            .eq('variant_id', variant.id)
            .maybeSingle();

        if (existingItem) {
            const newQuantity = Math.min(
                existingItem.quantity + quantity,
                variant.stock
            );

            const { error: updateError } = await supabase
                .from('cart_items')
                .update({ quantity: newQuantity })
                .eq('id', existingItem.id);

            if (updateError) {
                console.error('Error updating cart item:', updateError);
                return Response.json(
                    { message: 'Sunucu hatası' },
                    { status: 500 }
                );
            }
        } else {
            const { error: insertError } = await supabase
                .from('cart_items')
                .insert({
                    cart_id: cart.id,
                    variant_id: variant.id,
                    quantity,
                    unit_price: variant.price,
                });

            if (insertError) {
                console.error('Error inserting cart item:', insertError);
                return Response.json(
                    { message: 'Sunucu hatası' },
                    { status: 500 }
                );
            }
        }

        const { data: newCart } = await supabase
            .from('carts')
            .select(
                '*, items:cart_items(id, quantity, unit_price, variants:product_variants(id, sku, price, product:products(id, title, slug, product_images(url, alt, is_featured)), variant_options:product_variant_options(name, value)))'
            )
            .eq('id', cart.id)
            .single();

        return Response.json(newCart, { status: 201 });
    } catch (error) {
        console.error('Error fetching session:', error);
        return Response.json({ message: 'Sunucu hatası' }, { status: 500 });
    }
}
