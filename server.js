var express = require('express');
var app = express();

app.use(express.static(__dirname + '/dist'));

var server = app.listen(3000, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('Server listening at http://%s:%s', host, port);

});

app.get('/', function (req, res) {
  res.sendfile('index.html');
});
