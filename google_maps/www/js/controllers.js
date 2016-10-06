angular.module('starter.controllers', [])

.controller('MapCtrl', function($scope, $ionicLoading, $rootScope, Markers) {
  $scope.moreMenu= "menu-more-hide";
  $scope.modoOffline =true;

  $scope.mapCreated = function(map) {
    $scope.map = map;
    $scope.map.setCenter(new google.maps.LatLng(9.856021, -83.913601)); // Centra el mapa en una posicion inicial
    
    var transitLayer = new google.maps.TransitLayer();  //Habilita la capa de trafico
    transitLayer.setMap(map);
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
      
 
      var map = new google.maps.Map(document.getElementById('map'), { //Obtienen el mapa
        zoom: 16,
        center: myLatLng
      });

      var marker = new google.maps.Marker({     // Crea un marcador en la posicion indicada
        position: myLatLng,
        map: map,
        draggable:true,
        title: 'Aquí esta un estudianTEC',
        label: 'TEC'
      });

      var infoWindow = new google.maps.InfoWindow({map: map});    // Crea un infoWindow 
      infoWindow.setPosition(myLatLng);
      infoWindow.setContent('Aquí esta un estudianTEC');


      $scope.loading.hide();
    }, function (error) {
      alert('Unable to get location: ' + error.message);
    });
  };
  


  //Abre el More Menu del Dashboard
  $scope.openMoreMenu = function(){
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

  // Carga el marcador directo donde se encuentra el usuario
  $scope.loadMarkers = function(){
    console.log("Sending to firebase");

    var data = {"lat" : 9.860900899999999, "lng": -83.9151341,"TIMESTAMP": firebase.database.ServerValue.TIMESTAMP };

    $rootScope.databaseRef.push(data)  
      .then(function(x){
          console.log(x);
        })
      .catch(function(error) {
        console.log("Error:", error);
       
    });

  };

  //Recibe:
  $scope.getGoogleDistance = function(){
      console.log("Getting Google distance...");
      var bounds = new google.maps.LatLngBounds;
      var markersArray = [];
      var origin1 = 'Estación de Autobuses, Cartago Province, Cartago';
      var destinationA = 'Parada de buses TEC, C 2, Cartago, Cartago Province';      

      var destinationIcon = 'https://chart.googleapis.com/chart?' +
          'chst=d_map_pin_letter&chld=D|FF0000|000000';
      var originIcon = 'https://chart.googleapis.com/chart?' +
          'chst=d_map_pin_letter&chld=O|FFFF00|000000';
      var map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 55.53, lng: 9.4},
        zoom: 10
      });
      var geocoder = new google.maps.Geocoder;

      var service = new google.maps.DistanceMatrixService;

      service.getDistanceMatrix({
        origins: [origin1],
        destinations: [destinationA],
        travelMode: google.maps.TravelMode.DRIVING,
        unitSystem: google.maps.UnitSystem.METRIC,
        avoidHighways: false,
        avoidTolls: false
      }, function(response, status) {

        if (status !== google.maps.DistanceMatrixStatus.OK) {
          alert('Error was: ' + status);
        } else {
          console.log(response);
          var estimacion = {
            "distance:":response.rows[0].elements[0].distance.text,
            "duration:":response.rows[0].elements[0].duration.text
          };

          console.log("distance:",estimacion.distance);
          console.log("duration:",estimacion.duration);
          //alert("distance: " + estimacion.distance + ", duration: " + estimacion.duration);
          var originList = response.originAddresses;
          var destinationList = response.destinationAddresses;
          var outputDiv = document.getElementById('output');
          outputDiv.innerHTML = '';
          deleteMarkers(markersArray);

          var showGeocodedAddressOnMap = function(asDestination) {
            var icon = asDestination ? destinationIcon : originIcon;
            return function(results, status) {
              if (status === google.maps.GeocoderStatus.OK) {
                map.fitBounds(bounds.extend(results[0].geometry.location));
                markersArray.push(new google.maps.Marker({
                  map: map,
                  position: results[0].geometry.location,
                  icon: icon
                }));
              } else {
                alert('Geocode was not successful due to: ' + status);
              }
            };
          };


            for (var i = 0; i < originList.length; i++) {
              var results = response.rows[i].elements;
              geocoder.geocode({'address': originList[i]},
                  showGeocodedAddressOnMap(false));
              for (var j = 0; j < results.length; j++) {
                geocoder.geocode({'address': destinationList[j]},
                    showGeocodedAddressOnMap(true));
                outputDiv.innerHTML += originList[i] + ' to ' + destinationList[j] +
                    ': ' + results[j].distance.text + ' in ' +
                    results[j].duration.text + '<br>';
              }
            }
        }

      });
    
      function deleteMarkers(markersArray) {
        for (var i = 0; i < markersArray.length; i++) {
          markersArray[i].setMap(null);
        }
        markersArray = [];
      };    
    
  };


});

