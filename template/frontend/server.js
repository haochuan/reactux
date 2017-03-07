var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var favicon = require('serve-favicon');
var compression = require('compression');
// webpack
var path = require('path');
require('es6-promise').polyfill();
require('isomorphic-fetch');

var app = express();

app.use(compression());
app.use(favicon(__dirname + '/favicon.ico'));

var port = isProduction ? process.env.PORT : 3000;
var isProduction = process.env.NODE_ENV === 'production';

app.use(express.static(path.join(__dirname, '/build')));
app.get('*', function response(req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

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

// app.get('/', function (req, res) {
//   res.sendFile(__dirname + '/src/index.html');
// });
