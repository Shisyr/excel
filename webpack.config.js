const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniScssExtractPlugin = require('mini-css-extract-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const EslintWebpackPlugin = require('eslint-webpack-plugin');

module.exports = (env, argv) => {
  console.log(argv.mode);
  const isProd = argv.mode === 'production';
  const isDev = !isProd;

  const generateFilename = (ext) => isProd ? `[name].[contenthash].bundle.${ext}` : `[name].bundle.${ext}`;
  const plugins = () => {
    const base = [
      new MiniScssExtractPlugin({
        filename: generateFilename('css')
      }),
      new HtmlWebpackPlugin({
        template: './index.html'
      }),
      new CopyWebpackPlugin({
        patterns: [
          {
            from: path.resolve(__dirname, 'src', 'favicon.ico'),
            to: path.resolve(__dirname, 'dist')
          }
        ]
      }),
      new CleanWebpackPlugin()
    ];
    if (isDev) {
      base.push(new EslintWebpackPlugin());
    }
    return base;
  };
  return {
    target: 'web',
    context: path.resolve(__dirname, 'src'),
    entry: {
      main: ['@babel/polyfill', './index.js']
    },
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: generateFilename('js')
    },
    resolve: {
      extensions: ['.js', '.ts'],
      alias: {
        '@': path.resolve(__dirname, 'src'),
        '@core': path.resolve(__dirname, 'src', 'core')
      }
    },
    devtool: isDev ? 'source-map' : false,
    module: {
      rules: [
        {
          test: /\.s[ac]ss$/i,
          use: [
            MiniScssExtractPlugin.loader,
            'css-loader',
            'sass-loader'
          ]
        },
        {
          test: /\.m?js$/i,
          exclude: /node_modules/,
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      ]
    },
    devServer: {
      port: '3000',
      // open: true
      hot: true
    },
    plugins: plugins()
  };
};
