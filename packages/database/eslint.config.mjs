import { libraryConfig } from '@repo/eslint-config/library';

/** @type {import("eslint").Linter.Config} */
export default [
  ...libraryConfig,
  {
    ignores: ['generated/**'],
  },
  {
    rules: {
      'turbo/no-undeclared-env-vars': [
        'error',
        {
          allowList: ['NODE_ENV', 'DATABASE_URL', 'DEBUG'],
        },
      ],
    },
  },
];
