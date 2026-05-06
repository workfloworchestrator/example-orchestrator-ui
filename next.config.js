module.exports = {
    reactStrictMode: false,
    output: 'standalone',
    i18n: {
        // These are all the locales you want to support in
        // your application
        locales: ['en-GB', 'nl-NL'],
        defaultLocale: 'en-GB',
    },
    transpilePackages: [
        '@copilotkit/react-core',
        '@orchestrator-ui/orchestrator-ui-components',
    ],
};
