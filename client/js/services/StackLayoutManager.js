angular.module('cloudpie').factory('StackLayoutManager', [
    function (
    ) {
        'use strict';


        function Surface(x, y, width, height) {
            this.x = x || 0;
            this.y = y || 0;

            this.width  = width  || 0;
            this.height = height || 0;

            this.children = [];
        }

        Surface.distributeHorizontally = function (surfaces, spacing) {
            if (!surfaces.length) { return; }

            var x = 0;
            surfaces.forEach(function (surface) {
                surface.x = x;
                x += surface.width + spacing;
            });
        };

        Surface.distributeVertically = function (surfaces, spacing) {
            if (!surfaces.length) { return; }

            var y = 0;
            surfaces.forEach(function (surface) {
                surface.y = y;
                y += surface.height + spacing;
            });
        };

        Surface.prototype = {
            size: function (width, height) {
                this.width  = width  || this.width;
                this.height = height || this.height;

                return this;
            },

            move: function (x, y) {
                this.x = x || this.x;
                this.y = y || this.y;

                return this;
            },

            distributeChildrenHorizontally: function (spacing) {
                Surface.distributeHorizontally(this.children, spacing);

                return this;
            },

            distributeChildrenVertically: function (spacing) {
                Surface.distributeVertically(this.children, spacing);

                return this;
            }
        };






        var baseUnit           = 120;
        var baseSpacing        = 26;
        var loadBalancerOffset = 8;

        var computeLayout = function (stack) {

            var vpcX = 0;
            _.forOwn(stack.vpcs, function (vpc) {
                var colCount = Math.round(Math.sqrt(vpc.instances.length));
                var rowCount = Math.ceil(vpc.instances.length / colCount);

                vpc.style = {
                    x:      vpcX,
                    y:      0,
                    width:  (baseSpacing + baseUnit * colCount + baseSpacing * colCount),
                    height: (baseSpacing + baseUnit * rowCount + baseSpacing * rowCount),
                };

                var col = 0, row = 0;
                vpc.instances.forEach(function (instanceId) {
                    stack.instances[instanceId].style = {
                        width:  baseUnit,
                        height: baseUnit,
                        x:   (baseSpacing + vpcX + col * baseUnit + baseSpacing * col),
                        y:    (baseSpacing + row * baseUnit + baseSpacing * row)
                    };

                    if (col < colCount - 1) {
                        col++;
                    } else {
                        col = 0;
                        row++;
                    }
                });

                vpcX += baseUnit * colCount + baseSpacing * (colCount + 2);

                vpc.visible = true;
            });

            _.forOwn(stack.loadBalancers, function (loadBalancer) {
                var lbLeft   = false;
                var lbRight  = 0;
                var lbTop    = false;
                var lbBottom = 0;
                loadBalancer.instances.forEach(function (instanceId) {
                    if (stack.instances[instanceId]) {
                        var instance = stack.instances[instanceId];

                        if (lbTop === false || lbTop > instance.style.y) {
                            lbTop = instance.style.y;
                        }
                        if (lbLeft === false || lbLeft > instance.style.x) {
                            lbLeft = instance.style.x;
                        }

                        if (instance.style.x + instance.style.width > lbRight) {
                            lbRight = instance.style.x + instance.style.width;
                        }
                        if (instance.style.y + instance.style.height > lbBottom) {
                            lbBottom = instance.style.y + instance.style.height;
                        }
                    }
                });

                loadBalancer.style = {
                    x:      lbLeft - loadBalancerOffset,
                    y:      lbTop - loadBalancerOffset,
                    width:  lbRight - lbLeft + loadBalancerOffset * 2,
                    height: lbBottom - lbTop + loadBalancerOffset * 2
                };

                loadBalancer.visible = true;
            });

            _.forOwn(stack.instances, function (instance) {
                instance.visible = true;
            });

            console.log(stack);
        };

        return {
            compute: computeLayout
        };
    }
]);