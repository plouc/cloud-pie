var express = require('express');
var app     = express();
var router  = express.Router();

router.use(function (req, res, next) {
    console.log('%s %s %s', req.method, req.url, req.path);
    next();
});

app.use('/', router);

app.use(express.static(__dirname + '/dist'));

app.listen(3000, function () {
    console.log('application listening on port 3000');
});