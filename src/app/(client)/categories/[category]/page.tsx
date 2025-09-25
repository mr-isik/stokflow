import MaxWidthWrapper from '@/shared/ui/max-width-wrapper';
import CategoryPageContent from './CategoryPageContent';

interface CategoryPageProps {
    params: Promise<{
        category: string;
    }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
    const { category } = await params;
    return (
        <MaxWidthWrapper>
            <CategoryPageContent category={category} />
        </MaxWidthWrapper>
    );
}
