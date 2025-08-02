import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '../styles/globals.css';
import Header from '@/widgets/header';
import Providers from '@/shared/lib/providers';

const inter = Inter({
    subsets: ['latin'],
    variable: '--font-inter',
});

export const metadata: Metadata = {
    title: 'StokFlow',
    description: 'En iyi toptan satış platformu',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <Providers>
            <html lang="tr" className="light">
                <body className={`${inter.variable} antialiased`}>
                    <Header />
                    {children}
                </body>
            </html>
        </Providers>
    );
}
