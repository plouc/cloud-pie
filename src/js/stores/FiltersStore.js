/* @flow */
import Reflux         from 'reflux';
import FiltersActions from './../actions/FiltersActions';

var currentFilters;

export default Reflux.createStore({
    listenables: FiltersActions,

    setData(data: Object) {
        currentFilters = {
            vpc: {
                id: {
                    id:      'vpc.id',
                    label:   'VPC',
                    active:  false,
                    filters: data.vpcs.map(vpc => {
                        return {
                            label:  vpc.tags.name ? vpc.tags.name : vpc.id,
                            active: true,
                            value:  vpc.id
                        };
                    })
                }
            },
            instance: {
                tag: {
                    id:      'instance.tag',
                    label:   'Instances tags',
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
                    id:      'cloud_formation.id',
                    label:   'CloudFormation stacks',
                    active:  false,
                    filters: data.cloudFormationStacks.map(stack => {
                        return {
                            label:  stack.name,
                            active: true,
                            value:  stack.id
                        };
                    })
                }
            }
        };

        this.trigger(currentFilters);
    },

    selectAll(filter: Object) {
        if (!filter.filters) { return; }
        filter.filters.forEach(f => { f.active = true; });
        this.trigger(currentFilters);
    },

    selectNone(filter: Object) {
        if (!filter.filters) { return; }
        filter.filters.forEach(f => { f.active = false; });
        this.trigger(currentFilters);
    },

    toggle(filter: Object) {
        filter.active = !filter.active;
        this.trigger(currentFilters);
    }
});
