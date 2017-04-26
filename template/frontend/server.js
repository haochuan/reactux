var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var favicon = require('serve-favicon');
var compression = require('compression');
// webpack
var path = require('path');
var webpack = require('webpack');
var webpackDevMiddleware = require('webpack-dev-middleware');
var webpackHotMiddleware = require('webpack-hot-middleware');
var webpackConfig = require('./webpack.config');
var historyApiFallback = require('connect-history-api-fallback');
var app = express();
var routes = require('./routes');

app.use(compression());
app.use(morgan('tiny'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(favicon(__dirname + '/favicon.ico'));

var isProduction = process.env.NODE_ENV === 'production';
var port = isProduction ? process.env.PORT : 3000;

if (isProduction) {
  app.use(express.static(path.join(__dirname, '/build')));
  app.get('*', function response(req, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
  });
} else {
  var compiler = webpack(webpackConfig);
  var webpackMiddleware = webpackDevMiddleware(compiler, {
    publicPath: webpackConfig.output.publicPath,
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
  // =========================
  //   // use historyApiFallback so that routing in SPA works (YO)
  app.use(
    historyApiFallback({
      verbose: false
    })
  );
  // =========================
  app.use(webpackMiddleware);
  app.use(webpackHotMiddleware(compiler));
  app.get('/', function response(req, res) {
    res.write(
      webpackMiddleware.fileSystem.readFileSync(
        path.join(__dirname, './dist/index.html')
      )
    );
    res.end();
  });
}

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

const server = app.listen(port, function() {
  var host = server.address().address;
  var port = server.address().port;

  var envString = isProduction ? 'Production' : 'Development';

  console.log(envString + ' server listening at http://%s:%s', host, port);
});

app.use('/', routes);

// app.get('/', function (req, res) {
//   res.sendFile(__dirname + '/src/index.html');
// });
