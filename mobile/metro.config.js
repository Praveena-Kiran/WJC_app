// metro.config.js
// Learn more: https://docs.expo.dev/guides/customizing-metro/
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// ── Issue #004b: Client-Server Boundary Guard ─────────────────────────────
// Prevent server-only code from being bundled into the Expo Go / Hermes JS
// runtime. If a client file accidentally imports server code, Metro will
// throw a ResolutionError with a clear message — NOT silently crash at
// runtime with a native-module error.
//
// The ESLint no-restricted-imports rule in .eslintrc.js provides the
// earlier compile-time layer. This is the runtime Metro layer.
const existingBlockList = Array.isArray(config.resolver.blockList)
  ? config.resolver.blockList
  : config.resolver.blockList
  ? [config.resolver.blockList]
  : [];

config.resolver.blockList = [
  ...existingBlockList,
  // Block any file path containing 'prisma/' (mobile/prisma/ directory)
  /mobile\/prisma\//,
  // Block server-only node_modules from being bundled into client code.
  // hono & @aws-sdk excluded — API route files need them via Expo Router server.
  // ESLint (.eslintrc.js) still enforces the client-boundary for these packages.
];

// ── ESM / .mjs support ───────────────────────────────────────────────────
// better-auth and some of its dependencies ship only ESM (.mjs) files.
// Metro does not resolve .mjs by default — add it to the extension list.
const { sourceExts, assetExts } = config.resolver;
config.resolver.sourceExts = [...sourceExts, 'mjs', 'cjs'];
config.resolver.assetExts = assetExts.filter((ext) => ext !== 'svg');

// Allow Metro to resolve the "default" export condition so that packages
// that only ship an ESM "default" condition (like better-auth/adapters/*)
// are resolved correctly in API routes.
config.resolver.unstable_enablePackageExports = true;
config.resolver.unstable_conditionNames = [
  'require',
  'import',
  'default',
  'react-native',
  'browser',
];

module.exports = config;
