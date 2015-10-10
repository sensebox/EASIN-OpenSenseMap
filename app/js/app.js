angular.module('easinApp',['angular-click-outside','ngMaterial','ngRoute','leaflet-directive','ngResource'])
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
      
      $scope.newReport = function(ev){
           $mdDialog.show({
            controller: createController,
            templateUrl: 'views/edit_modal.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose:true
             });
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
function createController($scope,$rootScope,$http,API,$mdDialog) {
   $scope.exampleData1 =  {
    "type":"Feature",
    "geometry":{"type":"Point",
                "coordinates":[51.966342,7.6214499],
               },
    "properties":{
        "ICCID":"1234567890123456789",
        "OAUTHID":"abc@gmail.com",
        "LSID":"urn:lsid:alien.jrc.ec.europa.eu:species:R02004:4.6",
        "Abundance":"15",
        "Precision":"Precise",
        "Comment":"whatever I find worth adding",
        "Status":"submitted",
        "Anonymous": true,
        "Image":"images/img3.jpg"
    }
};
    
   $scope.exampleData2 = {
    "type":"Feature",
    "geometry":{"type":"Point",
                "coordinates":[53.966342,8.6214499],
               },
    "properties":{
        "ICCID":"2948592846928745",
        "OAUTHID":"cba@gmail.com",
        "LSID":"urn:lsid:alien.jrc.ec.europa.eu:species:R02004:4.6",
        "Abundance":"35",
        "Precision":"Approximate",
        "Comment":"whatever I find worth adding",
        "Status":"prevalidated",
        "Anonymous": false,
        "Image":"images/img2.jpg"
    }
};
        
    $scope.submitReport = function() {
        API.insertReport($scope.exampleData1)
                   .success(function (response) {
                    $mdDialog.hide();
                   
                })
                   .error(function (error) {
                   $mdDialog.hide();
                });
     }; 
  };
