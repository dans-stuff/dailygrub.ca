import type { NextConfig } from "next";

// Static export configuration for the public deals viewer (dailygrub.ca)
// This produces a fully static site in ./out/ deployed to Cloudflare Workers
// See CLAUDE.md for architecture details
const nextConfig: NextConfig = {
  // Produces static HTML files - no server required at runtime
  output: 'export',
  turbopack: {
    rules: {
      '*.csv': {
        loaders: ['raw-loader'],
        as: '*.js',
      },
    },
  },
  webpack: (config) => {
    // Load CSV files as raw text (for non-Turbopack builds)
    config.module.rules.push({
      test: /\.csv$/,
      type: 'asset/source',
    });

    return config;
  },
};

export default nextConfig;
