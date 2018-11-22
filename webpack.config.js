const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const outputDirectory = 'dist';

module.exports = {
	entry: {
		main: './src/client/index.js',
		dashboard: './src/client/dashboard.js'
	},
	output: {
		path: path.join(__dirname, outputDirectory),
		filename: '[name].bundle.js'
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader'
				}
			},
			{
				test: /\.css$/,
				use: ['style-loader', 'css-loader']
			},
			{
				test: /\.(png|woff|woff2|eot|ttf|svg)$/,
				loader: 'url-loader?limit=100000'
			}
		]
	},
	devServer: {
		port: 3000,
		open: true,
		proxy: {
			'/api': 'http://localhost:8080'
		}
	},
	plugins: [
		new CleanWebpackPlugin([outputDirectory]),
		new HtmlWebpackPlugin({
			hash: true,
			title: 'Informatica Validator',
			template: './public/index.html',
			favicon: './public/favicon.ico',
			filename: './index.html',
			chunks: ['main']
		}),
		new HtmlWebpackPlugin({
			hash: true,
			title: 'Informatica Validator - Dashboard',
			template: './public/index.html',
			favicon: './public/favicon.ico',
			filename: './dashboard.html',
			chunks: ['dashboard']
		})
	]
};
