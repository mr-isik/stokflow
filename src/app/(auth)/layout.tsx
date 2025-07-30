import React from 'react';
import Link from 'next/link';

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,#fff,rgba(255,255,255,0.6))] -z-10" />

            {/* Header */}
            <div className="relative z-10">
                {/* Main Content */}
                <main className="flex items-center justify-center px-6 py-12 min-h-[calc(100vh-200px)]">
                    <div className="w-full max-w-md">{children}</div>
                </main>

                {/* Footer */}
                <footer className="px-6 py-8 mt-auto">
                    <div className="max-w-7xl mx-auto text-center">
                        <p className="text-sm text-gray-500">
                            © 2025 E-Commerce. Tüm hakları saklıdır.
                        </p>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default AuthLayout;
