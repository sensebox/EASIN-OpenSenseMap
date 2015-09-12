angular.module('easinApp')
      .config(function($routeProvider){
    
    $routeProvider.when('/explore',{
        templateUrl: 'views/explore.html'
    })
    
    .when('/',{
        templateUrl: 'index.html'
    })
    
    .otherwise({redirectTo: '/'});
});