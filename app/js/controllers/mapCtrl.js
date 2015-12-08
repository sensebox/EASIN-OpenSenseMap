angular.module('easinApp')
       .controller('mapCtrl',['$scope','$rootScope','$http','API','$mdDialog', function($scope,$rootScope, $http, API, $mdDialog){
                
           $rootScope.markers = [];
           $rootScope.selectedMarker = {};
           $scope.lastextent = {};
           
           $scope.close = false;
        
           
           // Markers for the different states of submission
           $rootScope.icons = {
                submitted: {
                    type: 'awesomeMarker',
          prefix: 'fa',
          icon: 'bug',
          markerColor: 'red',  
                },
        prevalid: {
          type: 'awesomeMarker',
          prefix: 'fa',
          icon: 'bug',
          markerColor: 'orange',
        },
        valid: {
          type: 'awesomeMarker',
          prefix: 'fa',
          icon: 'bug',
          markerColor: 'green'
        },
        missing: {
            type: 'awesomeMarker',
          prefix: 'fa',
          icon: 'bolt',
          markerColor: 'black'
        }
      };
           
        // Fetch the data on the initial start of the application
           $scope.getData = function(){
             API.getReports()
                   .success(function (response) {
                   for(var i = 0; i < response.length; i++){
                  var tempMarker = {};
                  //General Info
                  tempMarker.id = response[i]._id;
                  tempMarker.createdAt = response[i].createdAt;
                  tempMarker.updatedAt = response[i].updatedAt;
                  tempMarker.__v = response[i].__v; 
                  tempMarker.type = response[i].type;   
                       
                  //Image:
                  tempMarker.image = response[i].properties.Image[0];
                       
                  // Meta info (Invisible for public)
                   tempMarker.iccid = response[i].properties.ICCID;
                    
                if ($rootScope.userType != 'Admin' && response[i].properties.Anonymous == true){ 
                    tempMarker.oauth = 'Anonymous';
                }else {
                    tempMarker.oauth = response[i].properties.OAUTHID;
                }
                       tempMarker.trueOauth =  response[i].properties.OAUTHID;
                       
                  //Visible for public
                   tempMarker.lsid = response[i].properties.LSID;
                       
                  // General info
                   tempMarker.abundance = response[i].properties.Abundance;
                   tempMarker.precision = response[i].properties.Precision;
                   tempMarker.comment = response[i].properties.Comment;
                       
                  // Coordinates
                   tempMarker.lat = response[i].geometry.coordinates[0];
                   tempMarker.lng = response[i].geometry.coordinates[1];
                  
                       
                  if (response[i].properties.Status == "Submitted"){
                     tempMarker.icon = $rootScope.icons.submitted;
                     tempMarker.status = "Submitted";                    
                  } else if (response[i].properties.Status == "Prevalidated"){
                      tempMarker.icon = $rootScope.icons.prevalid;
                      tempMarker.status = "Prevalidated";
                  } else if (response[i].properties.Status == "Validated"){
                      tempMarker.icon = $rootScope.icons.valid;
                      tempMarker.status = "Validated";
                  } else {
                      tempMarker.icon = $rootScope.icons.missing;
                      tempMarker.status = "missing";
                  }
                   
                           $rootScope.markers.push(tempMarker);
                   }
               })
                   .error(function (error) {
                   console.log(error);
               });
           };
           
           
           
           // Listen for a click on markers
       $scope.$on('leafletDirectiveMarker.click', function(e, args) {
           $rootScope.selectedMarker = args.leafletEvent.target.options;
            $scope.center.lat = $scope.selectedMarker.lat;
            $scope.center.lng = $scope.selectedMarker.lng;
            if($scope.center.zoom <= 6){
              $scope.center.zoom = 6;
            }
           
           $scope.close = false;
         });
           
           //Check if selectedMarker is empty and whether admin is loggen in
           $scope.isEmpty = function(obj){
               return (Object.keys(obj).length != 0);
           };
           
           
           // Leaflet map
           angular.extend($scope, {
               center: {
                   lat: 51.04139389812637,
                   lng: 10.21728515625,
                   zoom: 5
               },
               events: {},
               layers: {
                   baselayers: {
                       osm: {
                           name: 'OpenStreetMap',
                           url: 'https://a.tiles.mapbox.com/v4/alexishappy.cabc21af/page.html?access_token=pk.eyJ1IjoiYWxleGlzaGFwcHkiLCJhIjoiYzRiYTAxNGViMTk2MGM2NTMwOGYyOGEyOTk5Zjg3NjgifQ.yW4C6nl8uBcE6ukrSfv_KQ#4/54.79/56.05',
                           type: 'xyz'
                       }
                   }
               },
               defaults: {  
                   tileLayer: "http://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}",

        scrollWheelZoom: true,
                   zoomControlPosition: 'bottomleft'}
           });
           
           
        // Edit Modal Window
        $scope.startEdit = function(ev) {
           $mdDialog.show({
            controller: editController,
            templateUrl: 'views/edit_modal.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose:true
             });
           };
           
           // Remove Modal Window
        $scope.deleteReport = function(ev) {
           $mdDialog.show({
            controller: removeController,
            templateUrl: 'views/remove-modal.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose:true
             });
        };
           
        $scope.hideCard = function(){
            $scope.close = true;
        };
           
        // Modal with info about username / anonymous
        $scope.observedBy = function(ev) {
           $mdDialog.show({
            controller: userController,
            templateUrl: 'views/user-modal.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose:true
             });
        };
           
       }]);

function editController($scope, $rootScope, API, $mdDialog, $route) {
    
    $scope.statuses = ('Submitted Prevalidated Validated').split(' ').map(function(status) {
        return {abbrev: status};
      })
    
    $scope.selectedMarker = $rootScope.selectedMarker;

    $scope.saveEditedMarker = function(marker){
        
        $scope.updatedData =  {
    "_id":$scope.selectedMarker.id,
    "createdAt": $scope.selectedMarker.createdAt,
    "updatedAt": $scope.selectedMarker.updatedAt,
    "__v": $scope.selectedMarker.__v,
    "type": $scope.selectedMarker.type,
    "geometry":{"type":"Point",
                "coordinates":[$scope.selectedMarker.lat, $scope.selectedMarker.lng]
               },
    "properties":{
        "ICCID": $scope.selectedMarker.iccid,
        "OAUTHID": $scope.selectedMarker.trueOauth,
        "LSID": $scope.selectedMarker.lsid,
        "Abundance": $scope.selectedMarker.abundance,
        "Precision": $scope.selectedMarker.precision,
        "Comment": $scope.selectedMarker.comment,
        "Status": $scope.selectedMarker.status,
        "Anonymous": true,
        "Image": $scope.selectedMarker.image
    }
};
    
        API.updateReport($scope.selectedMarker.id, $scope.updatedData)
    .success(function (response) {
        $mdDialog.hide();

        //Update Marker Icon
        for (var i = 0; i < $rootScope.markers.length; i++) {
            if ($rootScope.markers[i].id == $scope.selectedMarker.id) {
                if ($scope.selectedMarker.status == "Submitted") {
                    $rootScope.markers[i].icon = $rootScope.icons.submitted;
                } else if ($scope.selectedMarker.status == "Prevalidated") {
                    $rootScope.markers[i].icon = $rootScope.icons.prevalid;
                } else if ($scope.selectedMarker.status == "Validated") {
                    $rootScope.markers[i].icon = $rootScope.icons.valid;
                } else {
                    $rootScope.markers[i].icon = $rootScope.icons.missing;
                }
            }
        }
            
    })
    .error(function (error) {
        console.log($error);
        $mdDialog.hide();
        // $route.reload();
    });
};


};


function removeController($scope, $rootScope, API, $mdDialog,$route) {
    $scope.markerToDelete = $rootScope.selectedMarker;
    
    $scope.removeReport = function(){
        API.deleteReport($scope.markerToDelete.id)
                   .success(function (response) {
                    $mdDialog.hide();
                    $route.reload();
                   
                })
                   .error(function (error) {
                   console.log($error);
                   $mdDialog.hide();
                });
    };
    
    $scope.cancelRemoving = function(){
        $mdDialog.hide();
    };
}

function userController($scope, $rootScope, API, $mdDialog, $route) {
    $scope.markerToDelete = $rootScope.selectedMarker;
    
    $scope.removeReport = function(){
        API.deleteReport($scope.markerToDelete.id)
                   .success(function (response) {
                    $mdDialog.hide();
                    $route.reload();
                   
                })
                   .error(function (error) {
                   console.log($error);
                   $mdDialog.hide();
                });
    };
    
    $scope.cancelRemoving = function(){
        $mdDialog.hide();
    };
}
