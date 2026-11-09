import prettier from 'eslint-config-prettier';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import { defineConfig, globalIgnores } from 'eslint/config';
import globals from 'globals';
import typescriptEslint from 'typescript-eslint';

import js from '@eslint/js';

export default defineConfig([
    globalIgnores([
        'node_modules',
        'dist',
        'build',
        'coverage',
        '.next',
        'next.config.js',
        'next-env.d.ts',
        // Optional local checkout of the component library, see use-local-orchestrator-ui-components.sh
        'orchestrator-ui-components',
    ]),
    {
        files: ['**/*.{js,ts,jsx,tsx}'],
        plugins: { js },
        extends: ['js/recommended'],
        rules: {
            'no-console': ['error', { allow: ['error', 'warn'] }],
        },
    },
    {
        files: ['**/*.{js,ts,jsx,tsx}'],
        languageOptions: { globals: globals.browser },
    },
    {
        plugins: {
            'react-hooks': reactHooks,
        },
        rules: {
            'react-hooks/rules-of-hooks': 'error',
            'react-hooks/exhaustive-deps': 'warn',
        },
    },
    {
        files: ['**/*.{ts,tsx}'],
        plugins: { typescriptEslint },
        extends: ['typescriptEslint/recommended'],
        rules: {
            '@typescript-eslint/ban-ts-comment': 'warn',
        },
    },
    {
        plugins: {
            react,
        },
        rules: {
            'react/react-in-jsx-scope': 'error',
            'react/jsx-uses-react': 'error',
        },
    },
    prettier,
]);
