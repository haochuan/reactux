var express = require('express');
var authRouter = require('./auth');

var router = express.Router();

router.route('/auth/login').post(authRouter.login);
router.route('/auth/verify').post(authRouter.verify);

module.exports = router;
