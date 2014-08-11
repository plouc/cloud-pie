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
        var baseSpacing        = 50;
        var loadBalancerOffset = 16;

        var computeLayout = function (stack, sgLinks) {

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
                instance.sgLinks   = [];
                instance.showLinks = false;
                instance.securityGroups.forEach(function (sgId) {
                    if (sgLinks[sgId]) {
                        sgLinks[sgId].forEach(function (rel) {
                            _.forOwn(stack.instances, function (subInstance) {
                                if (subInstance.id != instance.id) {
                                    if (_.contains(subInstance.securityGroups, sgId)) {

                                        var ax = instance.style.x;
                                        var ay = instance.style.y;
                                        var bx = subInstance.style.x;
                                        var by = subInstance.style.y;

                                        var angle = Math.atan2(by - ay, bx - ax) * 180 / Math.PI;

                                    /*

                                         A
                                         |
                                       -90
                                         |
                                 <– 180 –+— 0 ->
                                         |
                                        90
                                         |
                                         V

                                     */

                                        var path;

                                        // RIGHT
                                        if (angle <= 45 && angle >= -45) {
                                            ax += instance.style.width;
                                            ay += instance.style.height / 2;
                                            by += subInstance.style.height / 2;

                                            path = 'M ' + ax + ',' + ay;
                                            path = path + ' C ' + bx + ',' + ay;
                                            path = path + ' ' + ax + ',' + by;
                                            path = path + ' ' + bx + ',' + by;

                                        // BOTTOM
                                        } else if (angle > 45 && angle <= 135) {
                                            ax += instance.style.width / 2;
                                            ay += instance.style.height;
                                            bx += subInstance.style.width / 2;

                                            path = 'M ' + ax + ',' + ay;
                                            path = path + ' C ' + ax + ',' + by;
                                            path = path + ' ' + bx + ',' + ay;
                                            path = path + ' ' + bx + ',' + by;

                                        // LEFT
                                        } else if (angle > 135 || angle <= -135) {
                                            ay += instance.style.height / 2;
                                            bx += subInstance.style.width;
                                            by += subInstance.style.height / 2;

                                            path = 'M ' + ax + ',' + ay;
                                            path = path + ' C ' + bx + ',' + ay;
                                            path = path + ' ' + ax + ',' + by;
                                            path = path + ' ' + bx + ',' + by;

                                        // TOP
                                        } else {
                                            ax += instance.style.width / 2;
                                            bx += subInstance.style.width / 2;
                                            by += subInstance.style.height;

                                            path = 'M ' + ax + ',' + ay;
                                            path = path + ' C ' + ax + ',' + by;
                                            path = path + ' ' + bx + ',' + ay;
                                            path = path + ' ' + bx + ',' + by;
                                        }

                                        instance.sgLinks.push({
                                            a: { x: ax, y: ay },
                                            b: { x: bx, y: by },
                                            path: path
                                        });
                                    }
                                }
                            });
                        });
                    }
                });

                instance.visible = true;
            });

            console.log(stack);
        };

        return {
            compute: computeLayout
        };
    }
]);