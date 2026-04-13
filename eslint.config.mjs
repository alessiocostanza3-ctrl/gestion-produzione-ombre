import js from '@eslint/js';
import globals from 'globals';

export default [
    // ── Ignora build output e vendor ────────────────────────────────────────
    { ignores: ['dist/**', 'node_modules/**'] },

    // ── File browser (ES modules bundlati da esbuild) ───────────────────────
    {
        files: ['script.js', 'modules/**/*.js', 'head-init.js'],
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: 'module',
            globals: { ...globals.browser }
        },
        rules: {
            ...js.configs.recommended.rules,
            'no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_|^e$' }],
            'no-empty': ['error', { allowEmptyCatch: true }],
            'no-irregular-whitespace': ['error', { skipComments: true, skipStrings: true, skipTemplates: true }],
            'no-useless-assignment': 'warn',
            'no-console': 'off',
            'no-undef': 'warn',
        }
    },

    // ── Service Worker (ESM browser + SW globals) ───────────────────────────
    {
        files: ['sw.js'],
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: 'module',
            globals: { ...globals.browser, ...globals.serviceworker }
        },
        rules: {
            ...js.configs.recommended.rules,
            'no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_|^e$' }],
            'no-empty': ['error', { allowEmptyCatch: true }],
            'no-console': 'off',
            'no-undef': 'warn',
        }
    },

    // ── File Node (CJS) ─────────────────────────────────────────────────────
    {
        files: ['_check.js', 'server.js'],
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: 'commonjs',
            globals: { ...globals.node }
        },
        rules: {
            ...js.configs.recommended.rules,
            'no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
            'no-console': 'off',
        }
    },

    // ── Build script (ESM Node) ─────────────────────────────────────────────
    {
        files: ['build.mjs'],
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: 'module',
            globals: { ...globals.node }
        },
        rules: {
            ...js.configs.recommended.rules,
            'no-empty': ['error', { allowEmptyCatch: true }],
            'no-console': 'off',
        }
    },
];
