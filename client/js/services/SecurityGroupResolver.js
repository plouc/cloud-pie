angular.module('cloudpie').factory('SecurityGroupResolver', [
    function (
    ) {
        'use strict';

        return {
            buildRelations: function (securityGroups) {

                var relations = {};


                securityGroups.forEach(function (sg) {
                    //console.log('———>', sg.Description, '[' + sg.GroupId + ']');
                    var inRules  = []; //IpPermissions
                    var outRules = []; //IpPermissionsEgress

                    sg.IpPermissions.forEach(function (inPerm) {
                        var r = {
                            proto:    inPerm.IpProtocol,
                            fromPort: inPerm.FromPort,
                            toPort:   inPerm.ToPort,
                            groups:   []
                        };

                        inPerm.UserIdGroupPairs.forEach(function (group) {
                            r.groups.push(group.GroupId);

                            if (!relations[group.GroupId]) {
                                relations[group.GroupId] = [];
                            }
                            relations[group.GroupId].push({
                                groupId:  sg.GroupId,
                                proto:    inPerm.IpProtocol,
                                fromPort: inPerm.FromPort,
                                toPort:   inPerm.ToPort
                            });
                        });

                        //console.log(inPerm.IpProtocol + ': ' + inPerm.FromPort + ' to ' + inPerm.ToPort + ' groups: ' + r.groups.join(', '));
                        inRules.push(r);
                    });

                    //console.log('in', inRules);

                    securityGroups.forEach(function (osg) {
                        if (osg.VpcId === sg.VpcId) {
                            osg.IpPermissions.forEach(function (perm) {
                                var groupMatch = false;
                                perm.UserIdGroupPairs.forEach(function (group) {
                                    if (group.GroupId === sg.GroupId) {
                                        groupMatch = true;
                                    }
                                });

                                if (groupMatch) {
                                    //console.log('match', perm);
                                }
                            });
                        }
                    });
                });

                console.log(relations);

                return relations;
            }
        };
    }
]);