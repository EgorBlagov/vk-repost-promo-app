const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

module.exports = {
    mode: 'production',
    devtool: 'source-map',
    resolve: {
        extensions: ['.ts', '.js', '.tsx', '.jsx']
    },
    entry: "./src/client/index.tsx",
    output: {
        path: path.resolve(__dirname, 'build', 'client'),
        filename: "bundle.js"
    },
    plugins: [
      new HtmlWebpackPlugin({
        title: 'Output Management',
        template: './src/client/index.html'
      }),
    ],

    module: {
        rules: [
            {
                test: /\.tsx?$/,
                exclude: [/node_modules/],
                loader: ['ts-loader']
            },
            {
                test: /\.js$/,
                enforce: 'pre',
                loader: 'source-map-loader'
            },
            {
                test: /\.html$/,
                loader: 'html-loader',
            },
            {
                test:/\.css$/,
                use:['style-loader','css-loader']
            }
        ]
    },
    watchOptions: {
        poll: 1000
    },
    devServer: {
        proxy: {
            '/api': 'http://localhost:5000'
        }
    },
    plugins: [
        new webpack.EnvironmentPlugin(['BASE_PATH', 'APP_ID'])
    ]
}
