angular.module('starter.controllers', [])

.controller('MapCtrl', function($scope, $ionicLoading) {
  $scope.moreMenu= "menu-more-hide";
  $scope.modoOffline =true;

  $scope.mapCreated = function(map) {
    $scope.map = map;
    $scope.map.setCenter(new google.maps.LatLng(9.860900899999999, -83.9151341));
  };

  $scope.centerOnMe = function () {
    console.log("Centering");
    if (!$scope.map) {
      return;
    }

    $scope.loading = $ionicLoading.show({
      content: 'Getting current location...',
      showBackdrop: true
    });

    navigator.geolocation.getCurrentPosition(function (pos) {      
      var myLatLng = {lat: pos.coords.latitude, lng: pos.coords.longitude}; // Obtiene las coordenandas del navegador      
     

     
      console.log(myLatLng.lat,myLatLng.lng);                                   

      $scope.map.setCenter(new google.maps.LatLng(myLatLng.lat, myLatLng.lng)); //Centra el mapa en esa posicion
      
 
      var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 16,
        center: myLatLng
      });

      var marker = new google.maps.Marker({
        position: myLatLng,
        map: map,
        draggable:true,
        title: 'Aquí esta un estudianTEC',
        label: 'TEC'
      });



      $scope.loading.hide();
    }, function (error) {
      alert('Unable to get location: ' + error.message);
    });
  };
  


  //Abre el More Menu del Dashboard
$scope.openMoreMenu = function(){
  console.log("ENTREEEEEEEE");
  if ($scope.moreMenu == "menu-more-show"){
    $scope.moreMenu= "menu-more-hide";
  }else{
    $scope.moreMenu= "menu-more-show";
  }  
};

//Abre el More Menu del Dashboard
$scope.closeMoreMenu = function(){
  $scope.moreMenu= "menu-more-hide";
};



});
