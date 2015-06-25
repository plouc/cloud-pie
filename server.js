'use strict';

var express = require('express');
var app     = express();
var router  = express.Router();
var fs      = require('fs');
var stack   = require('./server/lib/aws/stack');

var awsFilePath = 'dist/aws.json';

router.use(function (req, res, next) {
    console.log('%s %s %s', req.method, req.url, req.path);
    next();
});

router.get('/fetch', function (req, res) {
    stack.fetch()
        .then(function (data) {
            fs.writeFile(awsFilePath, JSON.stringify(data, null, '    '), function (err) {
                if (err) { throw err; }

                res.send(data);
            });
        })
    ;
});

app.use('/', router);

app.use(express.static(__dirname + '/dist'));

app.listen(3000, function () {
    console.log('application listening on port 3000');
});
