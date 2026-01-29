// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');
const prettierConfig = require('eslint-config-prettier');
const reactNativePlugin = require('eslint-plugin-react-native');
const tsPlugin = require('@typescript-eslint/eslint-plugin');

module.exports = defineConfig([
  // Base Expo config - includes React Native specific rules
  expoConfig,

  // Prettier config - disables ESLint rules that conflict with Prettier
  prettierConfig,

  {
    ignores: [
      'dist/*',
      'node_modules/*',
      '.expo/*',
      'jest.config.js',
      'babel.config.js',
      'metro.config.js',
      'tailwind.config.js',
    ],
  },

  // Define plugins globally so they are available for all files
  {
    plugins: {
      'react-native': reactNativePlugin,
      '@typescript-eslint': tsPlugin,
    },
  },

  // TypeScript & React Native rules
  {
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      // TypeScript-specific rules
      '@typescript-eslint/explicit-function-return-type': 'off', // Can be 'warn' if you want stricter typing
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/consistent-type-imports': [
        'warn',
        {
          prefer: 'type-imports',
          fixStyle: 'inline-type-imports',
        },
      ],

      // React rules
      'react/react-in-jsx-scope': 'off', // Not needed in React 17+
      'react/prop-types': 'off', // Using TypeScript for prop validation

      // React Native rules (adjusted for NativeWind/Tailwind usage)
      'react-native/no-unused-styles': 'warn', // Detect unused StyleSheet styles
      'react-native/no-inline-styles': 'off', // Disabled - using NativeWind className
      'react-native/no-color-literals': 'off', // Tailwind handles colors via classes
      'react-native/no-raw-text': 'off', // Can enable to enforce Text wrapping
      'react-native/split-platform-components': 'warn', // Detect platform-specific imports

      // General code quality
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'prefer-const': 'warn',
      'no-var': 'error',
    },
  },
]);
