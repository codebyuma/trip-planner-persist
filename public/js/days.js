'use strict';
/* global $ mapModule */

var daysModule = (function(){

  var thisDay;
  var exports = {},
      days = all_days,
      currentDay = days[0];

  function addDay () {


    var dayToAdd = days.length+1;

    $.ajax({
        method: 'POST',
        url: '/api/days/' + dayToAdd,
        data: null,
        success: function (responseData){
            // console.log("type ", typeof responseData);
             console.log("data ", responseData);
             all_days.push(responseData);
             renderDayButtons();
             switchDay(days.length - 1);
        },
        error: function (errorObj){
          console.log("FAIL");
        }

    });

    
  }

  function switchDay (index) {
    var $title = $('#day-title');
    console.log("days length ", days.length);
    if (index >= days.length) index = days.length - 1;
    $title.children('span').remove();
    $title.prepend('<span>Day ' + (index + 1) + '</span>');
    currentDay = days[index];
    thisDay = index+1;
    renderDay();
    renderDayButtons();
  }

  function removeCurrentDay () {
    if (days.length === 1) return;
    var index = days.indexOf(currentDay);
    days.splice(index, 1);

    $.ajax({
    method: 'DELETE',
    url: '/api/days/' + (index + 1),
    data: null,
    success: function (responseData){
        console.log("SUCCESS");
        switchDay(index);
    },
    error: function (errorObj){
      console.log("FAIL");
    }

    });


  }

  function renderDayButtons () {
    var $daySelect = $('#day-select');
    $daySelect.empty();
    days.forEach(function(day, i){ 
      $daySelect.append(daySelectHTML(day, i, day === currentDay));
    });

    $daySelect.append('<button class="btn btn-circle day-btn new-day-btn">+</button>');
  }

  function daySelectHTML (day, i, isCurrentDay) {
    return '<button class="btn btn-circle day-btn' + (isCurrentDay ? ' current-day' : '') + '">' + (i + 1) + '</button>';
  }

  exports.addAttraction = function(attraction) {
    if (currentDay[attraction.type].indexOf(attraction) !== -1) return;
    

    //console.log("STOP attraction ", typeof attraction._id);


    $.ajax({
      method: 'PUT',
      url: '/api/days/' + thisDay + '/' + attraction.type,
      data: attraction,
      success: function (responseData){
          console.log("SUCCESS");
          currentDay[attraction.type].push(attraction);
          renderDay(currentDay);
          
      },
      error: function (errorObj){
        console.log("FAIL");
      }
    });

    
  };

  exports.removeAttraction = function (attraction) {
    var index = currentDay[attraction.type].indexOf(attraction);
    if (index === -1) return;
    currentDay[attraction.type].splice(index, 1);

    $.ajax({
      method: 'DELETE',
      url: '/api/days/' + thisDay + '/' + attraction.type,
      data: attraction,
      success: function (responseData){
          console.log("SUCCESS");
          renderDay(currentDay);
          
      },
      error: function (errorObj){
        console.log("FAIL");
      }
    });

  };

  function renderDay(day) {
    mapModule.eraseMarkers();
    day = day || currentDay;
    Object.keys(day).forEach(function(type){
      var $list = $('#itinerary ul[data-type="' + type + '"]');
      $list.empty();


      if (type == "hotels" || type == "restaurants" || type == "activities"){
        day[type].forEach(function(attraction){
           if (typeof attraction != "object"){
  
                  $.ajax({
                      method: 'GET',
                      url: '/api/days/' + thisDay + '/' + type + "/" + attraction,
                      data: null,
                      success: function (responseData){
                          console.log("SUCCESS");
                          console.log(responseData);
                          attraction = responseData;
                          $list.append(itineraryHTML(attraction));
                          mapModule.drawAttraction(attraction);
                          
                      },
                      error: function (errorObj){
                        console.log("FAIL");
                      }
                    });

           }
           else {
            $list.append(itineraryHTML(attraction));
             mapModule.drawAttraction(attraction);
           }

            
        });
      }
    });
  }

  function itineraryHTML (attraction) {
    return '<div class="itinerary-item><span class="title>' + attraction.name + '</span><button data-id="' + attraction._id + '" data-type="' + attraction.type + '" class="btn btn-xs btn-danger remove btn-circle">x</button></div>';
  }

  $(document).ready(function(){
    switchDay(0); // need to figure out why it isn't loading with the saved data.
    $('.day-buttons').on('click', '.new-day-btn', addDay);
    $('.day-buttons').on('click', 'button:not(.new-day-btn)', function() {
      switchDay($(this).index());
    });
    $('#day-title').on('click', '.remove', removeCurrentDay);
  });

  return exports;

}());
