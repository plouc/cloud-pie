angular.module('kumononaka', [
        'ngRoute',
        'restangular'
    ])
    .config(['RestangularProvider', function (RestangularProvider) {
        RestangularProvider.setBaseUrl('/api/');
    }])
    .run([function () {
    }])
;