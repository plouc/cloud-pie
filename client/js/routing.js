angular.module('kumononaka')
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.
            when('/', {
                templateUrl: 'views/index.html',
                controller:  'StackCtrl'
            }).
            otherwise({
                redirectTo: '/'
            });
    }])
;
