export default {
    vpc(el) {
        var vpc = el.append('g').attr('transform', 'translate(-50, -50)');

        var front  = 'vpc__icon__front';
        var left   = 'vpc__icon__left';
        var top    = 'vpc__icon__top';
        var bottom = 'vpc__icon__bottom';
        var stroke = 'vpc__icon__outline';

        vpc.append('path').attr('class', stroke).attr('d', 'M50,30.1l-8.8,4.4v2.4L38.1,36l-4.6,2.3V50l4.6,0h3.1h5.2H50h4.9v-7.5l3.5,0.8l0,6.8h5.9h2.1V38.3L50,30.1z');
        vpc.append('polygon').attr('class', stroke).attr('points', '55.2,53.3 55.2,52.8 50,52.4 33.6,53.5 33.6,61.7 38.2,64 41.2,63.2 41.2,65.5 50,69.9 66.4,61.6 66.4,53.5 58.5,53');
        vpc.append('polygon').attr('class', front).attr('fill', '#F58536').attr('points', '55.2,52.8 38.2,54.1 38.2,64 55.2,59.4');
        vpc.append('polygon').attr('class', front).attr('fill', '#F58536').attr('points', '46.4,50 38.1,50 38.1,36 46.4,38.3');
        vpc.append('polygon').attr('class', bottom).attr('fill', '#6B3A19').attr('points', '46.7,40.7 53.2,39 64.3,42.4 58.4,43.2');
        vpc.append('polygon').attr('class', front).attr('fill', '#F58536').attr('points', '50,30.1 50,50 54.9,50 54.9,39.5 64.3,42.4 64.3,50 66.4,50 66.4,38.3');
        vpc.append('polygon').attr('class', left).attr('fill', '#9D5025').attr('points', '41.2,50 50,50 50,30.1 41.2,34.5');
        vpc.append('polygon').attr('class', left).attr('fill', '#9D5025').attr('points', '38.1,36 33.6,38.4 33.6,50 38.1,50');
        vpc.append('polygon').attr('class', left).attr('fill', '#9D5025').attr('points', '58.4,50 64.3,50 64.3,42.4 58.4,43.2');
        vpc.append('polygon').attr('class', front).attr('fill', '#F58536').attr('points', '66.4,53.5 50,55.9 50,69.9 66.4,61.6');
        vpc.append('polygon').attr('class', left).attr('fill', '#9D5025').attr('points', '41.2,54.7 50,56 50,69.9 41.2,65.5');
        vpc.append('polygon').attr('class', left).attr('fill', '#9D5025').attr('points', '33.6,53.5 38.2,54.2 38.2,64 33.6,61.7');
        vpc.append('polygon').attr('class', top).attr('fill', '#FBBF93').attr('points', '66.4,53.5 58.5,53 41.2,54.6 49.9,55.9');
        vpc.append('polygon').attr('class', top).attr('fill', '#FBBF93').attr('points', '55.2,52.8 50,52.4 33.6,53.5 38.2,54.2');
    },

    igw(el) {
        var igw = el.append('g').attr('transform', 'translate(-50, -50)');
        igw.append('path')
            .attr('class', 'igw__circle')
            .attr('d', 'M49.993,21.366c15.279,0,27.662,12.277,27.662,27.445c0,15.15-12.383,27.438-27.662,27.438c-15.266,0-27.648-12.287-27.648-27.438C22.345,33.644,34.728,21.366,49.993,21.366z')
        ;
        igw.append('path')
            .attr('class', 'igw__cloud')
            .attr('d', 'M27.06,51.772v-0.73c0-2.982,2.275-6.932,5.635-8.387c0.262-6.508,5.678-11.721,12.295-11.721c4.406,0,8.459,2.359,10.643,6.104c0.846-0.365,1.76-0.555,2.699-0.555c3.357,0,6.133,2.375,6.703,5.566c4.586,0.902,7.904,5.295,7.904,8.992v0.73c0,4.502-4.664,8.451-9.979,8.451H37.04C31.724,60.224,27.06,56.274,27.06,51.772z')
        ;
        igw.append('path')
            .attr('class', 'igw__cloud__inside')
            .attr('d', 'M56.253,40.243l-1.939,1.33l-0.963-2.139c-1.48-3.273-4.762-5.387-8.361-5.387c-2.451,0-4.75,0.951-6.477,2.68c-1.736,1.73-2.689,4.047-2.689,6.498l0.039,1.699l-1.441,0.416c-2.34,0.672-4.227,3.67-4.227,5.701v0.73c0,2.469,2.99,5.34,6.846,5.34h25.92c3.854,0,6.844-2.871,6.844-5.34v-0.73c0-2.484-2.77-5.754-6.006-6.029l-1.736-0.145l-0.057-1.732c-0.064-1.98-1.68-3.539-3.674-3.539C57.585,39.597,56.864,39.819,56.253,40.243z')
        ;
    },

    vpcPeering(el) {
        var vpcPeering = el.append('g').attr('transform', 'scale(0.6)');
        vpcPeering = vpcPeering.append('g').attr('transform', 'translate(-50, -50)');

        vpcPeering.append('circle')
            .attr('class', 'vpc__peering__icon__circle')
            .attr('transform', 'translate(50, 44)')
            .attr('r', 30)
        ;

        vpcPeering.append('line')
            .attr('class', 'vpc__peering__icon__line')
            .attr('stroke-width', 3)
            .attr('fill', 'none')
            .attr('x1', '49.5').attr('y1', '21.697')
            .attr('x2', '49.5').attr('y2', '65.697')
        ;
        vpcPeering.append('polygon').attr('fill', '#fff').attr('points', '46.047,22.697 49.787,16.221 53.527,22.697').attr('class', 'vpc__peering__icon__arrow');
        vpcPeering.append('polygon').attr('fill', '#fff').attr('points', '46.047,64.697 49.787,71.174 53.527,64.697').attr('class', 'vpc__peering__icon__arrow');

        vpcPeering.append('line')
            .attr('class', 'vpc__peering__icon__line')
            .attr('stroke-width', 3)
            .attr('fill', 'none')
            .attr('x1', '28').attr('y1', '45.197')
            .attr('x2', '72').attr('y2', '45.197')
        ;
        vpcPeering.append('polygon').attr('fill', '#fff').attr('points', '29,49.102 22.523,45.361 29,41.621').attr('class', 'vpc__peering__icon__arrow');
        vpcPeering.append('polygon').attr('fill', '#fff').attr('points', '71,49.102 77.477,45.361 71,41.621').attr('class', 'vpc__peering__icon__arrow');

        vpcPeering.append('path')
            .attr('class', 'vpc__peering__icon__cloud')
            .attr('d', 'M59.302,54.179H39.604c-4.035,0-7.58-3.002-7.58-6.422V47.2c0-2.807,2.521-6.146,6.004-6.833c0.434-2.423,2.542-4.229,5.095-4.229c0.712,0,1.409,0.144,2.05,0.422c1.66-2.845,4.741-4.638,8.089-4.638c5.024,0,9.142,3.96,9.342,8.904c2.552,1.106,4.28,4.106,4.28,6.373v0.557C66.884,51.177,63.342,54.179,59.302,54.179z')
        ;
        vpcPeering.append('path')
            .attr('class', 'vpc__peering__icon__cloud__inside')
            .attr('d', 'M43.754,38.959c-1.363,0-2.465,1.065-2.511,2.421l-0.041,1.185l-1.185,0.1c-2.215,0.187-4.107,2.424-4.107,4.122v0.499c0,1.689,2.044,3.653,4.681,3.653h17.724c2.64,0,4.683-1.964,4.683-3.653v-0.499c0-1.389-1.289-3.44-2.892-3.898l-0.985-0.286l0.028-1.159c0-1.679-0.652-3.261-1.841-4.447c-1.18-1.181-2.752-1.83-4.428-1.83c-2.463,0-4.706,1.443-5.72,3.682l-0.655,1.466l-1.329-0.908C44.758,39.111,44.266,38.959,43.754,38.959z')
        ;
    },

    autoscaling(el) {
        var autoscaling = el.append('g')
            .attr('class', 'autoscaling__icon')
            .attr('transform', 'translate(-50, -50)')
        ;

        autoscaling.append('circle').attr('class', 'autoscaling__icon__circle').attr('cx', 50).attr('cy', 50).attr('r', 18);

        var autoscalingFrontClass = 'autoscaling__icon__front';

        autoscaling.append('polygon')
            .attr('class', autoscalingFrontClass)
            .attr('points', '41.1,44.2 46.9,49.8 41.1,55.4 41.1,52.6 36.2,52.6 36.2,47 41.1,47')
        ;
        autoscaling.append('polygon')
            .attr('class', autoscalingFrontClass)
            .attr('points', '58.9,44.2 58.9,47 63.8,47 63.8,52.6 58.9,52.6 58.9,55.4 53.1,49.8')
        ;
        autoscaling.append('polygon')
            .attr('class', autoscalingFrontClass)
            .attr('points', '50,37.3 55.6,43 53.5,43 53.5,46.8 50.7,49.8 53.5,52.8 53.5,57 55.6,57 49.9,62.7 44.3,57 46.4,57 46.4,52.9 49.4,49.8 46.4,46.7 46.4,43 44.3,43')
        ;
    },

    loadBalancer(el) {
        var lb = el.append('g')
            .attr('class', 'lb__icon')
            .attr('transform', 'translate(-50, -50)')
        ;

        lb.append('circle').attr('class', 'lb__icon__background').attr('cx', 50).attr('cy', 50).attr('r', 18);
        lb.append('path').attr('class', 'lb__icon__symbol').attr('d', 'M58.7,45.2h-4.6v-0.9l-1.5,1.8l-0.6-1l-6.5,4.1H51v-1l3.1,1.1v-1.7h4.6v4.6h-4.5v-1.7l-3.1,1.1v-0.9h-5.5l6.5,4.1l0.6-1l1.5,1.9v-1h4.6v4.6h-4.6v-1.9l-3.2-0.8l0.4-0.9l-8-5.2v3.1h-5.2v-7.7h5.2v3.1l8.1-5.2l-0.5-0.9l3.2-0.8v-1.9h4.6V45.2z');
    }
};
