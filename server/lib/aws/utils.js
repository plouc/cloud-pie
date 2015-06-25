'use strict';

var _ = require('lodash');

module.exports = {
    tagsToObject: function (tagsArray) {
        var tags = {};
        tagsArray.forEach(function (tag) {
            tags[tag.Key.toLowerCase()] = tag.Value;
        });

        return tags;
    },

    groupResourceTags: function (resources) {
        var grouped = [];

        resources.forEach(function (resource) {
            _.forOwn(resource.tags, function (tagValue, tagKey) {
                if (!_.find(grouped, { key: tagKey })) {
                    grouped.push({ key: tagKey, values: [] });
                }
                _.find(grouped, { key: tagKey }).values.push(tagValue);
            });
        });

        grouped.forEach(function (tag) {
            tag.values = _.uniq(tag.values);
        });

        return grouped;
    }
};