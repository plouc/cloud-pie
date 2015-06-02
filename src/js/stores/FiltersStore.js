var Reflux         = require('reflux');
var FiltersActions = require('./../actions/FiltersActions');
var _              = require('lodash');

var _filters;

module.exports = FilterStore = Reflux.createStore({
    listenables: FiltersActions,

    setData(data) {
        _filters = {
            vpc: {
                id: {
                    active:  false,
                    filters: data.vpcs.map(vpc => {
                        return {
                            label:  vpc.tags.name ? vpc.tags.name : vpc.id,
                            active: true,
                            value:  vpc.id
                        }
                    })
                }
            },
            instance: {
                tag: {
                    active:  false,
                    filters: data.instanceTags.map(tag => {
                        return {
                            label:   tag.key,
                            active:  false,
                            filters: tag.values.map(tagValue => {
                                return {
                                    label:  tagValue,
                                    active: true,
                                    value:  tagValue
                                };
                            })
                        };
                    })
                }
            },
            cloudFormation: {
                id: {
                    active:  false,
                    filters: data.cloudFormationStacks.map(stack => {
                        return {
                            label:  stack.name,
                            active: true,
                            value:  stack.id
                        }
                    })
                }
            }
        };

        this.trigger(_filters);
    },

    selectAll(filter) {
        if (!filter.filters) { return; }
        filter.filters.forEach(filter => { filter.active = true; });
        this.trigger(_filters);
    },

    selectNone(filter) {
        if (!filter.filters) { return; }
        filter.filters.forEach(filter => { filter.active = false; });
        this.trigger(_filters);
    },

    toggle(filter) {
        filter.active = !filter.active;
        this.trigger(_filters);
    }
});