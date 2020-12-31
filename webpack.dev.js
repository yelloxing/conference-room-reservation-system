const merge = require('webpack-merge');
const common = require('./webpack.config.js');
const webpack = require('webpack');

module.exports = merge(common, {
    devtool: "inline-source-map",
    devServer: {
        contentBase: './',
        compress: false,
        host: '0.0.0.0',
        port: '20000',
        hot: true,
        inline: true,
        historyApiFallback: true,
        proxy: {
            "/_apigateway": {
                target: " http://218.94.154.34:54392/",// 目标代理接口地址
                // target: "http://218.94.154.34:12344/", // 目标代理接口地址
                // changeOrigin: true, // 开启代理，在本地创建一个虚拟服务端
                // pathRewrite: {
                //   "^/_apigateway": "/esites/_apigateway"
                // }
              },
            "/_fileup":{
                target: "http://218.94.154.34:54392/", // 目标代理接口地址
                // target: "http://218.94.154.34:12344/", // 目标代理接口地址
                // pathRewrite: {
                //     "^/_fileup": "/esites/_fileup"
                //   }
            }
        },
        watchOptions: {
            poll: true,
            ignored: /node_modules/,
            aggregateTimeout: 300
        }
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NamedModulesPlugin()
    ],
    mode: 'development'
});
