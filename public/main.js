var map;
var geocoder;
var infowindow;
var latLng;
var mapMarkers = [];

function initMap() {
  map = new google.maps.Map($('#map')[0], {
    scrollwheel: false,
    zoom: 15
  });
  geocoder = new google.maps.Geocoder;
  infowindow = new google.maps.InfoWindow;

  navigator.geolocation.getCurrentPosition(function(position) {
    map.setCenter({lat: position.coords.latitude, lng: position.coords.longitude});
    // blue dot marker taken from Stack Overflow
    // http://stackoverflow.com/questions/9142833/show-my-location-on-google-maps-api-v3
    var marker = new google.maps.Marker({
      position: {lat: position.coords.latitude, lng: position.coords.longitude},
      clickable: false,
      icon: new google.maps.MarkerImage('//maps.gstatic.com/mapfiles/mobile/mobileimgs2.png',
              new google.maps.Size(22,22),
              new google.maps.Point(0,18),
              new google.maps.Point(11,11)),
      shadow: null,
      zIndex: 999,
      map: map
    });
    mapMarkers.push(marker);
  });

  $('#user-coords').on('click', getUserCoordinates);
  $('#check-address-reverse').on('click', getAddressReverse);
  $('#address-coords').on('click', getAddressGPS);
  $('#user-coords-address').on('click', getUserCoordsReverse);
}

function getAddressReverse() {
  var coords = $('#show-address-coords').text();
  console.log(coords);
  if (!coords) {
    return false;
  }
  var latlngStr = coords.split(',', 2);
  var latlng = {lat: parseFloat(latlngStr[0].slice(1, latlngStr[0].length)), lng: parseFloat(latlngStr[1].slice(0, latlngStr[1].length-1))};
  geocoder.geocode({'location': latlng}, function(results, status) {
    if (status === 'OK') {
      if (results[1]) {
        map.setCenter(latlng);
        map.setZoom(15);
        removeMarkers();
        var marker = new google.maps.Marker({
          clickable: false,
          icon: new google.maps.MarkerImage('//maps.gstatic.com/mapfiles/mobile/mobileimgs2.png',
                  new google.maps.Size(22,22),
                  new google.maps.Point(0,18),
                  new google.maps.Point(11,11)),
          shadow: null,
          zIndex: 999,
          position: latlng,
          map: map
        });
        mapMarkers.push(marker);
        infowindow.setContent(results[1].formatted_address);
        infowindow.open(map, marker);
        $('#show-address-reverse').text(results[1].formatted_address);
      } else {
        window.alert('No results found');
      }
    } else {
      window.alert('Geocoder failed due to: ' + status);
    }
  });
}

function getUserCoordsReverse() {
  var coords = $('#show-user-coords').text();
  console.log(coords);
  if (!coords) {
    return false;
  }
  var latlngStr = coords.split(',', 2);
  var latlng = {lat: parseFloat(latlngStr[0]), lng: parseFloat(latlngStr[1])};
  geocoder.geocode({'location': latlng}, function(results, status) {
    if (status === 'OK') {
      if (results[1]) {
        map.setCenter(latlng);
        map.setZoom(15);
        removeMarkers();
        var marker = new google.maps.Marker({
          clickable: false,
          icon: new google.maps.MarkerImage('//maps.gstatic.com/mapfiles/mobile/mobileimgs2.png',
                  new google.maps.Size(22,22),
                  new google.maps.Point(0,18),
                  new google.maps.Point(11,11)),
          shadow: null,
          zIndex: 999,
          position: latlng,
          map: map
        });
        mapMarkers.push(marker);
        infowindow.setContent(results[1].formatted_address);
        infowindow.open(map, marker);
        $('#show-user-coords-address').text(results[1].formatted_address);
      } else {
        window.alert('No results found');
      }
    } else {
      window.alert('Geocoder failed due to: ' + status);
    }
  });
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
  latLng = {lat: latitude, lng: longitude};
  $('#user-coords-text').html('Your geo position is (latitude, longitude): <span id="show-user-coords"></span>');
  $('#show-user-coords').text(latLng.lat + ', ' + latLng.lng);
}

function geo_error() {
  alert("Sorry, no gps position available.");
}

function getAddressGPS() {
  var address = $('#address-input').val();
  geocoder.geocode( { 'address': address}, function(results, status) {
    if (status == 'OK') {
      map.setCenter(results[0].geometry.location);
      removeMarkers();
      var marker = new google.maps.Marker({
          map: map,
          position: results[0].geometry.location
      });
      mapMarkers.push(marker);
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
  mapMarkers.push(marker);
}

function removeMarkers() {
  mapMarkers.forEach(function(marker) {
    marker.setMap(null);
  });
}
