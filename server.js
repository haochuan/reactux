var express = require('express');
var fs = require('fs');
var app = express();
var bodyParser   = require('body-parser');

var router = express.Router({
    caseSensitive: app.get('case sensitive routing'),
    strict       : app.get('strict routing')
});

// Parse application/json
app.use(bodyParser.json());

app.use(router);

app.use(express.static('dist', __dirname + '/dist'));

var server = app.listen(3000, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('Server listening at http://%s:%s', host, port);

});

router.get('/', function (req, res) {
  res.sendfile('dist/index.html');
});

router.get('/data', function (req, res) {
    var data = fs.readFileSync('data/data.json');
    res.json(JSON.parse(data));
});
