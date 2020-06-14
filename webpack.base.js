const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');

module.exports = {
    entry:{
        main: './src/index.js'
    },
    output:{
        filename: './script/[name].[hash:5].js'
    },
    module:{
        rules:[
            {
                test: /\.less$/,
                use:['style-loader', 'css-loader', 'less-loader']
            },
            {
                test:/(\.png)|(\.jpg)|(\.jpeg)|(\.jfif)/,
                use:['url-loader']
            }
        ]
    },
    plugins:[
        new CleanWebpackPlugin(),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from:'./public',
                    to: './'
                }
            ],
            options: {
                
            }
        }),
        new HtmlWebpackPlugin({
            template: './public/index.html',
            filename: 'index.html',
            chunks: ['main']
        }),
        new webpack.HotModuleReplacementPlugin()
    ]
}