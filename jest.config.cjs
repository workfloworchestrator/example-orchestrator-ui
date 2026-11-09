const nextJest = require('next/jest');

const createJestConfig = nextJest({
    // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
    dir: './',
});

// Dependencies that ship ESM-only builds and must be transformed to CommonJS
// before Jest can require them.
const esmDependencies = [
    'next-intl',
    'use-intl',
    'intl-messageformat',
    '@formatjs/.*',
    '@apidevtools/json-schema-ref-parser',
];

// The entry for "uuid" in the moduleNameMapper can be removed when EUI updates the dependency version to 9.0.0 or higher.
// https://github.com/uuidjs/uuid/blob/main/CHANGELOG.md#900-2022-09-05
const customJestConfig = {
    displayName: 'Wfo-UI Tests',
    transformIgnorePatterns: [
        `/node_modules/(?!(${esmDependencies.join('|')})/)`,
        '^.+\\.module\\.(css|sass|scss)$',
    ],
    resetMocks: true,
    coveragePathIgnorePatterns: [],
    collectCoverageFrom: ['<rootDir>/src/**/*.{js,ts,tsx}'],
    coverageThreshold: null,
    testEnvironment: 'jsdom',
    transform: {
        '^.+\\.tsx?$': 'babel-jest',
        '^.+\\.jsx?$': 'babel-jest',
    },
    setupFilesAfterEnv: ['@testing-library/jest-dom'],
    moduleDirectories: ['node_modules'],
    moduleFileExtensions: ['js', 'jsx', 'json', 'ts', 'tsx'],
    moduleNameMapper: { '^uuid$': 'uuid' },
};

module.exports = createJestConfig(customJestConfig);
