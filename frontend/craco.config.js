const webpack = require("webpack")

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // Configurazione dei fallback per i moduli Node.js
      webpackConfig.resolve.fallback = {
        ...webpackConfig.resolve.fallback,
        path: require.resolve("path-browserify"),
        stream: require.resolve("stream-browserify"),
        util: require.resolve("util/"),
        zlib: require.resolve("browserify-zlib"),
        assert: require.resolve("assert/"),
        constants: require.resolve("constants-browserify"),
        fs: false,
        os: false,
        child_process: false,
        url: require.resolve("url/"),
        buffer: require.resolve("buffer/"),
        process: require.resolve("process/browser"),
      }

      // Aggiungere plugin per fornire process e Buffer
      webpackConfig.plugins.push(
        new webpack.ProvidePlugin({
          process: "process/browser",
          Buffer: ["buffer", "Buffer"],
        })
      )

      return webpackConfig
    },
  },
}
