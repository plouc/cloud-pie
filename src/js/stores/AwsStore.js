var Reflux         = require('reflux');
var AwsActions     = require('./../actions/AwsActions');
var FiltersActions = require('./../actions/FiltersActions');
var FiltersStore   = require('./../stores/FiltersStore');
var request        = require('superagent');
var _              = require('lodash');

var _stack         = null;
var _filteredStack = null;

/**
 * Reset all stack items (active: false)
 */
function resetActive() {
    _filteredStack.vpcs.forEach(vpc => {
        vpc.active = false;
        vpc.subnets.forEach(subnet => {
            subnet.active = false;
            subnet.instances.forEach(instance => {
                instance.active = false;
                instance.blockDeviceMappings.forEach(volume => {
                    volume.active = false;
                });
            });
        });
        vpc.autoscalings.forEach(autoscaling => {
            autoscaling.active = false;
        });
        if (vpc.internetGateway) {
            vpc.internetGateway.active = false;
        }
        vpc.loadBalancers.forEach(lb => {
            lb.active = false;
        });
    });

    _filteredStack.loadBalancers.forEach(lb => {
        lb.active = false;
    });

    _filteredStack.vpcPeerings.forEach(peering => {
        peering.active = false;
    });
}

function filterStack(filters) {
    _filteredStack = _.cloneDeep(_stack);
    resetActive();

    if (filters.vpc.id.active) {
        var vpcIds = [];
        filters.vpc.id.filters.forEach(filter => {
            if (filter.active) {
                vpcIds.push(filter.value);
            }
        });
        _filteredStack.vpcs = _.filter(_filteredStack.vpcs, vpc => {
            return _.includes(vpcIds, vpc.id);
        });
    }

    if (filters.cloudFormation.id.active) {
        var cfStackIds = [];
        filters.cloudFormation.id.filters.forEach(filter => {
            if (filter.active) {
                cfStackIds.push(filter.value);
            }
        });
        _filteredStack.vpcs.forEach(vpc => {
            vpc.subnets.forEach(subnet => {
                subnet.instances = _.filter(subnet.instances, instance => {
                    return _.has(instance.tags, 'aws:cloudformation:stack-id') &&
                           _.includes(cfStackIds, instance.tags['aws:cloudformation:stack-id']);
                });
            });
        });
    }
}

module.exports = AwsStore = Reflux.createStore({
    listenables: AwsActions,

    init() {
        this.listenTo(FiltersStore, this.filter);
    },

    /**
     * Fetch aws data dump.
     */
    fetch() {
        request.get('/aws.json').end((err, res) => {
            if (err) {
                throw err;
            }

            _stack = res.body;

            _stack.vpcs= _stack.vpcs.map(vpc => {
                vpc.subnets = _.filter(vpc.subnets, subnet => subnet.instances.length > 0);
                return vpc;
            });

            _filteredStack = _.cloneDeep(_stack);

            FiltersActions.setData(_stack);

            resetActive();

            this.trigger(_filteredStack);
        });
    },

    /**
     * Activate item for given type.
     *
     * @param {String} type
     * @param {Object} data
     */
    activate(type, data) {
        resetActive();

        switch (type) {
            case 'vpc':
                _filteredStack.vpcs.forEach(vpc => { vpc.active = vpc.id === data.id });
                break;

            case 'instance':
                _filteredStack.vpcs.forEach(vpc => {
                    vpc.subnets.forEach(subnet => {
                        subnet.instances.forEach(instance => {
                            instance.active = instance.id === data.id;
                        });
                    });
                });
                break;

            case 'peering':
                _filteredStack.vpcPeerings.forEach(peering => {
                    peering.active = peering.id === data.id;
                });
                break;

            case 'autoscaling':
                _filteredStack.vpcs.forEach(vpc => {
                    vpc.autoscalings.forEach(autoscaling => {
                        autoscaling.active = autoscaling.name === data.name;
                    });
                });
                break;

            case 'subnet':
                _filteredStack.vpcs.forEach(vpc => {
                    vpc.subnets.forEach(subnet => {
                        subnet.active = subnet.id === data.id;
                    });
                });
                break;

            case 'igw':
                _filteredStack.vpcs.forEach(vpc => {
                    if (vpc.internetGateway) {
                        vpc.internetGateway.active = vpc.internetGateway.id === data.id;
                    }
                });
                break;

            case 'volume':
                _filteredStack.vpcs.forEach(vpc => {
                    vpc.subnets.forEach(subnet => {
                        subnet.instances.forEach(instance => {
                            instance.blockDeviceMappings.forEach(volume => {
                                volume.active = volume.ebs.id === data.ebs.id;
                            });
                        });
                    });
                });
                break;

            case 'lb':
                _filteredStack.vpcs.forEach(vpc => {
                    vpc.loadBalancers.forEach(lb => {
                        lb.active = lb.name === data.name;
                    });
                });
                break;

            default:
                throw `Invalid item type "${ type }"`;
        }

        this.trigger(_filteredStack);
    },

    filter(filters) {
        filterStack(filters);
        this.trigger(_filteredStack);
    }
});