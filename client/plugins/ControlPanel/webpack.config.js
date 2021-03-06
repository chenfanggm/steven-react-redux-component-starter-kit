const argv = require('yargs').argv;
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const debug = require('debug')('app:config:webpack');
const config = require('../../../config');

const paths = config.pathUtil;
const __DEV__ = config.compilerGlobals.__DEV__;
const __PROD__ = config.compilerGlobals.__PROD__;
const __TEST__ = config.compilerGlobals.__TEST__;

debug('Init webpack config.');

const webpackConfig = {
  devtool: config.compilerSourceMap,
  entry: ['./index.js'],
  output: {
    path: paths.dist('plugins'),
    filename: __DEV__ ? '[name].bundle.js' : 'controlPanel.chunk.js',
    publicPath: config.compilerPublicPath,
    library: 'controlPanelCallback',
    libraryTarget: 'jsonp'
  },
  resolve: {
    modules: [
      paths.client(),
      'node_modules'
    ],
    extensions: ['*', '.js', '.jsx', '.json']
    // alias: {}
  },
  externals: {},
  module: {
    // noParse: /jquery/,
    rules: []
  },
  plugins: [
    new webpack.DefinePlugin(config.compilerGlobals),
    // new webpack.ProvidePlugin({})
  ]
};

// ------------------------------------
// Module Rules
// ------------------------------------
// JavaScript
webpackConfig.module.rules.push({
  test: /\.(js|jsx)$/,
  exclude: /node_modules/,
  use: [{
    loader: 'babel-loader',
    options: {
      cacheDirectory: true,
      presets: [
        'babel-preset-react',
        ['babel-preset-env', {
          modules: false,
          targets: {
            browsers: 'last 2 versions',
            uglify: __PROD__
          }
        }]
      ],
      plugins: [
        'react-hot-loader/babel',
        ['lodash', { 'id': ['lodash'] }],
        'babel-plugin-syntax-dynamic-import',
        'babel-plugin-transform-class-properties',
        ['babel-plugin-transform-runtime'],
        ['babel-plugin-transform-object-rest-spread']
      ]
    }
  }]
});

// Images
webpackConfig.module.rules.push({
  test: /\.(jpe?g|png|gif)$/i,
  loader: 'url-loader',
  options: { limit: 8192 }
})

// Fonts
;[
  ['woff', 'application/font-woff'],
  ['woff2', 'application/font-woff2'],
  ['otf', 'font/opentype'],
  ['ttf', 'application/octet-stream'],
  ['eot', 'application/vnd.ms-fontobject'],
  ['svg', 'image/svg+xml'],
].forEach((font) => {
  const extension = font[0];
  const mimetype = font[1];

  webpackConfig.module.rules.push({
    test    : new RegExp(`\\.${extension}$`),
    loader  : 'url-loader',
    options : {
      name  : 'fonts/[name].[ext]',
      limit : 10000,
      mimetype,
    },
  });
});

// Styles
const cssLoader = {
  loader: 'css-loader',
  options: {
    modules: config.compilerCssModules,
    importLoaders: 1,
    localIdentName: '[name]__[local]--[hash:base64:5]',
    sourceMap: !!config.compilerSourceMap,
    minimize: {
      preset: ['default', {
        autoprefixer: { browsers: ['last 2 versions'] },
        discardComments: { removeAll : true },
        discardUnused: false,
        mergeIdents: false,
        reduceIdents: false,
        safe: true,
        sourcemap: !!config.compilerSourceMap
      }]
    }
  }
};

const sassLoader = {
  loader: 'sass-loader',
  options: {
    sourceMap: !!config.compilerSourceMap,
    includePaths: [
      paths.client('styles'),
    ]
  }
};

const extractStyles = new ExtractTextPlugin({
  filename: '[name].[contenthash].css',
  allChunks: true,
  disable: __DEV__
});

webpackConfig.module.rules.push({
  test: /\.(sass|scss)$/,
  loader: extractStyles.extract({
    fallback: 'style-loader',
    use: [
      cssLoader,
      sassLoader
    ]
  })
});

webpackConfig.module.rules.push({
  test: /\.css$/,
  loader: extractStyles.extract({
    fallback: 'style-loader',
    use: [cssLoader]
  })
});

webpackConfig.plugins.push(extractStyles);

// HTML Template
webpackConfig.plugins.push(new HtmlWebpackPlugin({
  template: paths.client('index.html'),
  favicon: paths.client('statics/favicon.ico'),
  hash: false,
  inject: 'body',
  minify: {
    collapseWhitespace: true
  }
}));

// Development Tools
if (__DEV__) {
  debug('Enable plugins for live development (HMR, NamedModulesPlugin).');
  webpackConfig.plugins.push(
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
  );
}

// Production Optimizations
if (__PROD__) {
  debug('Enable plugins for production optimization.');
  webpackConfig.plugins.push(
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false,
    }),
    new webpack.optimize.ModuleConcatenationPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: !!config.devtool,
      comments: false,
      compress: {
        warnings: false,
        screw_ie8: true,
        conditionals: true,
        unused: true,
        comparisons: true,
        sequences: true,
        dead_code: true,
        evaluate: true,
        if_return: true,
        join_vars: true,
      }
    })
  );
}

// Bundle Splitting
// if (!__TEST__) {
//   debug('Enable plugins for bundle split.');
//   webpackConfig.plugins.push(
//     new webpack.optimize.CommonsChunkPlugin({
//       names: 'common'
//     })
//   );
// }

/* Ensure that the compiler exits on errors during testing so that
they do not get skipped and misreported.*/
if (__TEST__ && !argv.watch) {
  webpackConfig.plugins.push(() => {
    this.plugin('done', (stats) => {
      if (stats.compilation.errors.length) {
        throw new Error(
          stats.compilation.errors.map(err => err.message || err)
        );
      }
    });
  });
}

module.exports = webpackConfig;
