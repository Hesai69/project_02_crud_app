var map;
var geocoder;
var infowindow;
var latLng;

navigator.geolocation.getCurrentPosition(function(position) {
  map.setCenter({lat: position.coords.latitude, lng: position.coords.longitude});
  var me = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
  var myloc = new google.maps.Marker({
  clickable: false,
  icon: new google.maps.MarkerImage('//maps.gstatic.com/mapfiles/mobile/mobileimgs2.png',
          new google.maps.Size(22,22),
          new google.maps.Point(0,18),
          new google.maps.Point(11,11)),
  shadow: null,
  zIndex: 999,
  map: map
  });
  myloc.setPosition(me);
});

function initMap() {
  var gaLocation = {lat: 34.0480309, lng: -118.2398424};
  var home = {lat: 34.0158306, lng: -118.07483460000003};
  map = new google.maps.Map($('#map')[0], {
    center: latLng || home,
    scrollwheel: false,
    zoom: 15
  });
  geocoder = new google.maps.Geocoder;
  infowindow = new google.maps.InfoWindow;

  addMarker(home, map);
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
  $('#show-user-coords').text('Your geo position is (latitude, longitude): (' + latLng.lat + ',' + latLng.lng + ')');

}
function geo_success(position) {
  var latitude = position.coords.latitude;
  var longitude = position.coords.longitude;
  latLng = {lat: latitude, lng: longitude};
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
      $('#show-address-coords').text(results[0].geometry.location);
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
