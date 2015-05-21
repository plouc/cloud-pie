module.exports = {
    vpc(el) {
        var vpc = el.append('g').attr('transform', 'translate(-50, -50) scale(0.8)');

        var front = 'vpc__icon__front';
        var left  = 'vpc__icon__left';
        var top   = 'vpc__icon__top';

        vpc.append('polygon').attr('class', front).attr('points', '59.49,55.015 28.627,57.502 28.627,75.312 59.49,66.936');
        vpc.append('polygon').attr('class', front).attr('points', '43.553,49.979 28.512,49.979 28.512,24.703 43.553,28.771');
        vpc.append('polygon').attr('class', front).attr('points', '58.881,49.979 49.961,49.979 49.961,13.979 58.881,18.439');
        vpc.append('polygon').attr('class', front).attr('points', '75.975,49.979 79.783,49.979 79.783,28.891 75.975,26.986');
        vpc.append('polygon').attr('class', front).attr('points', '79.783,37.326 49.961,28.381 49.961,13.979 79.783,28.891');
        vpc.append('polygon').attr('class',  left).attr('points', '34.086,49.979 49.961,49.979 49.961,13.979 34.086,21.916');
        vpc.append('polygon').attr('class',  left).attr('points', '28.512,24.743 20.217,28.932 20.217,50.02 28.512,50.02');
        vpc.append('polygon').attr('class',  left).attr('points', '65.225,49.979 75.975,49.979 75.975,36.184 65.225,37.696');
        vpc.append('polygon').attr('class', front).attr('points', '79.783,56.268 49.961,60.714 49.961,85.979 79.783,71.067');
        vpc.append('polygon').attr('class',  left).attr('points', '34.086,58.42 49.961,60.796 49.961,86.02 34.086,78.082');
        vpc.append('polygon').attr('class',  left).attr('points', '20.217,56.344 28.627,57.583 28.627,75.354 20.217,71.148');
        vpc.append('polygon').attr('class',   top).attr('points', '79.783,56.268 65.443,55.382 34.086,58.38 49.82,60.734');
        vpc.append('polygon').attr('class',   top).attr('points', '59.49,55.015 50.031,54.431 20.217,56.283 28.627,57.543');
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
        var autoscaling = el.append('g').attr('transform', 'translate(-50, -50)');

        var autoscalingFront   = 'autoscaling__icon__front';
        var autoscalingProfile = 'autoscaling__icon__profile';

        autoscaling.append('rect')
            .attr('x', '37.845').attr('y', '33.88')
            .attr('class', autoscalingProfile)
            .attr('width', '4.498').attr('height', '2.545')
        ;
        autoscaling.append('rect')
            .attr('x', '57.474').attr('y', '33.88')
            .attr('class', autoscalingProfile)
            .attr('width', '4.494').attr('height', '2.545')
        ;
        autoscaling.append('polygon')
            .attr('class', autoscalingProfile)
            .attr('points', '57.474,42.032 57.474,44.577 51.388,50.853 51.388,48.306')
        ;
        autoscaling.append('polygon')
            .attr('class', autoscalingProfile)
            .attr('points', '48.69,48.306 48.69,50.853 42.343,44.368 42.343,41.821')
        ;
        autoscaling.append('rect')
            .attr('x', '68.888').attr('y', '54.202')
            .attr('class', autoscalingProfile)
            .attr('width', '10.422').attr('height', '2.547')
        ;
        autoscaling.append('rect')
            .attr('x', '20.69').attr('y', '54.202')
            .attr('class', autoscalingProfile)
            .attr('width', '10.422').attr('height', '2.547')
        ;
        autoscaling.append('polygon')
            .attr('class', autoscalingProfile)
            .attr('points', '68.888,60.292 68.888,62.841 56.653,50.788 56.653,48.241')
        ;
        autoscaling.append('polygon')
            .attr('class', autoscalingFront)
            .attr('points', '31.112,36.333 43.347,48.374 31.112,60.292 31.112,54.202 20.69,54.202 20.69,42.411 31.112,42.411')
        ;
        autoscaling.append('polygon')
            .attr('class', autoscalingProfile)
            .attr('points', '43.347,48.374 43.347,50.919 31.112,62.841 31.112,60.292')
        ;
        autoscaling.append('polygon')
            .attr('class', autoscalingFront)
            .attr('points', '68.888,36.333 68.888,42.425 79.31,42.425 79.31,54.202 68.888,54.202 68.888,60.292 56.653,48.241')
        ;
        autoscaling.append('polygon')
            .attr('class', autoscalingProfile)
            .attr('points', '61.968,63.575 61.968,66.122 49.841,78.267 49.267,75.157')
        ;
        autoscaling.append('polygon')
            .attr('class', autoscalingProfile)
            .attr('points', '49.841,75.718 49.841,78.267 37.845,66.122 37.845,63.575')
        ;
        autoscaling.append('polygon')
            .attr('class', autoscalingFront)
            .attr('points', '49.974,21.733 61.968,33.88 57.474,33.88 57.474,42.032 51.388,48.306 57.474,54.753 57.474,63.575 61.968,63.575 49.841,75.718 37.845,63.575 42.343,63.575 42.343,54.845 48.69,48.306 42.343,41.821 42.343,33.88 37.845,33.88')
        ;
    }
};