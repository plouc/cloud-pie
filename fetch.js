var fs    = require('fs');
var stack = require('./server/lib/aws/stack');
var chalk = require('chalk');

var filePath = 'dist/aws.json';

stack.fetch().then(function (data) {
    fs.writeFile(filePath, JSON.stringify(data, null, '    '), function (err) {
        if (err) {
            throw err;
        }

        console.log(chalk.green('\n> data saved to %s.\n'), filePath);
    });
});