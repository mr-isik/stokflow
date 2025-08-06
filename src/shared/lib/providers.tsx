'use client';

import { HeroUIProvider } from '@heroui/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import React from 'react';

type Props = {
    children: React.ReactNode;
};

const Providers = ({ children }: Props) => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                refetchOnWindowFocus: false,
                retry: 2,
                staleTime: 1000 * 60 * 5,
            },
        },
    });

    return (
        <HeroUIProvider>
            <QueryClientProvider client={queryClient}>
                {children}
                <ReactQueryDevtools initialIsOpen={false} />
            </QueryClientProvider>
        </HeroUIProvider>
    );
};

export default Providers;
