import { createClient } from '@/shared/lib/supabase/server';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
    const supabase = await createClient();

    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '0');
    const limit = parseInt(searchParams.get('limit') || '10');
    const category = searchParams.get('category') || '';
    const query = searchParams.get('query') || '';
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');

    const offset = page * limit;

    try {
        if (category) {
            const needsPriceFilter = minPrice || maxPrice;

            let countQuery = supabase
                .from('products')
                .select(
                    needsPriceFilter
                        ? 'id, product_categories!inner(categories!inner(slug)), product_variants!inner(id, price)'
                        : 'id, product_categories!inner(categories!inner(slug))',
                    { count: 'exact', head: true }
                )
                .eq('product_categories.categories.slug', category);

            let dataQuery = supabase
                .from('products')
                .select(
                    needsPriceFilter
                        ? 'id, title, slug, product_images(url, alt, is_featured), product_variants!inner(id, price), product_categories!inner(categories!inner(slug))'
                        : 'id, title, slug, product_images(url, alt, is_featured), product_variants(id, price), product_categories!inner(categories!inner(slug))'
                )
                .eq('product_categories.categories.slug', category);

            if (query) {
                countQuery = countQuery.ilike('title', `%${query}%`);
                dataQuery = dataQuery.ilike('title', `%${query}%`);
            }

            if (minPrice) {
                const minPriceNum = parseFloat(minPrice);
                countQuery = countQuery.gte(
                    'product_variants.price',
                    minPriceNum
                );
                dataQuery = dataQuery.gte(
                    'product_variants.price',
                    minPriceNum
                );
            }
            if (maxPrice) {
                const maxPriceNum = parseFloat(maxPrice);
                countQuery = countQuery.lte(
                    'product_variants.price',
                    maxPriceNum
                );
                dataQuery = dataQuery.lte(
                    'product_variants.price',
                    maxPriceNum
                );
            }

            const { count } = await countQuery;
            const { data, error } = await dataQuery.range(
                offset,
                offset + limit - 1
            );

            if (error) {
                return Response.json({ error: error.message }, { status: 400 });
            }

            const totalPages = Math.ceil((count || 0) / limit);

            const response = {
                data: data || [],
                pagination: {
                    page,
                    limit,
                    total: count || 0,
                    totalPages,
                    hasNextPage: page < totalPages - 1,
                    hasPreviousPage: page > 0,
                },
            };

            return Response.json(response, { status: 200 });
        }

        // Default query without category filter
        const needsPriceFilter = minPrice || maxPrice;

        let countQuery = supabase
            .from('products')
            .select(
                needsPriceFilter
                    ? 'id, product_variants!inner(id, price)'
                    : 'id',
                { count: 'exact', head: true }
            );

        let dataQuery = supabase
            .from('products')
            .select(
                needsPriceFilter
                    ? 'id, title, slug, product_images(url, alt, is_featured), product_variants!inner(id, price)'
                    : 'id, title, slug, product_images(url, alt, is_featured), product_variants(id, price)'
            );

        if (query) {
            countQuery = countQuery.ilike('title', `%${query}%`);
            dataQuery = dataQuery.ilike('title', `%${query}%`);
        }

        if (minPrice) {
            const minPriceNum = parseFloat(minPrice);
            countQuery = countQuery.gte('product_variants.price', minPriceNum);
            dataQuery = dataQuery.gte('product_variants.price', minPriceNum);
        }
        if (maxPrice) {
            const maxPriceNum = parseFloat(maxPrice);
            countQuery = countQuery.lte('product_variants.price', maxPriceNum);
            dataQuery = dataQuery.lte('product_variants.price', maxPriceNum);
        }

        const { count } = await countQuery;
        const { data, error } = await dataQuery.range(
            offset,
            offset + limit - 1
        );

        if (error) {
            return Response.json({ error: error.message }, { status: 400 });
        }

        const totalPages = Math.ceil((count || 0) / limit);

        const response = {
            data: data || [],
            pagination: {
                page,
                limit,
                total: count || 0,
                totalPages,
                hasNextPage: page < totalPages - 1,
                hasPreviousPage: page > 0,
            },
        };

        return Response.json(response, { status: 200 });
    } catch (error) {
        const errorMessage =
            error instanceof Error ? error.message : 'Unknown error';
        return Response.json({ error: errorMessage }, { status: 500 });
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
    } catch (error) {
        const errorMessage =
            error instanceof Error ? error.message : 'Unknown error';
        return Response.json({ error: errorMessage }, { status: 500 });
    }
}
