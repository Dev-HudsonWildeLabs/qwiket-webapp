var webpack = require("webpack");
var config = require("./webpack.client.js");

var hostname = process.env.WEBPACK_HOSTNAME || "localhost";

config.cache = true;
config.debug = true;
config.devtool = "source-map";

config.entry.unshift(
	"webpack-dev-server/client?http://" + hostname + ":8080/",
	"webpack/hot/only-dev-server"
);

config.output.publicPath = "http://" + hostname + ":8080/";
config.output.hotUpdateMainFilename = "update/[hash]/update.json";
config.output.hotUpdateChunkFilename = "update/[hash]/[id].update.js";

config.plugins = [
	new webpack.DefinePlugin({__CLIENT__: true, __SERVER__: false}),
	new webpack.HotModuleReplacementPlugin(),
	new webpack.NoErrorsPlugin()
];

config.module = {
	loaders: [
		{include: /\.json$/, loaders: ["json-loader"]},
		{include: /\.js$/, loaders: ["react-hot", "babel-loader?stage=0&optional=runtime&plugins=typecheck"], exclude: /node_modules/},
		{include: /\.jsx$/, loaders: ["react-hot", "babel-loader?stage=0&optional=runtime&plugins=typecheck"], exclude: /node_modules/}
	]
};

config.devServer = {
	publicPath:  "http://" + hostname + ":8080/dist/",
	contentBase: "./static",
	hot:         false,
	inline:      true,
	lazy:        false,
	quiet:       true,
	noInfo:      false,
	headers:     {"Access-Control-Allow-Origin": "*"},
	stats:       {colors: true},
	host:        hostname
};

module.exports = config;
