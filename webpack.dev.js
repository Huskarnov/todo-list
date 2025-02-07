const {mereg} = require('webpack-merge');
const common = require('./webpack.dev.js');

module.exports =merge(common, {
    mode: "development",

    devtool: "eval-source-map",
    devServer: {
        watchFiles: ["./src/template.html"],
    },
});