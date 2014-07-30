var express        = require('express');
var bodyParser     = require('body-parser');
var methodOverride = require('method-override');
var app            = express();
var router         = express.Router();
var stack          = require('./lib/stack');

router.use(function (req, res, next) {
    console.log('%s %s %s', req.method, req.url, req.path);
    next();
});

router.get('/api/stack', function (req, res) {
    stack.fetch().then(function (data) {
        res.send(data);
    });
});

app.use(bodyParser());

app.use('/', router);

app.use(express.static(__dirname + '/../client'));

app.listen(3000, function () {
    console.log('application listening on port 3000');
});