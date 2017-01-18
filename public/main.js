console.log('linked');

function initMap() {
  var startLocation = {lat: 34.0480309, lng: -118.2398424};
  // Create a map object and specify the DOM element for display.
  var map = new google.maps.Map(document.getElementById('map'), {
    center: startLocation,
    scrollwheel: false,
    zoom: 15
  });
  var marker = new google.maps.Marker({
    position: startLocation,
    map: map
  });
}
