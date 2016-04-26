import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
// webpack
import path from 'path';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import config from './webpack.config';
require('es6-promise').polyfill();
require('isomorphic-fetch');

const app = express();

const port = isProduction ? process.env.PORT : 3000;
const isProduction = process.env.NODE_ENV === 'production';


if (!isProduction) {
    let compiler = webpack(config);
    let webpackMiddleware = webpackDevMiddleware(compiler, {
        publicPath: config.output.publicPath,
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
    app.get('*', function response(req, res) {
        res.write(webpackMiddleware.fileSystem.readFileSync(path.join(__dirname, 'dist/index.html')));
        res.end();
    });
} else {
    app.use(express.static(__dirname + '/build'));
    app.get('*', function response(req, res) {
        res.sendFile(path.join(__dirname, 'build/index.html'));
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

const server = app.listen(port, function() {

    let host = server.address().address;
    let port = server.address().port;

    var envString = isProduction ? "Production" : "Development";

    console.log(envString + ' server listening at http://%s:%s', host, port);

});


// app.get('/', function (req, res) {
//   res.sendFile(__dirname + '/src/index.html');
// });

