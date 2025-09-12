/** @type {import('ts-jest').JestConfigWithTsJest} **/
export default {
    // Default config
    testEnvironment: 'node',
    preset: 'ts-jest/presets/default-esm',
    extensionsToTreatAsEsm: ['.ts'],
    resolver: 'ts-jest-resolver',
    transform: {
        '^.+\\.tsx?$': ['ts-jest', { useESM: true }],
    },
    moduleNameMapper: {
        '^(\\.{1,2}/.*)\\.js$': '$1',
    },
    verbose: false,

    // File matching
    testMatch: ['<rootDir>/test/**/*.test.ts', '<rootDir>/test/**/*.spec.ts'],

    // Coverage config
    collectCoverage: true,
    coveragePathIgnorePatterns: ['/node_modules/', '/scripts/', '/src/manual_test.ts', '/src/test-export.ts'],
    coverageDirectory: '<rootDir>/coverage',
    coverageReporters: ['json', 'lcov', 'text', 'clover'],
    collectCoverageFrom: [
        'src/**/*.{ts,tsx,js,jsx}',
    ],
};