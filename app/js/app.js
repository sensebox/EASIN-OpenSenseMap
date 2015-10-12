angular.module('easinApp',['angular-click-outside','ngMaterial','ngRoute','leaflet-directive','ngResource','ngMdIcons','ngCookies'])
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
  .controller('HeaderCtrl', ['$scope', '$rootScope',  '$route','$mdDialog','$cookies','API', function ($scope, $rootScope, $route, $mdDialog, $cookies,API) {
      // Login as an admin of EASIN in order to start editing
      if ($cookies.get('user') == undefined){
          $cookies.put('user', 'Login');
      }
      if ($cookies.get('asAdmin') == undefined){
          $cookies.put('asAdmin', false);
      }
      $rootScope.userType = $cookies.get('user');
      $rootScope.asAdmin = $cookies.get('asAdmin');
      
       console.log($rootScope.asAdmin);
          
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
          //Setting cookies
          $cookies.put('user', 'Login');
          $cookies.put('asAdmin', false);
          
          $rootScope.userType = $cookies.get('user');
          $rootScope.asAdmin = $cookies.get('asAdmin');
          $route.reload();
      };
      
      $scope.newReport = function(){
          function getRandom( min,  max){
              return Math.random() * (max - min) + min;
          };
                  $scope.examples =  [{
    "type":"Feature",
    "geometry":{"type":"Point",
                "coordinates":[getRandom(45,55),getRandom(5,15)],
               },
    "properties":{
        "ICCID":"1234567890123456789",
        "OAUTHID":"abc@gmail.com",
        "LSID":"urn:lsid:alien.jrc.ec.europa.eu:species:R02004:4.6",
        "Abundance":"15",
        "Precision":"Precise",
        "Comment":"whatever I find worth adding",
        "Status":"Submitted",
        "Anonymous": true,
        "Image":"images/img3.jpg"
    }
  }, {
    "type":"Feature",
    "geometry":{"type":"Point",
                "coordinates":[getRandom(45,55),getRandom(5,15)],
               },
    "properties":{
        "ICCID":"2948524523423745",
        "OAUTHID":"asdgasdg@gmail.com",
        "LSID":"urn:lsid:alien.jrc.ec.europa.eu:species:R02004:4.6",
        "Abundance":"65",
        "Precision":"Approximate",
        "Comment":"whatever I find worth adding",
        "Status":"Prevalidated",
        "Anonymous": false,
        "Image":"images/img2.jpg"
    }
}, { 
    "type":"Feature",
    "geometry":{"type":"Point",
                "coordinates":[getRandom(45,55),getRandom(5,15)],
               },
    "properties":{
        "ICCID":"2948592846928745",
        "OAUTHID":"cba@gmail.com",
        "LSID":"urn:lsid:alien.jrc.ec.europa.eu:species:R02004:4.6",
        "Abundance":"35",
        "Precision":"Approximate",
        "Comment":"whatever I find worth adding",
        "Status":"Validated",
        "Anonymous": false,
        "Image":"images/img1.jpg"
    }
}];
             for (var i = 0; i < $scope.examples.length; i++){
                  API.insertReport($scope.examples[i])
                   .success(function (response) {
                      $route.reload; 
                })
                   .error(function (error) {
                });
             }
          
          /* $mdDialog.show({
            controller: createController,
            templateUrl: 'views/create-modal.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose:true
             });*/
      };
      
      
  }]);
function DialogController($scope,$rootScope,  $mdDialog,$timeout,$cookies) {
    $scope.adminCode = null;
    
    $scope.icon = 'account_circle';
    $scope.icon_color = "white";
    
    $scope.checkLogin = function() {
        /* This step should be reworked. Potentially, we need one more collection with admin info.
            For now, login - admin and password - 123    */
       if ($scope.login.toLowerCase() == 'admin' && $scope.password == 123){
           //Set an admin cookie
           $cookies.put('user', 'Admin');
           $cookies.put('asAdmin', true);
           
           $rootScope.userType = $cookies.get('user');
           $rootScope.asAdmin = $cookies.get('asAdmin');
           
           $scope.icon = 'verified_user';
           
           $timeout(function() {
            $mdDialog.hide();
           }, 1200);
           
       } else{
            $scope.icon = 'highlight_remove';
           
            $timeout(function() {
            $scope.icon = 'account_circle';
           }, 1800);
       }
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
        "Status":"Submitted",
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
        "Status":"Prevalidated",
        "Anonymous": false,
        "Image":"images/img2.jpg"
    }
};
        
    $scope.submitReport = function() {
        API.insertReport($scope.exampleData2)
                   .success(function (response) {
                    $mdDialog.hide();
                   
                })
                   .error(function (error) {
                   $mdDialog.hide();
                });
     }; 
  };
