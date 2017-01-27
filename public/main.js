var map;
var geocoder;
var infowindow;
var latLng;
var mapMarkers = [];
var routes = [];
var route = [];
var watchid;

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

  $('#address-coords').on('click', function(evt) {
    evt.preventDefault();
    getAddressGPS();
  });
  $('#check-address-reverse').on('click', function(evt){
    evt.preventDefault();
    var coords = $('#show-address-coords').text();
    var latlngStr = coords.split(',', 2);
    var latlng = {lat: parseFloat(latlngStr[0].slice(1, latlngStr[0].length)), lng: parseFloat(latlngStr[1].slice(0, latlngStr[1].length-1))};
    var appendTo = '#show-address-reverse';
    getReverse(latlng, appendTo);
  });
  $('#user-coords').on('click', function(evt) {
    evt.preventDefault();
    getUserCoordinates();
  });
  $('#user-coords-address').on('click', function(evt) {
    evt.preventDefault();
    var coords = $('#show-user-coords').text();
    var latlngStr = coords.split(',', 2);
    var latlng = {lat: parseFloat(latlngStr[0]), lng: parseFloat(latlngStr[1])};
    var appendTo = '#user-coords-address-reverse';
    console.log('coords', coords);
    getReverse(latlng, appendTo);
  });
  $('div.location').find('button').on('click', function(evt) {
    $.get('/locations/' + $(this).attr('value') + '/edit', function(res) {
      $('#name').val(res.name);
      $('#street').val(res.street);
      $('#city').val(res.city);
      $('#state').val(res.state);
      $('#zip').val(res.zip);
      $('#geo').val(res.geo.lat + ', ' + res.geo.lng);
      $('#id').val(res._id);
      $('#save-loc').attr({action: '/locations/' + $('#id').val() + '/edit', method: 'post' });
      $('#submit-data').text('Update Location');
    });
  });

  $('#start-btn').on('click', function(evt) {
    $('#status').text('Started tracking');
    watchid = navigator.geolocation.watchPosition(function(position) {
      var latitude = position.coords.latitude;
      var longitude = position.coords.longitude;
      var latlng = {lat: latitude, lng: longitude};
      var str = 'Started tracking route : ';
      removeMarkers();
      addMarker(latlng, map, null);
      route.push(latlng);
      route.forEach(function(item){
        str += '{' + item.lat + ', ' + item.lng + '}';
      });
      var line = new google.maps.Polyline({
        path: route,
        geodesic: true,
        strokeColor: '#FF0000',
        strokeOpacity: 1.0,
        strokeWeight: 2
      });
      line.setMap(map);
    }, geo_error, {
    enableHighAccuracy: false,
    maximumAge: 1000,
    timeout: Infinity
    });
  });
  $('#stop-btn').on('click', function(evt) {
    $('#status').text('Stopped tracking');
    navigator.geolocation.clearWatch(watchid);
    var runRoute = new google.maps.Polyline({
      path: route,
      geodesic: true,
      strokeColor: '#FF0000',
      strokeOpacity: 1.0,
      strokeWeight: 2
    });
    runRoute.setMap(map);
  });
}

function getReverse(latlng, appendTo) {
  console.log(latlng);
  if (!latlng) {
    return false;
  }
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
        $(appendTo).text(results[1].formatted_address);

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
    timeout: Infinity
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
    // clickable: false,
    icon: new google.maps.MarkerImage('//maps.gstatic.com/mapfiles/mobile/mobileimgs2.png',
            new google.maps.Size(22,22),
            new google.maps.Point(0,18),
            new google.maps.Point(11,11)),
    shadow: null,
    zIndex: 999,
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
