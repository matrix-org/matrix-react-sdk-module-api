module.exports = {
    plugins: ["matrix-org"],
    extends: ["plugin:matrix-org/babel"],
    env: {
        browser: true,
        node: true,
    },
    rules: {
        // No specific rules
    },
    overrides: [
        {
            files: ["**/*.ts"],
            extends: ["plugin:matrix-org/typescript"],
            rules: {
                // TypeScript has its own version of this
                "@babel/no-invalid-this": "off",

                // We're okay being explicit at the moment
                "@typescript-eslint/no-empty-interface": "off",

                // Turn off things we're not concerned about here
                "object-curly-spacing": "off",
                "array-bracket-spacing": "off",
                "quote-props": "off", // "be sensible"
                "@typescript-eslint/no-explicit-any": "off", // handled at review time

                // Casing is something we'll resolve at review time
                "camelcase": "off",
                "@typescript-eslint/naming-convention": "off",
            },
        },
    ],
};
