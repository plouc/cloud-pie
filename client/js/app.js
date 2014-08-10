angular.module('cloudpie', [
        'ngRoute',
        'restangular',
        'picardy.fontawesome'
    ])
    .config(['RestangularProvider', function (RestangularProvider) {
        RestangularProvider.setBaseUrl('/api/');
    }])
    .run([function () {
    }])
;