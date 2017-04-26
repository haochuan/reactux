var jwt = require('jsonwebtoken');

var SECRET = 'This is a secret';
var EXPIRE_DURATION = 10; // expiration duration for the token

var auth = {
  login: function(req, res) {
    var username = req.body.username;
    var password = req.body.password;
    var payload = {
      username: username,
      password: password
    };

    // hardcoded auth account
    if (username === 'test' && password === 'test') {
      jwt.sign(payload, SECRET, { expiresIn: EXPIRE_DURATION }, function(
        err,
        token
      ) {
        if (err) {
          res.status(500).send(err);
        } else {
          res.status(200).send({ token: token });
        }
      });
    } else {
      res.status(401).send('Unauthorized');
    }
  },

  verify: function(req, res) {
    var token = req.body.token;
    jwt.verify(token, SECRET, function(err, decoded) {
      if (err) {
        res.status(500).send(err);
      } else {
        if (decoded.username === 'test' && decoded.password === 'test') {
          var payload = {
            username: decoded.username,
            password: decoded.password
          };
          jst.sign(payload, SECRET, { expiresIn: EXPIRE_DURATION }, function(
            err,
            token
          ) {
            if (err) {
              res.status(500).send(err);
            } else {
              res.status(200).send({ token: token });
            }
          });
        } else {
          res.status(401).send('Unauthorized');
        }
      }
    });
  }
};

module.exports = auth;
