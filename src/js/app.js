var request = require('superagent');
var d3      = require('d3/d3');
var _       = require('lodash');
var icons   = require('./icons');

var schema  = d3.select('#schema').append('svg')
    .attr('width', 3000)
    .attr('height', 2000)
.append('g')
    .attr('transform', 'translate(30, 30)')
;
var tags    = d3.select('#tags');

function loadData(cb) {
    request.get('aws.json').end((err, res) => { if (err) throw err; cb(res.body); });
}

var layout = {
    vpc:      { spacing: 100, b: { t: 50, r: 20, b: 20, l: 20 } },
    subnet:   { spacing: 15,  b: { t: 35, r: 15, b: 10, l: 15 } },
    instance: { size: 120, spacing: 10 }
};

var instancePadding   = 8;
var instanceStateSize = 8;
var volumeSize        = 32;
var volumeSpacing     = 6;


function drawSchema(vpcs) {

    vpcs.forEach(vpc => {
        vpc.subnets      = vpc.subnets.filter(d => d.instances.length > 0);
        vpc.maxInstances = _.max(vpc.subnets, subnet => subnet.instances.length).instances.length;
    });

    var vpcs = schema.selectAll('.vpc').data(vpcs);
    var vpcX = 0;
    vpcs.enter().append('g')
        .attr('class', 'vpc')
        .attr('transform', (d, i) => {
            var x = vpcX;
            vpcX += d.maxInstances * layout.instance.size + (d.maxInstances - 1) * layout.instance.spacing + layout.vpc.spacing + layout.vpc.b.l + layout.vpc.b.r + layout.subnet.b.l + layout.subnet.b.r;

            return `translate(${ x }, 0)`;
        })
        .each(function (d) {
            var vpc = d3.select(this);

            vpc.append('rect')
                .attr('class', 'vpc__wrapper')
                .attr('width', d.maxInstances * layout.instance.size + (d.maxInstances - 1) * layout.instance.spacing + layout.vpc.b.l + layout.vpc.b.r + layout.subnet.b.l + layout.subnet.b.r)
                .attr('height', d.subnets.length * layout.instance.size + d.subnets.length * (layout.subnet.b.t + layout.subnet.b.b + layout.subnet.spacing) - layout.subnet.spacing + layout.vpc.b.t + layout.vpc.b.b)
                .attr({ rx: 5, ry: 5 })
            ;

            vpc.append('rect')
                .attr('class', 'vpc__label__background')
                .attr('width', 200)
                .attr('height', 36)
                .attr('x', layout.vpc.b.l)
                .attr('y', -18)
                .attr({ rx: 2, ry: 2 })
            ;

            vpc.append('text')
                .attr('class', 'vpc__label__text')
                .attr('x', layout.vpc.b.l + 10)
                .attr('y', 4)
                .text(d.id)
            ;

            if (d.internetGateway !== null) {
                //icons.igw(vpc);
            }
        })
    ;

    var subnets = vpcs.selectAll('.subnets').data(d => d.subnets);
    subnets.enter().append('g')
        .attr('class', 'subnet')
        .attr('transform', (d, i) => {
            return `translate(${ layout.vpc.b.l }, ${ i * (layout.instance.size + layout.subnet.b.t + layout.subnet.b.b) + i * layout.subnet.spacing + layout.vpc.b.t})`;
        })
        .each(function (d) {
            var subnet       = d3.select(this);
            var maxInstances = d3.select(this.parentNode).datum().maxInstances;

            subnet.append('rect')
                .attr('class', 'subnet__wrapper')
                .attr('width', maxInstances * layout.instance.size + (maxInstances - 1) * layout.instance.spacing + layout.subnet.b.l + layout.subnet.b.r)
                .attr('height', layout.instance.size + layout.subnet.b.t + layout.subnet.b.b)
                .attr({ rx: 3, ry: 3 })
            ;

            subnet.append('rect')
                .attr('class', 'vpc__label__background')
                .attr('width', 140)
                .attr('height', 28)
                .attr('x', layout.subnet.b.l)
                .attr('y', -14)
                .attr({ rx: 2, ry: 2 })
            ;

            subnet.append('text')
                .attr('class', 'subnet__label__text')
                .attr('x', layout.subnet.b.l + 10)
                .attr('y', 4)
                .text(d.id)
            ;
        })
    ;

    var instances = subnets.selectAll('.instance').data(d => d.instances);
    instances.enter().append('g')
        .attr('transform', (d, i) => {
            return `translate(${ i * layout.instance.size + i * layout.instance.spacing + layout.subnet.b.l }, ${ layout.subnet.b.t })`;
        })
        .attr('class', 'instance')
        .each(function (d) {
            var instance = d3.select(this);
            instance.append('rect')
                .attr('class', 'instance__wrapper')
                .attr('width',  layout.instance.size)
                .attr('height', layout.instance.size)
                .attr({ rx: 3, ry: 3 })
            ;

            instance.append('circle')
                .attr('class', `instance__state instance__state--${ d.state }`)
                .attr('r', instanceStateSize / 2)
                .attr('cx', 12)
                .attr('cy', 15)
            ;

            instance.append('text')
                .attr('class', 'instance__name')
                .attr('x', 24)
                .attr('y', 20)
                .text(d.id)
            ;
        })
    ;

    var volumes = instances.selectAll('.volume').data(d => d.blockDeviceMappings);
    volumes.enter().append('g')
        .attr('class', 'volume')
        .attr('transform', (d, i) => {
            return `translate(${ i * volumeSize + i * volumeSpacing + instancePadding }, ${ layout.instance.size - volumeSize - instancePadding })`;
        })
        .each(function (d) {
            var volume = d3.select(this);
            volume.append('rect')
                .attr('class', 'volume__wrapper')
                .attr('width',  volumeSize)
                .attr('height', volumeSize)
                .attr({ rx: 2, ry: 2 })
            ;

            volume.append('text')
                .attr('class', 'volume__label__text')
                .attr('text-anchor', 'middle')
                .attr('x', volumeSize / 2)
                .attr('y', 17)
                .text(d.ebs.ebs.size)
            ;
        })
    ;
}

loadData((data) => {
    drawSchema(data.vpcs);
});


