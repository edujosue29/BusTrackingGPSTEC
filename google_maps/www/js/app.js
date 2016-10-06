angular.module('starter', ['ionic', 'starter.controllers', 'starter.directives'])

.run(function($ionicPlatform,$rootScope) {
  $ionicPlatform.ready(function() {
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });


  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyAqW-nFQaidUjHMXE3h2VWbqwrj9HjaQ6Q",
    authDomain: "busgpstracking.firebaseapp.com",
    databaseURL: "https://busgpstracking.firebaseio.com",
    storageBucket: "busgpstracking.appspot.com",
    messagingSenderId: "488490132594"
  };
  firebase.initializeApp(config);

  $rootScope.databaseRef = firebase.database().ref("Posiciones");    

})



.factory('Markers', function($http) {
 
  var markers = [];
 
  return {
    getMarkers: function(){
 
      return $http.get("/markers.php").then(function(response){
          markers = response;
          return markers;
      });
 
    }
  }
})