var express = require('express');
var dayRouter = express.Router();
var models = require('../../models');
var Hotel = models.Hotel;
var Days = models.Days;
var Restaurant = models.Restaurant;
var Activity = models.Activity;
var Promise = require('bluebird');

dayRouter.get("/days/", function(req, res){
	console.log("in /days/");
	Days.find({}).exec()
	.then(function(allDays){
		res.json(allDays);
	});
});

dayRouter.get("/days/:day", function(req, res){
	console.log("/days/day")
	var dayToFind = Number(req.params.day);
	Days.findOne({number: dayToFind}).exec()
	.then(function(foundDay){
		res.json(foundDay);
	});
})

dayRouter.get("/days/:day/:attractionType/:attraction", function (req, res){
    var attractionType = req.params.attractionType;
	var attractionID = req.params.attraction;
	// console.log("HERERERE");

	console.log("attractionType ", attractionType);
	// console.log("attraction ID ", attractionID);

    if (attractionType === "restaurants"){
      Restaurant.findById(attractionID, function (err, foundRestaurant) {
      	if (err) console.log("ERROR in RESTO FIND");
      	//console.log("found: ", foundRestaurant);
        res.send(foundRestaurant);
      }) 
    } else if (attractionType === "hotels"){
      Hotel.findById(attractionID, function (err, foundHotel) {
        res.send(foundHotel);
      })
    } else {
      Activity.findById(attractionID, function (err, foundActivity) {
        res.send(foundActivity);
      })
    }

})


dayRouter.post("/days/:day", function (req, res){
	
	var dayToAdd = Number(req.params.day);
	//console.log("day to add" , req.params.day);

	Days.create({number: dayToAdd})
	.then (function (createdDay){
		//console.log("created day ", createdDay);
		res.json(createdDay);
	});
	
})

dayRouter.delete("/days/:day", function (req, res){
	//console.log("delete days/day");
	var dayToDelete = Number(req.params.day);
	Days.findOne({number: dayToDelete})

		.remove(function(){
			// find all days
			// if the day.number is great than the day.number of the one we deleted, change the number
			// save the day

			Days.find()
			.then (function (days){
				if (days){
					for (var i=0; i<days.length; i++){
						if (days[i].number>dayToDelete){
							days[i].number--;
							
						}
					}
					Days.save()
					.then (function (){
							res.send();
					});
				// if (days){ // switch the stored day number 
				// 	console.log("in delete day, days: ", days);

					// day.number = day.number-1;
					// day.save()
					//
				} else {
					res.send();
				}
			})

		});

		
})







dayRouter.put("/days/:day/:attractionType", function (req, res){
	console.log("post days/id/attraction");

	var dayToAddTo = req.params.day;
	var attractionTypeToAdd = req.params.attractionType;
	var attractionID = req.body._id;

	Days.findOne({number: dayToAddTo})
	.then (function(day){
		day[attractionTypeToAdd].push(attractionID);
		return day.save()
		
	})
	.then (function (savedDay){
		res.send(savedDay);
	})

	
})

dayRouter.delete("/days/:day/:attractionType", function (req, res){
	console.log("post days/id/attraction");

	var dayToRemoveFrom = req.params.day;
	var attractionTypeToRemove = req.params.attractionType;
	var attractionID = req.body._id;


	Days.findOne({number: dayToRemoveFrom})
	.then (function(day){
		day[attractionTypeToRemove].splice(day[attractionTypeToRemove].indexOf(attractionID), 1);
		return day.save()
		
	})
	.then (function (savedDay){
		res.send(savedDay);
	})

	
})



module.exports = dayRouter;