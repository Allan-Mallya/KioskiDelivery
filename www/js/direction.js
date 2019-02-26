angular.module('starter', ['ionic','ngCordova'])


function initMap() {
  directionsService = new google.maps.DirectionsService;
  directionsDisplay = new google.maps.DirectionsRenderer;
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 7,
    center: {lat: 41.85, lng: -87.65}
  });
  directionsDisplay.setMap(map);
 


}
function calcRoute() {
  //var start = document.getElementById("start").value;
  //var end = document.getElementById("end").value;
  console.log(originlat + "    " + originlong);
  console.log(destinationlatitude + "   " + destinationlongitude);
  var request = {
    origin:originlat + ' , '+ originlong,
    destination:destinationlatitude + ', '+ destinationlongitude,
    travelMode: google.maps.TravelMode.DRIVING
  };
  directionsService.route(request, function(response, status) {
    if (status == google.maps.DirectionsStatus.OK) {
      directionsDisplay.setDirections(response);
       document.getElementById('right-panel').style.display = "block";
       directionsDisplay.setPanel(document.getElementById('right-panel'));
    }
  });
}
