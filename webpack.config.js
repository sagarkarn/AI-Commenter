const path = require('path');
const Dotenv = require('dotenv-webpack');
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
    entry: {
        content: path.resolve(__dirname, 'src', 'content.ts'),
        background: path.resolve(__dirname, 'src', 'background.ts'),
        popup: path.resolve(__dirname, 'src', 'popup.ts')
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js'
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },
    plugins: [
        new Dotenv(),
        new CopyPlugin({
            patterns: [
                { from: "src/index.html", to: "index.html" },
                { from: "manifest/manifest.json", to: "manifest.json" },
                { from: "static/**/*"},
            ]
        }),
    ],
};