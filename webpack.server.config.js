const path = require('path');
const nodeExternals = require('webpack-node-externals');
const webpack = require('webpack');

module.exports = {
    mode: 'production',
    devtool: 'source-map',
    resolve: {
        extensions: ['.ts', '.js']
    },
    entry: "./src/server/main.ts",
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: "app.js"
    },

    module: {
        rules: [
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'ts-loader'
                    }
                ]
            },
            {
                enforce: 'pre',
                test: /\.js$/,
                loader: 'source-map-loader'
            }
        ]
    },
    externals: [
        nodeExternals()
    ],
    watchOptions: {
        poll: 1000
    },
    plugins: [
        new webpack.EnvironmentPlugin(['PORT', 'VK_KEY'])
    ]
}