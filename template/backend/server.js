import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import favicon from 'serve-favicon';
// webpack
import path from 'path';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import routes from './routes';
import config from '../webpack.config';

const app = express();

// const router = express.Router({
// 	caseSensitive: app.get('case sensitive routing'),
// 	strict: app.get('strict routing')
// });

/*===========================================
=            Baic Authentication            =
===========================================*/

// app.use(require('node-basicauth')({'haochuan': 'password'}));

/*=====  End of Baic Authentication  ======*/


/*===========================
=            COR            =
===========================*/

// app.use(require('cors')());

/*=====  End of COR  ======*/

app.use(morgan('tiny'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(favicon(path.join(__dirname, "../favicon.ico")));
// app.use(router);

const port = isProduction ? process.env.PORT : 3000;
const isProduction = process.env.NODE_ENV === 'production';

if (!isProduction) {
	let compiler = webpack(config);
	let webpackMiddleware = webpackDevMiddleware(compiler, {
		publicPath: config.output.publicPath,
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
	app.use(webpackHotMiddleware(compiler));
	app.get('/', function response(req, res) {
		res.write(webpackMiddleware.fileSystem.readFileSync(path.join(__dirname, '../frontend/dist/index.html')));
		res.end();
	});
} else {
	app.use(express.static(path.join(__dirname, '../frontend/build')));
	app.get('/', function response(req, res) {
		res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
	});
}


const server = app.listen(port, function() {

	let host = server.address().address;
	let port = server.address().port;

	var envString = isProduction ? "Production" : "Development";

	console.log(envString + ' server listening at http://%s:%s', host, port);

});

// Routes
app.use('/', routes);
