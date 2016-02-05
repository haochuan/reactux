var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var morgan = require('morgan');
// webpack
var path = require('path');
var webpack = require('webpack');
var webpackDevMiddleware = require('webpack-dev-middleware');
var webpackHotMiddleware = require('webpack-hot-middleware');
var config = require('./webpack.config');

var port = isProduction ? process.env.PORT : 3000;
var isProduction = process.env.NODE_ENV === 'production';


if (!isProduction) {
    var compiler = webpack(config);
    var webpackMiddleware = webpackDevMiddleware(compiler, {
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

var server = app.listen(port, function() {

    var host = server.address().address;
    var port = server.address().port;

    console.log('Server listening at http://%s:%s', host, port);

});


// app.get('/', function (req, res) {
//   res.sendFile(__dirname + '/src/index.html');
// });

