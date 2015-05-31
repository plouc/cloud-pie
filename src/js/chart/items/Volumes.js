var d3     = require('d3/d3');
var layout = require('./../Layout');

module.exports = function (clickHandler) {
    return function () {
        var volumes = this.selectAll('.volume')
            .data(d => d.blockDeviceMappings)
        ;

        volumes.enter().append('g')
            .attr('class', 'volume')
            .attr('transform', (d, i) => {
                return `translate(${ i * layout.volume.size + i * layout.volume.spacing + layout.instance.padding }, ${ layout.instance.size - layout.volume.size - layout.instance.padding })`;
            })
            .each(function (d) {
                var volume = d3.select(this);
                volume.append('rect')
                    .attr('class', 'volume__wrapper')
                    .attr('width',  layout.volume.size)
                    .attr('height', layout.volume.size)
                    .attr({ rx: layout.volume.borderRadius, ry: layout.volume.borderRadius })
                ;

                volume.append('text')
                    .attr('class', 'volume__label__text')
                    .attr('text-anchor', 'middle')
                    .attr('x', layout.volume.size / 2)
                    .attr('y', 17)
                    .text(d.ebs.ebs.size)
                ;

                volume.on('click', d => {
                    clickHandler('volume', d);
                });
            })
        ;
    };
};
