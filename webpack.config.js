var webpack = require('webpack');
var copyPlugin = require('copy-webpack-plugin');
require("expose-loader");

var coreConfig = {
    devtool: "source-map",

    resolve: {
        // Add '.ts' and '.tsx' as resolvable extensions.
        extensions: [".ts", ".tsx", ".js", ".json"]
    },

    module: {
        rules: [
            // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
            { test: /\.tsx?$/, loader: "awesome-typescript-loader" },
            // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
            {
                enforce: "pre",
                test: /\.js$/,
                loader: "source-map-loader",
                exclude: [/node_modules/]
            },
            {
                test: require.resolve('microsoft-adaptivecards'),
                use: [{ loader: 'expose-loader', options: 'AdaptiveCards' }]
            }
        ]
    }
};

var chatConfig = {
    entry: "./src/BotChat.ts",
    output: {
        libraryTarget: "umd",
        library: "BotChat",
        filename: "./botchat.js"
    },
    plugins: [
        new copyPlugin([ { from: './src/assets', to: './built/assets' } ])
    ]
}

// Config for addon features
var featureConfig = {
    entry: {
        CognitiveServices: "./src/CognitiveServices/lib.ts"
    },
    output: {
        libraryTarget: "umd",
        library: "[name]",
        filename: "./[name].js",
    }
}

var chatBundle = Object.assign({}, chatConfig, coreConfig); 
chatBundle.plugins = (coreConfig.plugins || []).concat(chatConfig.plugins);

module.exports = [chatBundle, Object.assign(featureConfig, coreConfig)];
