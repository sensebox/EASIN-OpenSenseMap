angular.module('easinApp')
       .controller('mapCtrl',['$scope','$rootScope','$http','API','$mdDialog', function($scope,$rootScope, $http, API, $mdDialog){
                
           $scope.markers = [];
           $rootScope.selectedMarker = {};
           
           //Test data
       /* var data =  [{
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
        "Image":"images/img3.jpg"
    }
},
                    {
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
        "Image":"images/img2.jpg"
    }
}];*/
           
           // Markers for the different states of submission
           var icons = {
                submitted: {
                    type: 'awesomeMarker',
          prefix: 'fa',
          icon: 'bug',
          markerColor: 'orange',  
                },
        prevalid: {
          type: 'awesomeMarker',
          prefix: 'fa',
          icon: 'bug',
          markerColor: 'yellow',
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
          markerColor: 'red'
        }
      };
           
        // Fetch the data on the initial start of the application
                
         $scope.getData = function(){
         
        /** With the test data */
           /*  for(var i = 0; i < data.length; i++){
                  var tempMarker = {};
                  //Image:
                  tempMarker.image = "images/img2.jpg";
                  
                  
                  // Meta info (Invisible for public)
                   tempMarker.iccid = data[i].properties.ICCID;
                   tempMarker.oauth = data[i].properties.OAUTHID;
                  
                  //Visible for public
                   tempMarker.lsid = data[i].properties.LSID;
                  
                  // General info
                   tempMarker.abundance = data[i].properties.Abundance;
                   tempMarker.precision = data[i].properties.Precision;
                   tempMarker.comment = data[i].properties.Comment;
                  
                  // Coordinates
                   tempMarker.lat = data[i].geometry.coordinates[0];
                   tempMarker.lng = data[i].geometry.coordinates[1];
                  
                  console.log(tempMarker);
                  if (data[i].properties.Status == "submitted"){
                     tempMarker.icon = icons.submitted;
                     tempMarker.status = "Submitted";                    
                  } else if (data[i].properties.Status == "prevalidated"){
                      tempMarker.icon = icons.prevalid;
                      tempMarker.status = "Prevalidated";
                  } else if (data[i].properties.Status == "validated"){
                      tempMarker.icon = icons.valid;
                      tempMarker.status = "Validated";
                  } else {
                      tempMarker.icon = icons.missing;
                      tempMarker.status = "missing";
                  }
                   $scope.markers.push(tempMarker);
                       console.log($scope.markers);
                   }  */
               
           
        API.getReports()
                   .success(function (response) {
                   for(var i = 0; i < response.data.length; i++){
                  var tempMarker = {};
                  
                  //Image:
                  
                  //First check if its base64 encoded
                  var base64Matcher = new RegExp("^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{4})$");
                  if (response.data[i].properties.Image.substring(0,4) == "data"){
                      tempMarker.image = response.data[i].properties.Image;
                  } else {
                     if (base64Matcher.test(response.data[i].properties.Image)) {
                     //Its likely base64 encoded
                       tempMarker.image = "data:image/jpeg;base64," + response.data[i].properties.Image;
                     } else {
                     // It's definitely not base64 encoded. Standart Image
                      tempMarker.image = "images/img2.jpg";
                     }
                  }
                  
                  // Meta info (Invisible for public)
                   tempMarker.iccid = response.data[i].properties.ICCID;
                   tempMarker.oauth = response.data[i].properties.OAUTHID;
                  
                  //Visible for public
                   tempMarker.lsid = response.data[i].properties.LSID;
                  
                  // General info
                   tempMarker.abundance = response.data[i].properties.Abundance;
                   tempMarker.precision = response.data[i].properties.Precision;
                   tempMarker.comment = response.data[i].properties.Comment;
                  
                  // Coordinates
                   tempMarker.lat = response.data[i].geometry.Coordinates[0];
                   tempMarker.lng = response.data[i].geometry.Coordinates[1];
                  
                  if (response.data[i].properties.Status == "submitted"){
                     tempMarker.icon = icons.submitted;
                     tempMarker.status = "Submitted";                    
                  } else if (response.data[i].properties.Status == "prevalidated"){
                      tempMarker.icon = icons.prevalid;
                      tempMarker.status = "Prevalidated";
                  } else if (response.data[i].properties.Status == "validated"){
                      tempMarker.icon = icons.valid;
                      tempMarker.status = "Validated";
                  } else {
                      tempMarker.icon = icons.missing;
                      tempMarker.status = "missing";
                  }
                   $scope.markers.push(tempMarker);
                       console.log(response);
                   }
               })
                   .error(function (error) {
                   console.log(error);
               }); 
           };    
           
           
           
           // Listen for a click on markers
        $scope.$on('leafletDirectiveMarker.click', function(e, args) {
           $rootScope.selectedMarker = args.model;
            $scope.center.lat = $scope.selectedMarker.lat;
            $scope.center.lng = $scope.selectedMarker.lng;
            $scope.center.zoom = 6;
         });
           
           //Check if selectedMarker is empty
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
           
       }]);


function editController($scope, $rootScope, API, $mdDialog) {
    $scope.selectedMarker = $rootScope.selectedMarker;
    
    
    $scope.saveEditedMarker = function(){
        API.updateReport()
                   .success(function (response) {
                    $mdDialog.hide();
                   
                })
                   .error(function (error) {
                   console.log(error);
                   $mdDialog.hide();
                });
    };
    
    
  };