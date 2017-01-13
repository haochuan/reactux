'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _morgan = require('morgan');

var _morgan2 = _interopRequireDefault(_morgan);

var _serveFavicon = require('serve-favicon');

var _serveFavicon2 = _interopRequireDefault(_serveFavicon);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _webpack = require('webpack');

var _webpack2 = _interopRequireDefault(_webpack);

var _webpackDevMiddleware = require('webpack-dev-middleware');

var _webpackDevMiddleware2 = _interopRequireDefault(_webpackDevMiddleware);

var _webpackHotMiddleware = require('webpack-hot-middleware');

var _webpackHotMiddleware2 = _interopRequireDefault(_webpackHotMiddleware);

var _webpack3 = require('./webpack.config');

var _webpack4 = _interopRequireDefault(_webpack3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

require('es6-promise').polyfill();
// webpack

require('isomorphic-fetch');

var app = (0, _express2.default)();

var router = _express2.default.Router({
	caseSensitive: app.get('case sensitive routing'),
	strict: app.get('strict routing')
});

app.use((0, _serveFavicon2.default)(__dirname + "/favicon.ico"));
app.use(router);

var port = isProduction ? process.env.PORT : 3000;
var isProduction = process.env.NODE_ENV === 'production';

if (!isProduction) {
	(function () {
		var compiler = (0, _webpack2.default)(_webpack4.default);
		var webpackMiddleware = (0, _webpackDevMiddleware2.default)(compiler, {
			publicPath: _webpack4.default.output.publicPath,
			quite: true,
			contentBase: 'src',
			stats: {
				colors: true,
				hash: false,
				timings: true,
				chunks: false,
				chunkModules: false,
				modules: false
			}
		});

		app.use(webpackMiddleware);
		app.use((0, _webpackHotMiddleware2.default)(compiler));
		router.get('/', function response(req, res) {
			res.write(webpackMiddleware.fileSystem.readFileSync(_path2.default.join(__dirname, 'frontend/dist/index.html')));
			res.end();
		});
	})();
} else {
	app.use(_express2.default.static(__dirname + '/frontend/build'));
	router.get('/', function response(req, res) {
		res.sendFile(_path2.default.join(__dirname, 'frontend/build/index.html'));
	});
}

// var router = express.Router({
//     caseSensitive: app.get('case sensitive routing'),
//     strict: app.get('strict routing')
// });

// Parse application/json
// app.use(bodyParser.json());

/*===========================================
=            Baic Authentication            =
===========================================*/

// app.use(require('node-basicauth')({'haochuan': 'password'}));

/*=====  End of Baic Authentication  ======*/

/*====================================
=            Basic Logger            =
====================================*/

// app.use(morgan('tiny'));

/*=====  End of Basic Logger  ======*/

/*===========================
=            COR            =
===========================*/

// app.use(require('cors')());

/*=====  End of COR  ======*/

// app.use(router);

// app.use(express.static('dist'));

var server = app.listen(port, function () {

	var host = server.address().address;
	var port = server.address().port;

	var envString = isProduction ? "Production" : "Development";

	console.log(envString + ' server listening at http://%s:%s', host, port);
});

// app.get('/', function (req, res) {
//   res.sendFile(__dirname + '/src/index.html');
// });
//# sourceMappingURL=server.js.map