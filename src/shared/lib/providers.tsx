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
                retry: (failureCount, error: any) => {
                    // 401, 403 gibi auth hatalarında retry yapma
                    if (
                        error?.response?.status === 401 ||
                        error?.response?.status === 403
                    ) {
                        return false;
                    }
                    return failureCount < 2;
                },
                staleTime: 1000 * 60 * 5, // 5 dakika
                gcTime: 1000 * 60 * 10, // 10 dakika cache'de tut
            },
            mutations: {
                retry: 1,
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
