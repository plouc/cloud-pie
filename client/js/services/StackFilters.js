angular.module('cloudpie').factory('StackFilters', [
    function (
    ) {
        'use strict';

        var currentStack;
        var filters = {};

        return {
            build: function (stack) {

                currentStack = stack;

                filters.tags = {
                    filter: false,
                    tags:   {}
                };
                _.forOwn(stack.tags, function (tags, tagKey) {
                    filters.tags.tags[tagKey] = {
                        enabled: false,
                        tags:    [
                            { value: 'not tagged', enabled: true }
                        ]
                    };
                    tags.forEach(function (tag) {
                        filters.tags.tags[tagKey].tags.push({
                            value:   tag,
                            enabled: true
                        });
                    });
                });

                filters.vpcs = {
                    filter: false,
                    ids:    {}
                };
                _.forOwn(stack.vpcs, function (vpc) {
                    filters.vpcs.ids[vpc.id] = {
                        enabled: true
                    };
                });

                console.log(filters);

                return filters;
            },

            filter: function () {

                // show all
                _.forOwn(currentStack.instances, function (instance) {
                    instance.visible = true;
                });
                _.forOwn(currentStack.vpcs, function (vpc) {
                    vpc.visible = true;
                });
                _.forOwn(currentStack.loadBalancers, function (loadBalancer) {
                    loadBalancer.visible = true;
                });


                if (filters.tags.filter === true) {
                    var applyTags    = {};
                    var hasTagFilter = false;
                    _.forOwn(filters.tags.tags, function (tagConfig, tag) {
                        if (tagConfig.enabled === true) {
                            hasTagFilter = true;
                            applyTags[tag] = [];
                            tagConfig.tags.forEach(function (tagValue) {
                                if (tagValue.enabled === true) {
                                    applyTags[tag].push(tagValue.value);
                                }
                            });
                        }
                    });

                    if (hasTagFilter) {
                        _.forOwn(currentStack.instances, function (instance) {
                            _.forOwn(applyTags, function (values, tag) {
                                if ((!_.has(instance.tags, tag) && !_.contains(values, 'not tagged'))
                                 || (_.has(instance.tags, tag) && !_.contains(values, instance.tags[tag]))) {
                                    instance.visible = false;
                                }
                            });
                        });
                    }
                }

                if (filters.vpcs.filter === true) {
                    _.forOwn(currentStack.vpcs, function (vpc) {
                        vpc.visible = filters.vpcs.ids[vpc.id].enabled;
                        if (!vpc.visible) {
                            vpc.instances.forEach(function (instanceId) {
                                currentStack.instances[instanceId].visible = false;
                            });
                        }
                    });

                    _.forOwn(currentStack.loadBalancers, function (loadBalancer) {
                        loadBalancer.visible = filters.vpcs.ids[loadBalancer.vpc].enabled;
                    });
                }
            }
        };
    }
]);