const path = require('path');

module.exports = {
    mode: process.env.NODE_ENV || "production",
    entry: './front_src/index.jsx',
    output: {
        path: path.resolve(__dirname, 'public/js/')
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                loader: 'babel-loader',
                exclude: /(node_modules)/,
                options: {
                    presets: ['@babel/react'],
                    plugins: ['@babel/plugin-proposal-class-properties']
                },
            }
        ],
    },
    resolve: {
        modules: ['src', 'node_modules'],
        extensions: ['*', '.js', '.jsx', '.css', '.scss'],
    },
};