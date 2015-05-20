var fs    = require('fs');
var stack = require('./server/lib/stack');

stack.fetch().then(function (data) {
    fs.writeFile('dist/aws.json', JSON.stringify(data, null, '    '), function (err) {
        if (err) {
            throw err;
        }

        console.log('saved AWS data.');
    });
});