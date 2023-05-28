const nodeExternals = require('webpack-node-externals');
const { RunScriptWebpackPlugin } = require('run-script-webpack-plugin');

// webpack-node-externals :将Node.js的核心模块和第三方依赖排除在Webpack打包过程之外。它的作用是使得在使用Webpack构建Node.js应用程序时，这些核心模块和第三方依赖不会被打包到最终的输出文件中。
//                         当使用Webpack构建Node.js应用程序时，Webpack默认会将所有引入的模块打包到输出文件中，包括Node.js的核心模块和第三方依赖。
//                         然而，在Node.js环境中，这些核心模块和第三方依赖已经存在于运行时环境中，不需要通过Webpack进行打包。
//                         它会根据配置的规则，自动将Node.js的核心模块和指定的第三方依赖排除在Webpack打包范围之外，
//                         而不是将它们打包到输出文件中。这样可以减小输出文件的体积，并且保持对Node.js核心模块和第三方依赖的引用关系不变，使得应用程序能够在Node.js环境中正确运行。
module.exports = function (options, webpack) {
  return {
    ...options,
    entry: ['webpack/hot/poll?100', options.entry],
    externals: [
      nodeExternals({
        allowlist: ['webpack/hot/poll?100'],
      }),
    ],
    plugins: [
      ...options.plugins,
      new webpack.HotModuleReplacementPlugin(),
      new webpack.WatchIgnorePlugin({
        paths: [/.js$/, /.d.ts$/],
      }),
      new RunScriptWebpackPlugin({ name: options.output.filename }),
    ],
  };
};
