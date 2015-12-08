'use strict';

// Change the value of 'Server' to the proper path to the server part, so that it would point to the all available reports
angular.module('easinApp')
.value('Server', 'http://127.0.0.1:8080/reports')

  .factory('API', ['$http','Server', function ($http,Server) {
      
     var API = {};
      
     API.getReports= function () {
        return $http.get(Server);
    };

    API.getReport = function (id) {
        return $http.get(Server + '/' + id);
    };

    API.insertReport = function (report) {
        return $http.post(Server, report);
    };

    API.updateReport = function (id, report) {
        return $http.put(Server + '/' + id, report)
    };

    API.deleteReport = function (id) {
        return $http.delete(Server + '/' + id);
    };

    return API;
  }]);
