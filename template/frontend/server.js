var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var favicon = require('serve-favicon');
// webpack
var path = require('path');
var webpack = require('webpack');
var webpackDevMiddleware = require('webpack-dev-middleware');
var webpackHotMiddleware = require('webpack-hot-middleware');
var config = require('./webpack.config');
require('es6-promise').polyfill();
require('isomorphic-fetch');

var app = express();

var router = express.Router({
  caseSensitive: app.get('case sensitive routing'),
  strict: app.get('strict routing')
});

app.use(favicon(__dirname + '/favicon.ico'));
app.use(router);

var port = isProduction ? process.env.PORT : 3000;
var isProduction = process.env.NODE_ENV === 'production';

if (!isProduction) {
  var compiler = webpack(config);
  var webpackMiddleware = webpackDevMiddleware(compiler, {
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
  router.get('/', function response(req, res) {
    res.write(
      webpackMiddleware.fileSystem.readFileSync(
        path.join(__dirname, 'dist/index.html')
      )
    );
    res.end();
  });
} else {
  app.use(express.static(__dirname + '/build'));
  router.get('/', function response(req, res) {
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
  var host = server.address().address;
  var port = server.address().port;

  var envString = isProduction ? 'Production' : 'Development';

  console.log(envString + ' server listening at http://%s:%s', host, port);
});

// app.get('/', function (req, res) {
//   res.sendFile(__dirname + '/src/index.html');
// });
