import d3     from 'd3/d3';
import layout from './../Layout';

export default function (clickHandler) {
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
                var volumeEl = d3.select(this)
                    .on('click', d => {
                        clickHandler('volume', d);
                    })
                ;

                volumeEl.append('rect')
                    .attr('class', 'volume__wrapper')
                    .attr('width',  layout.volume.size)
                    .attr('height', layout.volume.size)
                    .attr({ rx: layout.volume.borderRadius, ry: layout.volume.borderRadius })
                ;

                volumeEl.append('text')
                    .attr('class', 'volume__label__text')
                    .attr('text-anchor', 'middle')
                    .attr('x', layout.volume.size / 2)
                    .attr('y', 17)
                    .text(volume.ebs.ebs.size)
                ;
            })
        ;

        volumes
            .attr('class', volume => `volume${ volume.active ? ' _is-active' : '' }`)
        ;
    };
}
