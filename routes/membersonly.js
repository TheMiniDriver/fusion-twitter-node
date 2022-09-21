var express = require('express');
var router = express.Router();

/* Pages behind login */
router.get('/', function(req, res, next) {
  res.send('You have reached the super secret members only area! Authenticated: ' + req.isAuthenticated());
});

module.exports = router;
