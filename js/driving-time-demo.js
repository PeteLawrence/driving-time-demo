jQuery(document).ready(function() {

  /*
   * Handles the clicking off the 'Find Driving Time' button
   */
  jQuery('#drivingTimeSubmit').click(function() {
    var origin = jQuery('#drivingTimeOrigin').val();
    var destination = jQuery('#drivingTimeDestination').val();


    var service = new google.maps.DistanceMatrixService();
    service.getDistanceMatrix(
      {
        origins: [origin],
        destinations: [destination],
        travelMode: google.maps.TravelMode.DRIVING,
        unitSystem: google.maps.UnitSystem.METRIC,
        durationInTraffic: false,
        avoidHighways: false,
        avoidTolls: false
      }, distanceMatrixCallback);

    function distanceMatrixCallback(response, status) {
      if (status == google.maps.DistanceMatrixStatus.OK) {
        var origins = response.originAddresses;
        var destinations = response.destinationAddresses;

        //Check that the origin was recognised
        if (response.rows[0].elements[0].status == "NOT_FOUND") {
          jQuery('h1').after('<div class="alert alert-warning" role="alert">Your location was not recognised</div>');
          return;
        } else if (response.rows[0].elements[0].status == "ZERO_RESULTS") {
          jQuery('h1').after('<div class="alert alert-warning" role="alert">We could not find the driving time based on your location</div>');
          return;
        }

        for (var i = 0; i < origins.length; i++) {
          var results = response.rows[i].elements;
          for (var j = 0; j < results.length; j++) {
            var element = results[j];
            jQuery('h1').after('<div class="alert alert-info" role="alert">' + origins[0] + ' to ' + destinations[0] + ': ' + element.duration.text + '</div>');
          }
        }
      } else {
            jQuery('h1').after('<div class="alert alert-warning" role="alert">There was an error</div>');
      }

    }

  });


  /*
   * Handles the clicking off the 'Use Current Location' button
   */
  jQuery('#drivingTimeUseCurrentLocation').click(function() {
    if (jQuery('#drivingTimeOrigin').attr('readonly')) {
      jQuery('#drivingTimeOrigin').val('');
      jQuery('#drivingTimeOrigin').removeAttr('readonly');
      jQuery('#drivingTimeSpinner').hide();
    } else {
      jQuery('#drivingTimeOrigin').attr('readonly', 'readonly');
      jQuery('#drivingTimeSpinner').show();

      //Use the HTML5 Geolocation API to work out where the user us
      navigator.geolocation.getCurrentPosition(locationCallbackSuccess, locationCallbackFailure);
    }
  });


  /**
   * Geolocation success callback
   *
   * @link http://dev.w3.org/geo/api/spec-source.html#api_description
   */
  function locationCallbackSuccess(position) {
    jQuery('#drivingTimeSpinner').hide();
    jQuery('#drivingTimeOrigin').val(position.coords.latitude + ', ' + position.coords.longitude);
  }


  /**
   * Geolocation failure callback
   *
   * @link http://dev.w3.org/geo/api/spec-source.html#api_description
   */
  function locationCallbackFailure(error) {
    jQuery('#drivingTimeSpinner').hide();
    if (err.code == 1) {
      //user didn't give permission
    } else {
      //couldn't establish location
    }
  }
});
