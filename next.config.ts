import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
