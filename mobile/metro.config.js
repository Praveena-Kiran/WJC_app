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
  // Block any file path containing 'server/' (mobile/server/ directory)
  /mobile\/server\//,
  // Block any file path containing 'prisma/' (mobile/prisma/ directory)
  /mobile\/prisma\//,
  // Block server-only node_modules from being bundled into the client
  /node_modules\/(?=.*((?<![a-z])prisma(?![a-z])|@prisma|(?<![a-z])hono(?![a-z])|@aws-sdk)).*/,
];

module.exports = config;
