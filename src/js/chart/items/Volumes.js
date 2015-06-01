var d3     = require('d3/d3');
var layout = require('./../Layout');

module.exports = function (clickHandler) {
    return function () {
        var volumes = this.selectAll('.volume')
            .data(instance => instance.blockDeviceMappings)
        ;

        volumes.enter().append('g')
            .attr('class', 'volume')
            .attr('transform', (volume, i) => {
                return `translate(${ i * layout.volume.size + i * layout.volume.spacing + layout.instance.padding }, ${ layout.instance.size - layout.volume.size - layout.instance.padding })`;
            })
            .each(function (volume) {
                var _this = d3.select(this);

                _this.append('rect')
                    .attr('class', 'volume__wrapper')
                    .attr('width',  layout.volume.size)
                    .attr('height', layout.volume.size)
                    .attr({ rx: layout.volume.borderRadius, ry: layout.volume.borderRadius })
                ;

                _this.append('text')
                    .attr('class', 'volume__label__text')
                    .attr('text-anchor', 'middle')
                    .attr('x', layout.volume.size / 2)
                    .attr('y', 17)
                    .text(volume.ebs.ebs.size)
                ;

                _this.on('click', d => {
                    clickHandler('volume', d);
                });
            })
        ;

        volumes
            .attr('class', volume => `volume${ volume.active ? ' _is-active' : '' }`)
        ;
    };
};
