var Reflux  = require('reflux');
var Actions = require('./../actions/AwsActions');
var request = require('superagent');

var _stack = null;

function resetActive() {
    _stack.vpcs.forEach(vpc => {
        vpc.active = false;
        vpc.subnets.forEach(subnet => {
            subnet.active = false;
            subnet.instances.forEach(instance => {
                instance.active = false;
            });
        });
        if (vpc.internetGateway) {
            vpc.internetGateway.active = false;
        }
        vpc.loadBalancers.forEach(lb => {
            lb.active = false;
        });
    });

    _stack.loadBalancers.forEach(lb => {
        lb.active = false;
    });

    _stack.vpcPeerings.forEach(peering => {
        peering.active = false;
    });
}

module.exports = AwsStore = Reflux.createStore({
    listenables: Actions,

    fetch() {
        request.get('/aws.json').end((err, res) => {
            if (err) {
                throw err;
            }

            _stack = res.body;
            resetActive();

            this.trigger(_stack);
        });
    },

    activate(type, data) {
        resetActive();

        switch (type) {
            case 'vpc':
                _stack.vpcs.forEach(vpc => { vpc.active = vpc.id === data.id });
                break;

            case 'instance':
                _stack.vpcs.forEach(vpc => {
                    vpc.subnets.forEach(subnet => {
                        subnet.instances.forEach(instance => {
                            instance.active = instance.id === data.id;
                        });
                    });
                });
                break;

            case 'peering':
                _stack.vpcPeerings.forEach(peering => {
                    peering.active = peering.id === data.id;
                });
                break;

            case 'loadBalancer':
                break;

            case 'autoscaling':
                break;

            case 'subnet':
                _stack.vpcs.forEach(vpc => {
                    vpc.subnets.forEach(subnet => {
                        subnet.active = subnet.id === data.id;
                    });
                });
                break;

            case 'igw':
                _stack.vpcs.forEach(vpc => {
                    if (vpc.internetGateway) {
                        vpc.internetGateway.active = vpc.internetGateway.id === data.id;
                    }
                });
                break;

            case 'volume':
                break;

            case 'lb':
                _stack.vpcs.forEach(vpc => {
                    vpc.loadBalancers.forEach(lb => {
                        lb.active = lb.name === data.name;
                    });
                });
                break;

            default:
                throw `Invalid item type "${ type }"`;
        }

        this.trigger(_stack);
    }
});