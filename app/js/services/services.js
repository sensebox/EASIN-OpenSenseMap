'use strict';

angular.module('easinApp')
.value('Server', 'http://localhost:80/reports')

  .factory('API', ['$http','Server', function ($http,Server) {
      
     var API = {};
      
     API.getReports= function () {
        return $http.get(Server);
    };

    API.getReport = function (id) {
        return $http.get(Server + '/' + id);
    };

    API.insertReport = function () {
        return $http.post(Server);
    };

    API.updateReport = function (id) {
        return $http.put(Server + '/' + id)
    };

    API.deleteReport = function (id) {
        return $http.delete(Server + '/' + id);
    };

    return API;
  }]);
