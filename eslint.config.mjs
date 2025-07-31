import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
    baseDirectory: __dirname,
});

const eslintConfig = [
    ...compat.extends('next/core-web-vitals', 'next/typescript'),
    {
        files: ['**/*.js', '**/*.mjs', '**/*.ts', '**/*.tsx'],
        rules: {
            // Allow require() in JS files
            '@typescript-eslint/no-require-imports': 'off',
            '@typescript-eslint/no-var-requires': 'off',
            '@typescript-eslint/no-explicit-any': 'warn',
            '@typescript-eslint/no-unused-vars': [
                'warn',
                { argsIgnorePattern: '^_' },
            ],
            '@typescript-eslint/ban-ts-comment': 'off',
            'prefer-const': 'warn',
            'no-console': ['warn', { allow: ['warn', 'error'] }],
            // React specific
            'react/no-unescaped-entities': 'off',
            'react/display-name': 'off',
        },
    },
];

export default eslintConfig;
