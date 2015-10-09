'use strict';
/* global $ daysModule all_hotels all_restaurants all_activities */

$(document).ready(function() {

  var attractionsByType = {
    hotels:      all_hotels,
    restaurants: all_restaurants,
    activities:  all_activities
  };

  function findByTypeAndId (type, id) {
    var attractions = attractionsByType[type],
        selected;
    attractions.some(function(attraction){
      if (attraction._id === id) {
        selected = attraction;
        selected.type = type;
        return true;
      }
    });
    return selected;
  }

// ADD TO DAY
  $('#attraction-select').on('click', 'button', function() {
    var $button = $(this),
        type = $button.data('type'),
        attractions = attractionsByType[type],
        id = $button.siblings('select').val();
    daysModule.addAttraction(findByTypeAndId(type, id));

   $.ajax({
        method: 'POST',
        url: '/api/days/' + dayToAdd,
        data: null,
        success: function (responseData){
            console.log("SUCCESS");
        },
        error: function (errorObj){
          console.log("FAIL");
        }

    });

  });


// REMOVE FROM ITINERARY
  $('#itinerary').on('click', 'button', function() {
    var $button = $(this),
        type = $button.data('type'),
        id = $button.data('id');
    daysModule.removeAttraction(findByTypeAndId(type, id));
  });

});
