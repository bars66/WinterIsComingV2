const path = require('path')
const webpack = require('webpack')

module.exports = {
  entry: ["@babel/polyfill", './src/web/client/index.jsx'],
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader',
        options: { presets: ['@babel/env'] }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  resolve: { extensions: ['*', '.js', '.jsx'] },
  output: {
    path: path.resolve(__dirname, 'public/dist/'),
    publicPath: '/public/',
    filename: 'main.bundle.js'
  }
}
