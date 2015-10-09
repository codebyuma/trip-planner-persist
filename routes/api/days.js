var express = require('express');
var dayRouter = express.Router();
var models = require('../../models');
var Days = models.Days;
var Promise = require('bluebird');

dayRouter.get("/days/", function(req, res){
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

/** HERE *//
dayRouter.post("/days/:day", function (req, res){
	
	var dayToAdd = Number(req.params.day);

	newDay = new Days ({number: dayToAdd});

	newDay.save(function(createdDay){
		console.log("created day ", createdDay);
		res.json(createdDay);
	});
	
})


dayRouter.delete("/days/:day", function (req, res){
	console.log("delete days/day");
	var dayToDelete = Number(req.params.day);
	// Days.delete({number: dayToDelete}).exec()
	// .then(function(removedDay){
	// 	console.log(removedDay);
	// });
})



dayRouter.post("/days/:id/:attraction", function (req, res){
	console.log("post days/id/attraction");

	var dayId = req.params.id;
	var attractionToAdd = req.params.attraction;

	// somehow tell if this is to add OR remove attraction
	// if (attractionToAdd === "restaurants"){
	// 	Days.findByIdAndUpdate(dayId, {restaurants: } )
	// }
})


module.exports = dayRouter;