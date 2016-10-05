angular.module('starter', ['ionic', 'starter.controllers', 'starter.directives'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})



.factory('Markers', function($http) {
 
  var markers = [];
 
  return {
    getMarkers: function(){
 
      return $http.get("http://example.com/markers.php").then(function(response){
          markers = response;
          return markers;
      });
 
    }
  }
})