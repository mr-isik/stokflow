// tailwind.config.js
import { heroui } from '@heroui/react';

/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './src/**/*.{js,ts,jsx,tsx,mdx}',
        './node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
        extend: {
            screens: {
                xs: '475px',
            },
        },
    },
    darkMode: 'class',
    plugins: [
        heroui({
            prefix: 'heroui',
            addCommonColors: false,
            defaultTheme: 'light',
            defaultExtendTheme: 'light',
            layout: {},
        }),
    ],
};
