angular.module('kumononaka').factory('StackService', [
    'Restangular',
    function (
        Restangular
        ) {
        'use strict';

        var stack = Restangular.all('stack');

        return {
            get: function () {
                return stack.customGET('');
            }
        };
    }
]);