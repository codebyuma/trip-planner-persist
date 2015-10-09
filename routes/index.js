var express = require('express');
var router = express.Router();
var models = require('../models');
var Hotel = models.Hotel;
var Days = models.Days;
var Restaurant = models.Restaurant;
var Activity = models.Activity;
var Promise = require('bluebird');

router.get('/', function(req, res) {
  Promise.all([
    Hotel.find(),
    Restaurant.find(),
    Activity.find(),
    Days.find()
    ]).spread(function(hotels, restaurants, activities, days) {
      console.log(days);
      res.render('index', {
        all_hotels: hotels,
        all_restaurants: restaurants,
        all_activities: activities,
        all_days: days
      });
    })

})

module.exports = router;
