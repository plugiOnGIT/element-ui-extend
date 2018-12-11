var path = require('path');
var webpack = require('webpack');

const ExtractTextPlugin = require("extract-text-webpack-plugin");
const NODE_ENV = process.env.NODE_ENV;
const IS_DEV = NODE_ENV === 'development';

module.exports = {
  entry: IS_DEV ? './src/main.js' : './src/components/index.js',
  output: {
    path: path.resolve(__dirname, './dist'),
    publicPath: '/dist/',
    filename: 'element-ui-extend.js',
    library: 'element-ui-extend',
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'vue-style-loader',
          'css-loader'
        ],
        // use: ExtractTextPlugin.extract({
        //   fallback: "style-loader",
        //   use: "css-loader"
        // })
      },
      {
        test: /\.less$/,
        // use: ExtractTextPlugin.extract({
        //   fallback: 'style-loader',
        //   use: ['css-loader', 'less-loader']
        // })
        loader: 'style-loader!css-loader!less-loader'
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
            // Since sass-loader (weirdly) has SCSS as its default parse mode, we map
            // the "scss" and "sass" values for the lang attribute to the right configs here.
            // other preprocessors should work out of the box, no loader config like this necessary.
            'scss': [
              'vue-style-loader',
              'css-loader',
              'sass-loader'
            ],
            'sass': [
              'vue-style-loader',
              'css-loader',
              'sass-loader?indentedSyntax'
            ]
          }
          // other vue-loader options go here
        }
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        options: {
          presets: [
            [
              'env', {targets: {browsers: ['>1%', 'last 2 versions']}}
            ]
          ]
        },
        include: [
          path.resolve(__dirname, 'src'),
          path.resolve(__dirname, 'node_modules/element-ui/src/utils'),
          path.resolve(__dirname, 'node_modules/element-ui/src/mixins')
        ]
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]?[hash]'
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 80000,
          name: '[name].[ext]?[hash]'
        }
      }
    ]
  },
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js'
    },
    extensions: ['*', '.js', '.vue', '.json']
  },
  devServer: {
    historyApiFallback: true,
    noInfo: true,
    overlay: true
  },
  performance: {
    hints: false
  },
  devtool: '#eval-source-map'
};

if (process.env.NODE_ENV === 'production') {
  module.exports.devtool = '#source-map';
  // http://vue-loader.vuejs.org/en/workflow/production.html
  module.exports.plugins = (module.exports.plugins || []).concat([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      compress: {
        warnings: false
      }
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    }),
    new ExtractTextPlugin("element-extend-theme.css")
  ])
}
