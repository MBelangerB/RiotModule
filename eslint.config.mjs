import { defineConfig, globalIgnores } from 'eslint/config';
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import globals from 'globals';
import tsParser from '@typescript-eslint/parser';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
const currentFileName = fileURLToPath(import.meta.url);
const currentDirName = path.dirname(currentFileName);
const compat = new FlatCompat({
    // baseDirectory: __dirname,
    baseDirectory: currentDirName,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all,
});

export default defineConfig([globalIgnores(['build/**/*', 'test/*']), {
    extends: compat.extends('eslint:recommended', 'plugin:@typescript-eslint/recommended'),

    plugins: {
        '@typescript-eslint': typescriptEslint,
    },

    languageOptions: {
        globals: {
            ...globals.node,
        },

        parser: tsParser,
        ecmaVersion: 2022,
        sourceType: 'commonjs',
    },

    rules: {
        '@typescript-eslint/no-non-null-assertion': 'off',
        quotes: ['error', 'single'],
        'no-var': 'error',
        'prefer-const': 'error',
        semi: ['error', 'always'],
        'no-trailing-spaces': ['error'],

        'brace-style': ['error', '1tbs', {
            allowSingleLine: true,
        }],

        'space-before-blocks': 'error',
        indent: ['off', 'tab'],
        'comma-dangle': ['error', 'always-multiline'],
        'comma-spacing': 'error',
        'comma-style': 'error',
        'no-empty-function': 'error',
        'spaced-comment': 'error',
        'no-multi-spaces': 'error',

        'no-multiple-empty-lines': ['error', {
            max: 2,
            maxEOF: 1,
            maxBOF: 0,
        }],

        'no-lonely-if': 'error',
        'no-inline-comments': 'off',
        'no-console': 'off',
        'object-curly-spacing': ['error', 'always'],

        'max-statements-per-line': ['error', {
            max: 2,
        }],

        'arrow-spacing': ['warn', {
            before: true,
            after: true,
        }],

        curly: ['error', 'multi-line', 'consistent'],
        'dot-location': ['error', 'property'],
        'handle-callback-err': 'off',
        'keyword-spacing': 'error',

        'max-nested-callbacks': ['error', {
            max: 4,
        }],

        'no-floating-decimal': 'error',

        'no-shadow': ['error', {
            allow: ['err', 'resolve', 'reject'],
        }],

        'space-in-parens': 'error',
        'space-infix-ops': 'error',
        'space-unary-ops': 'error',
        yoda: 'error',
    },
}]);