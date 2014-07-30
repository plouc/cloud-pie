angular.module('kumononaka').controller('StackCtrl', [
    '$scope',
    'StackService',
    'Restangular',
    function (
        $scope,
        StackService,
        Restangular
    ) {
        StackService.get().then(function (stack) {
            console.log(Restangular.stripRestangular(stack));
        });
        $scope.viz = {
            width:  500,
            height: 500
        };
    }
]);