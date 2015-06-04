var Promise = require('bluebird');
var AWS     = require('aws-sdk');
var chalk   = require('chalk');
var utils   = require('./utils');

var cloudFormation = new AWS.CloudFormation();

module.exports.stacks = function () {
    var def = Promise.defer();

    cloudFormation.describeStacks({}, function (err, data) {
        if (err) {
            def.reject(err);
        } else {
            console.log(chalk.yellow('- fetched cloud formation stacks'));
            /* {
             Parameters: [Object],
             NotificationARNs: [],
             Capabilities: [],
             Outputs: []
             } */
            def.resolve(data.Stacks.map(function (stack) {
                return {
                    id:              stack.StackId,
                    name:            stack.StackName,
                    description:     stack.Description,
                    createdAt:       stack.CreationTime,
                    status:          stack.StackStatus,
                    disableRollback: stack.DisableRollback,
                    tags:            utils.tagsToObject(stack.Tags)
                };
            }));
        }
    });

    return def.promise;
};
