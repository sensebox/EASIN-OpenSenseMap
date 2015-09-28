angular.module('easinApp',['ngMaterial','ngRoute','leaflet-directive','ngResource'])
      .config(function($routeProvider){
    
    $routeProvider.when('/explore',{
        templateUrl: 'views/explore.html',
         controller: 'mapCtrl'
    })
    
    .when('/',{
        templateUrl: 'views/explore.html',
         controller: 'mapCtrl'
    })
    
    .otherwise({redirectTo: '/'});
})
  .controller('HeaderCtrl', ['$scope', '$rootScope',  '$route','$mdDialog', function ($scope, $rootScope, $route, $mdDialog) {
      // Login as an admin of EASIN in order to start editing
      $rootScope.userType = "Login";
      $rootScope.asAdmin = false;
      
      $scope.showConfirm = function(ev) {
        $mdDialog.show({
         controller: DialogController,
         templateUrl: 'views/dialog.html',
         parent: angular.element(document.body),
         targetEvent: ev,
         clickOutsideToClose:true
      });
    };
      
      // Exit admin mode
      $scope.logOut = function(){
          $rootScope.userType = "Login";
          $rootScope.asAdmin = false;
          $route.reload();
      };
      
      
  }]);
function DialogController($scope,$rootScope,  $mdDialog) {
    $scope.adminCode = null;
    $scope.checkLogin = function() {
        /* This step should be reworked. Potentially, we need one more collection with admin info.
            For now, login - admin and password - 123    */
       if ($scope.login == 'admin' && $scope.password == 123){
           $rootScope.userType = "Admin";
           $rootScope.asAdmin = true;
       } else{
            $scope.asAdmin = false;
       }
        $mdDialog.hide();
     };
  };
