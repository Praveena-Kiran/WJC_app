/** @type {import('eslint').Linter.Config} */
module.exports = {
  extends: ['expo'],
  overrides: [
    {
      // ── Client-Server boundary guard (Issue #004b) ─────────────────────────
      // Applies ONLY to client-side files in app/, src/components/, src/context/, src/lib/, src/hooks/
      files: ['app/**/*', 'src/components/**/*', 'src/context/**/*', 'src/lib/**/*', 'src/hooks/**/*'],
      excludedFiles: ['app/api/**/*'],
      rules: {
        'no-restricted-imports': [
          'error',
          {
            patterns: [
              {
                group: ['**/server/**'],
                message:
                  'Server code is forbidden in client files. Use apiFetch() from @/lib/api instead.',
              },
              {
                group: ['**/prisma/**'],
                message:
                  'Prisma schema/client is server-only. Use apiFetch() to communicate with the server.',
              },
            ],
            paths: [
              {
                name: '@prisma/client',
                message: 'Prisma is server-only. Use apiFetch() from @/lib/api instead.',
              },
              {
                name: 'prisma',
                message: 'Prisma CLI is server-only.',
              },
              {
                name: 'hono',
                message: 'Hono is server-only.',
              },
              {
                name: '@aws-sdk/client-s3',
                message:
                  'AWS SDK is server-only. Use a presigned URL via apiFetch() instead.',
              },
              {
                name: '@aws-sdk/s3-request-presigner',
                message: 'AWS SDK is server-only. Use presigned URL via apiFetch().',
              },
            ],
          },
        ],
      },
    },
  ],
  ignorePatterns: ['node_modules/', 'dist/', '.expo/', 'ios/', 'android/', '*.config.js', 'prisma/seed.ts'],
};
