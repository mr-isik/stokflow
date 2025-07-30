import { Card, CardBody, CardHeader } from '@heroui/react';

interface AuthCardProps {
    title: string;
    subtitle?: string;
    children: React.ReactNode;
    footer?: React.ReactNode;
}

export const AuthCard = ({
    title,
    subtitle,
    children,
    footer,
}: AuthCardProps) => {
    return (
        <Card className="w-full max-w-lg shadow-none border border-default-200 bg-white/80 backdrop-blur-sm">
            <CardHeader className="flex flex-col gap-3 pb-6 pt-8 px-8">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900">
                        {title}
                    </h1>
                    {subtitle && (
                        <p className="text-sm text-gray-600 mt-1">{subtitle}</p>
                    )}
                </div>
            </CardHeader>

            <CardBody className="px-8 pb-8">
                {children}
                {footer && <div className="mt-6 text-center">{footer}</div>}
            </CardBody>
        </Card>
    );
};
