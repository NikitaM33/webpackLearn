const webpack = require('webpack');
const path = require('path');
const HtmlPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtract = require('mini-css-extract-plugin');
const CssMinimizer = require('css-minimizer-webpack-plugin');
const CssOptimizer = require('optimize-css-assets-webpack-plugin');
const Terser = require('terser-webpack-plugin');

const isDev = process.env.NODE_ENV === 'development';
const filename = (ext) => isDev ? `[name].${ext}` : `[name].[contenthash].${ext}`

const cssLoaders = (extra) => {
    const loaders = [
        {
            loader: MiniCssExtract.loader,
            options: {}
        },
        'css-loader'
    ];

    if (extra) {
        loaders.push(extra)
    }

    return loaders
}

const optimization = () => {
    const config = {
        splitChunks: {
            chunks: 'all'
        },
        minimizer: [
            new CssMinimizer()
        ]
    };

    if (!isDev) {
        config.minimizer = [
            new Terser(),
            new CssOptimizer()
        ]
    }

    return config;
}

const plugins = [
    new HtmlPlugin({
        template: './index.html',
        minify: !isDev
    }),
    new CleanWebpackPlugin(),
    new CopyPlugin({
        patterns: [
            {
                from: path.resolve(__dirname, 'src/share.ico'),
                to: path.resolve(__dirname, 'dist')
            }
        ]
    }),
    new MiniCssExtract({
        // filename: isDev ? '[name].css' : '[name].[hash].css'
        filename: filename('css')
    })
];

const babelOptions = (pres) => {
    const opts = {
        presets: ['@babel/preset-env'],
        plugins: [
            '@babel/plugin-proposal-json-strings' // For example
        ]
    };

    if (pres) {
        opts.presets.push(pres);
    }

    return opts;
}

const jsLoaders = (ext) => {
    const ldr = [{
        loader: 'babel-loader',
        options: babelOptions()
    }];

    // TO DO: Как подключить eslint
    // if (isDev) {
    //     ldr.push('eslint-loader');
    // }

    return ldr;
}

if (isDev) {
    plugins.push(new webpack.HotModuleReplacementPlugin());
}

module.exports = {
    context: path.resolve(__dirname, 'src'),
    mode: 'development',
    entry: {
        main: ['@babel/polyfill', './index.js'],
        analytics: './analytics.ts'
    },
    output: {
        // filename: '[name].[hash].js',
        filename: filename('js'),
        path: path.resolve(__dirname, 'dist')
    },
    resolve: {
        extensions: ['tsx', 'ts', '.js', 'jsx', '.json'],
        alias: {
            '@models': path.resolve(__dirname, 'src/models'),
            '@': path.resolve(__dirname, 'src')
        }
    },
    devtool: isDev ? 'source-map' : '',
    optimization: optimization(),
    devServer: {
        port: 4200,
        hot: isDev
    },
    plugins,
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: cssLoaders()
            },
            {
                test: /\.s[ac]ss$/i,
                use: cssLoaders('sass-loader')
            },
            // TO DO: Разобраться с загрузкой картинок
            {
                test: /\.(png|jpeg|jpg|svg|gif|webp)$/i,
                loader: 'file-loader',
                options: {
                    name: './[name].[ext]'
                }
            },
            {
                test: /\.(ttf|woff|woff2|eot)$/,
                use: ['file-loader']
            },
            {
                test: /\.m?js$/,
                exclude: /node_modules/,
                use: jsLoaders()
                // {
                //     loader: 'babel-loader',
                //     options: babelOptions()
                // }
            },
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: babelOptions('@babel/preset-typescript')
                }
            }
        ]
    }
}
