angular.module('cloudpie')
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
