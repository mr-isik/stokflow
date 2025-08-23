import { createClient } from '@/shared/lib/supabase/server';

export async function PUT({ params }: { params: Promise<{ id: number }> }) {
    const { id } = await params;
    const supabase = await createClient();

    try {
        const { data: cart } = await supabase
            .from('carts')
            .select('*, cart_items(*):items')
            .eq('id', id)
            .single();

        if (!cart) {
            return Response.json(
                { message: 'Cart not found' },
                { status: 404 }
            );
        }

        return Response.json(cart, { status: 200 });
    } catch (error) {
        console.error('Error fetching cart:', error);
        return Response.json(
            { message: 'Internal Server Error' },
            { status: 500 }
        );
    }
}

export async function DELETE({ params }: { params: Promise<{ id: number }> }) {
    const { id } = await params;
    const supabase = await createClient();

    try {
        const { data: cart } = await supabase
            .from('carts')
            .select('*, cart_items(*):items')
            .eq('id', id)
            .single();

        if (!cart) {
            return Response.json(
                { message: 'Cart not found' },
                { status: 404 }
            );
        }

        const { error } = await supabase.from('carts').delete().eq('id', id);

        if (error) {
            throw error;
        }

        return Response.json(
            { message: 'Cart deleted successfully' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error deleting cart:', error);
        return Response.json(
            { message: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
