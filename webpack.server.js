import path from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';

import webpack from 'webpack';
import nodeExternals from 'webpack-node-externals';

import { merge } from 'webpack-merge';
import sharedConfig from './webpack.shared.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const APP_PATH = path.resolve(__dirname, 'src');
const BUILD_PATH = path.resolve(__dirname, 'dist');

export default (env, argv) => {
  const info = (msg) => console.log(chalk.cyanBright(msg));

  const isProduction = argv.mode === 'production';
  const isDevelopment = !isProduction;
  info(
    `i Building server in ${isProduction ? 'production' : 'development'} mode`
  );
  info(`i Source path is "${APP_PATH}"`);
  info(`i Build path is "${BUILD_PATH}"`);

  return merge(sharedConfig(env, argv), {
    name: 'server',
    stats: 'errors-warnings',
    target: 'node',
    mode: isDevelopment ? 'development' : 'production',
    externals: nodeExternals({
      allowlist: [/^@emotion/, /^@babel/],
    }),
    devtool: isDevelopment ? 'source-map' : 'eval',
    entry: {
      server: APP_PATH + '/server.js',
    },
    externalsPresets: {
      node: true,
    },
    output: {
      filename: 'server.cjs',
      path: BUILD_PATH,
      publicPath: '/',
      libraryTarget: 'commonjs2',
      clean: true,
    },
    plugins: [
      new webpack.EnvironmentPlugin({ NODE_ENV: 'development' }),
      isDevelopment && new webpack.HotModuleReplacementPlugin(),
    ].filter(Boolean),
    module: {
      rules: [
        {
          test: /\.css$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: '[name].[contenthash:8].css',
                outputPath: 'css/', // Output path for CSS files
                esModule: false, // Ensure CommonJS compatibility
                sourceMap: false,
              },
            },
            {
              loader: 'postcss-loader',
            },
          ],
        },
      ],
    },
    resolve: {
      alias: {
        '@domain': path.resolve(__dirname, 'domain/'),
        '@infrastructure': path.resolve(__dirname, 'infrastructure/'),
        '@mocks': path.resolve(__dirname, 'mocks/'),
        '@src': path.resolve(__dirname, 'src/'),
      },
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
      extensionAlias: {
        '.js': ['.ts', '.js'],
        '.mjs': ['.mts', '.mjs'],
      },
    },
  });
};
