/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['m.atcdn.co.uk']
    },
    webpack: (config, { isServer }) => {
        config.module.rules.push({
          test: /\.node$/,
          use: [
            {
              loader: 'node-loader',
            },
          ],
        });
        // Exclude onnxruntime-node from being processed by webpack
        config.externals.push({
          'onnxruntime-node': 'commonjs onnxruntime-node',
        });
        return config;
      },
    };

export default nextConfig;
