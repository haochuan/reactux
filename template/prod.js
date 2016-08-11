/**
 *
 * This is the file to run production server without build process
 * just npm install --production
 * will reduce the file size and time
 *
 */

var express = require('express');
var app = express();
var path = require('path');
var favicon = require('serve-favicon');
var port = process.env.PORT || 3000;

var router = express.Router({
  caseSensitive: app.get('case sensitive routing'),
  strict: app.get('strict routing')
});

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

app.use(favicon(__dirname + "/favicon.ico"));
app.use(express.static('build'));

router.get('/', function(req, res) {
  res.sendFile('index.html');
});

app.listen(port, function () {
  console.log('App is on port ' + port + '!' );
});