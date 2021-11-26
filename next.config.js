const { hostApi } = require('./src/config/constrant');
const withAntdLess = require('next-plugin-antd-less');
const webpack = require('webpack');
module.exports = withAntdLess({
	// basePath: "/admin",
	images: {
		domains: [hostApi],
	},
	// optional
	modifyVars: {
		'@primary-color': '#00bcd4',
		'@border-radius-base': '.5rem',
		'@box-shadow-base': 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
		'@link-color': 'inherit',
	},
	// optional
	lessVarsFilePath: './src/assets/antd-custom.less',
	// // optional
	lessVarsFilePathAppendToEndOfContent: false,
	// // optional https://github.com/webpack-contrib/css-loader#object
	// cssLoaderOptions: {},

	webpack: (config, options) => {
		config.plugins.push(
			new webpack.ProvidePlugin({
				'window.Quill': 'quill/dist/quill.js',
				Quill: 'quill/dist/quill.js',
			})
		);
		return config;
	},
	eslint: {
		dirs: ['pages', 'src'], // Only run ESLint on the 'pages' and 'utils' directories during production builds (next build)
	},
});
