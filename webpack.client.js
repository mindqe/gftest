import path from "node:path";
import { fileURLToPath } from "node:url";
import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';

import { merge } from 'webpack-merge';
import sharedConfig from './webpack.shared.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const APP_PATH = path.resolve(__dirname, "src");
const BUILD_PATH = path.resolve(__dirname, "dist");

export default (env, argv) => {
    const isProduction = argv.mode === "production";
    const isDevelopment = !isProduction;
    console.log(`i Building client in ${isProduction ? "production" : "development"} mode`)
    console.log(`i Source path is "${APP_PATH}"`)
    console.log(`i Production path is "${BUILD_PATH}"`)

    return merge(sharedConfig(env, argv), {
        name: "client",
        mode: isDevelopment ? 'development' : 'production',
        devtool: isDevelopment && "cheap-module-source-map",
        entry: [
            'webpack-hot-middleware/client?reload=true&overlay=true',
            APP_PATH + "/client.tsx"
        ],
        optimization: {
            moduleIds: "deterministic",
            runtimeChunk: "single",
            splitChunks: {
                cacheGroups: {
                    vendor: {
                        test: /[\\/]node_modules[\\/]/,
                        name: "vendors",
                        chunks: "all",
                    },
                },
            },
        },
        output: {
            filename: "js/[name].[contenthash:8].js",
            path: BUILD_PATH,
            publicPath: "/",
        },
        module: {
            rules: [
                {
                    test: /\.css$/,
                    use: [
                        {
                            loader: "style-loader",
                        },
                        {
                            loader: "css-loader",
                            options: {
                                importLoaders: 1,
                            },
                        },
                        {
                            loader: "postcss-loader",
                        },
                    ],
                },
            ],
        },
        plugins: [
            new webpack.EnvironmentPlugin({ NODE_ENV: 'development' }),
            isDevelopment && new webpack.HotModuleReplacementPlugin(),
            isDevelopment && new ReactRefreshWebpackPlugin(),
            new HtmlWebpackPlugin({
                title: "GFTest - Mindaugas Daugenas",
                template: "public/index.html",
                filename: "index.html",
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
        ].filter(Boolean),
        resolve: {
            alias: {
                '@domain': path.resolve(__dirname, 'domain/'),
                '@infrastructure': path.resolve(__dirname, 'infrastructure/'),
                '@mocks': path.resolve(__dirname, 'mocks/'),
                '@src': path.resolve(__dirname, 'src/')
            },
            extensions: ['.js', '.jsx', '.ts', '.tsx', '.json', '.css'],
            extensionAlias: {
                '.js': ['.ts', '.js'],
                '.mjs': ['.mts', '.mjs'],
            },
        },
    });
};
