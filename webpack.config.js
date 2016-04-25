module.exports = {
    entry: "./src/main.js",
    output: {
        path: 'build/',
        filename: "index.js"
    },
    module: {
        loaders: [
            { test: /\.css$/, loader: 'style-loader!css-loader' },
            { test: /\.hjson$/, loader: "hjson" },
            { test: /\.json$/, loader: "json" },
            {
                test: /\.js$/,
                loader: 'babel', // 'babel-loader' is also a legal name to reference
                cacheDirectory: '.tmp/cache/babel',
                exclude: 'node_modules'
                // query: {
                //     presets: ['es2015']
                // }
            }
        ]
    },
    devtool: 'source-map',
    resolve: {
        root: __dirname,
        extensions: ['', '.webpack.js', '.web.js', '.ts', '.js']
    }
};