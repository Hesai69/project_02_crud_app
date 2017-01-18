var map;
var geocoder;
var infowindow;

function initMap() {
  var gaLocation = {lat: 34.0480309, lng: -118.2398424};
  map = new google.maps.Map($('#map')[0], {
    center: gaLocation,
    scrollwheel: false,
    zoom: 15
  });
  geocoder = new google.maps.Geocoder;
  infowindow = new google.maps.InfoWindow;

  addMarker(gaLocation, map);
  $('#user-coords').on('click', getUserCoordinates);
  $('#address-coords').on('click', getAddressGPS);
}

function getUserCoordinates() {
  var geo_options = {
    enableHighAccuracy: true,
    maximumAge: 1000,
    timeout: 5000
  };
  navigator.geolocation.getCurrentPosition(geo_success, geo_error, geo_options);
}
function geo_success(position) {
  var latitude = position.coords.latitude;
  var longitude = position.coords.longitude;
  $('#show-user-coords').text('Your GPS position is latitude: ' + latitude + ', longitude: ' + longitude);
}

function geo_error() {
  alert("Sorry, no gps position available.");
}

function getAddressGPS() {
  var address = $('#address-input').val();
  geocoder.geocode( { 'address': address}, function(results, status) {
    if (status == 'OK') {
      map.setCenter(results[0].geometry.location);
      var marker = new google.maps.Marker({
          map: map,
          position: results[0].geometry.location
      });
    } else {
      alert('Geocode was not successful for the following reason: ' + status);
    }
  });
}

function addMarker(location, map, label) {
  var marker = new google.maps.Marker({
    position: location,
    label: label,
    map: map
  });
}
