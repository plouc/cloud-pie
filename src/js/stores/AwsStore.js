/* @flow */
import Reflux         from 'reflux';
import AwsActions     from './../actions/AwsActions';
import FiltersActions from './../actions/FiltersActions';
import FiltersStore   from './../stores/FiltersStore';
import request        from 'superagent';
import _              from 'lodash';

var currentStack         = {
    vpcs:          [],
    loadBalancers: [],
    vpcPeerings:   []
};
var currentFilteredStack = currentStack;

/**
 * Reset all stack items (active: false)
 */
function resetActive() {
    currentFilteredStack.vpcs.forEach(vpc => {
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

    currentFilteredStack.loadBalancers.forEach(lb => {
        lb.active = false;
    });

    currentFilteredStack.vpcPeerings.forEach(peering => {
        peering.active = false;
    });
}

function filterStack(filters) {
    currentFilteredStack = _.cloneDeep(currentStack);
    resetActive();

    if (filters.vpc.id.active) {
        var vpcIds = [];
        filters.vpc.id.filters.forEach(filter => {
            if (filter.active) {
                vpcIds.push(filter.value);
            }
        });
        currentFilteredStack.vpcs = _.filter(currentFilteredStack.vpcs, vpc => {
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
        currentFilteredStack.vpcs.forEach(vpc => {
            vpc.subnets.forEach(subnet => {
                subnet.instances = _.filter(subnet.instances, instance => {
                    return _.has(instance.tags, 'aws:cloudformation:stack-id') &&
                           _.includes(cfStackIds, instance.tags['aws:cloudformation:stack-id']);
                });
            });
        });
    }
}

export default Reflux.createStore({
    listenables: AwsActions,

    init() {
        this.listenTo(FiltersStore, this.filter);
    },

    /**
     * Fetch aws data dump.
     */
    fetch() {
        request.get('aws.json').end((err, res) => {
            if (err) { throw err; }

            currentStack = res.body;

            currentStack.vpcs = currentStack.vpcs.map(vpc => {
                vpc.subnets = _.filter(vpc.subnets, subnet => subnet.instances.length > 0);
                return vpc;
            });

            currentFilteredStack = _.cloneDeep(currentStack);

            FiltersActions.setData(currentStack);

            resetActive();

            this.trigger(currentFilteredStack);
        });
    },

    /**
     * Activate item for given type.
     *
     * @param {String} type
     * @param {Object} data
     */
    activate(type: string, data: Object) {
        resetActive();

        switch (type) {
            case 'vpc':
                currentFilteredStack.vpcs.forEach(vpc => { vpc.active = vpc.id === data.id; });
                break;

            case 'instance':
                currentFilteredStack.vpcs.forEach(vpc => {
                    vpc.subnets.forEach(subnet => {
                        subnet.instances.forEach(instance => {
                            instance.active = instance.id === data.id;
                        });
                    });
                });
                break;

            case 'peering':
                currentFilteredStack.vpcPeerings.forEach(peering => {
                    peering.active = peering.id === data.id;
                });
                break;

            case 'autoscaling':
                currentFilteredStack.vpcs.forEach(vpc => {
                    vpc.autoscalings.forEach(autoscaling => {
                        autoscaling.active = autoscaling.name === data.name;
                    });
                });
                break;

            case 'subnet':
                currentFilteredStack.vpcs.forEach(vpc => {
                    vpc.subnets.forEach(subnet => {
                        subnet.active = subnet.id === data.id;
                    });
                });
                break;

            case 'igw':
                currentFilteredStack.vpcs.forEach(vpc => {
                    if (vpc.internetGateway) {
                        vpc.internetGateway.active = vpc.internetGateway.id === data.id;
                    }
                });
                break;

            case 'volume':
                currentFilteredStack.vpcs.forEach(vpc => {
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
                currentFilteredStack.vpcs.forEach(vpc => {
                    vpc.loadBalancers.forEach(lb => {
                        lb.active = lb.name === data.name;
                    });
                });
                break;

            default:
                throw `Invalid item type "${ type }"`;
        }

        this.trigger(currentFilteredStack);
    },

    filter(filters) {
        filterStack(filters);
        this.trigger(currentFilteredStack);
    }
});
