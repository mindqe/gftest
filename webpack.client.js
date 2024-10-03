import path from 'node:path';
import { fileURLToPath } from 'node:url';
import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';

import { merge } from 'webpack-merge';
import sharedConfig from './webpack.shared.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const APP_PATH = path.resolve(__dirname, 'src');
const BUILD_PATH = path.resolve(__dirname, 'dist', 'public');

export default (env, argv) => {
  const entries = [];

  const isProduction = argv.mode === 'production';
  const isDevelopment = !isProduction;
  console.log(
    `i Building client in ${isProduction ? 'production' : 'development'} mode`
  );
  console.log(`i Source path is "${APP_PATH}"`);
  console.log(`i Production path is "${BUILD_PATH}"`);
  if (isDevelopment) {
    entries.push('webpack-hot-middleware/client?reload=true&overlay=true');
  }
  entries.push(APP_PATH + '/client.tsx');

  return merge(sharedConfig(env, argv), {
    name: 'client',
    mode: isDevelopment ? 'development' : 'production',
    devtool: isDevelopment && 'cheap-module-source-map',
    entry: entries,
    optimization: {
      moduleIds: 'deterministic',
      runtimeChunk: 'single',
      splitChunks: {
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
        },
      },
    },
    output: {
      filename: 'js/[name].[contenthash:8].js',
      path: BUILD_PATH,
      publicPath: '/',
    },
    module: {
      rules: [
        {
          test: /\.css$/,
          use: [
            {
              loader: 'style-loader',
            },
            {
              loader: 'css-loader',
              options: {
                importLoaders: 1,
              },
            },
            {
              loader: 'postcss-loader',
            },
          ],
        },
      ],
    },
    plugins: [
      new webpack.EnvironmentPlugin({
        NODE_ENV: isDevelopment ? 'development' : 'production',
      }),
      isDevelopment && new webpack.HotModuleReplacementPlugin(),
      isDevelopment && new ReactRefreshWebpackPlugin(),
      new HtmlWebpackPlugin({
        title: 'GFTest - Mindaugas Daugenas',
        template: 'public/index.html',
        filename: 'index.html',
        minify: {
          removeComments: true,
          collapseWhitespace: true,
          removeRedundantAttributes: true,
          useShortDoctype: true,
          removeEmptyAttributes: true,
          removeStyleLinkTypeAttributes: true,
          keepClosingSlash: true,
          minifyJS: true,
          minifyCSS: true,
          minifyURLs: true,
        },
        inject: true,
      }),
      new CopyWebpackPlugin({
        patterns: [
          {
            from: path.resolve(__dirname, 'public'),
            to: path.resolve(__dirname, 'dist', 'public'), // Destination directory
            globOptions: {
              ignore: ['**/index.html'], // Exclude index.html
            },
          },
        ],
      }),
    ].filter(Boolean),
    resolve: {
      alias: {
        '@domain': path.resolve(__dirname, 'domain/'),
        '@infrastructure': path.resolve(__dirname, 'infrastructure/'),
        '@mocks': path.resolve(__dirname, 'mocks/'),
        '@src': path.resolve(__dirname, 'src/'),
      },
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.json', '.css'],
      extensionAlias: {
        '.js': ['.ts', '.js'],
        '.mjs': ['.mts', '.mjs'],
      },
    },
  });
};
