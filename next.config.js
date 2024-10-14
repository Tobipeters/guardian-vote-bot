/** @type {import('next').NextConfig} */
const nextConfig = {}

// module.exports = nextConfig

// next.config.js
module.exports = {
    webpack: (config, { isServer }) => {
      // Ignore .map files
      config.module.rules.push({
        test: /\.js\.map$/,
        use: 'ignore-loader'
      })

      return config
    }
  }
