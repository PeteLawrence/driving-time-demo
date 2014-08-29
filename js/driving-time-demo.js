jQuery(document).ready(function() {

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
      }, distanceMatricCallback);

    function distanceMatricCallback(response, status) {
      if (status == google.maps.DistanceMatrixStatus.OK) {
        var origins = response.originAddresses;
        var destinations = response.destinationAddresses;

        //Check that the origin was recognised
        if (response.originAddresses[0]== "") {
          jQuery('h1').after('<div class="alert alert-warning" role="alert">Your location was not recognised</div>');
          return;
        }

        for (var i = 0; i < origins.length; i++) {
          var results = response.rows[i].elements;
          for (var j = 0; j < results.length; j++) {
            var element = results[j];
            jQuery('h1').after('<div class="alert alert-info" role="alert">' + element.duration.text + '</div>');
          }
        }
      } else {
            jQuery('h1').after('<div class="alert alert-warning" role="alert">There was an error</div>');
      }

    }

  });

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

  function locationCallbackSuccess(position) {
    jQuery('#drivingTimeSpinner').hide();
    jQuery('#drivingTimeOrigin').val(position.coords.latitude + ', ' + position.coords.longitude);
  }

  function locationCallbackFailure(error) {
    jQuery('#drivingTimeSpinner').hide();
    if (err.code == 1) {
      //user didn't give permission
    } else {
      //couldn;t establish location
    }
  }
});