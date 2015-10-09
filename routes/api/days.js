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


dayRouter.post("/days/:day", function (req, res){
	
	var dayToAdd = Number(req.params.day);
	console.log("day to add" , req.params.day);

	// newDay = new Days ({number: dayToAdd});

	// newDay.save(function(createdDay){
	// 	console.log("created day ", createdDay);
	// 	res.json(createdDay);
	// });

	Days.create({number: dayToAdd})
	.then (function (createdDay){
		//console.log("created day ", createdDay);
		res.json(createdDay);
	});
	
})

dayRouter.delete("/days/:day", function (req, res){
	console.log("delete days/day");
	var dayToDelete = Number(req.params.day);
	Days.findOne({number: dayToDelete})
	// .then(function(day){
	// 	console.log("day",day);
	// 	res.send();
	// })
		.remove(function(){
			console.log("in remove");
			console.log("then of find one .remove ");
			res.send();
		})

		
})



dayRouter.put("/days/:day/:attractionType", function (req, res){
	console.log("post days/id/attraction");

	var dayToAddTo = req.params.day;
	var attractionTypeToAdd = req.params.attractionType;
	var attractionID = req.body._id;

	// console.log("day to add to " + dayToAddTo);
	// console.log(attractionTypeToAdd);
	// console.log("attraction id " + attractionID);

	Days.findOne({number: dayToAddTo})
	.then (function(day){
		// console.log("found day " , day);
	   // console.log("attraction type array ", day[attractionTypeToAdd]);
		day[attractionTypeToAdd].push(attractionID);
		return day.save()
		
	})
	.then (function (savedDay){
		res.send(savedDay);
	})

	// console.log("attract id " , attractionID);

	// somehow tell if this is to add OR remove attraction
	// if (attractionToAdd === "restaurants"){
	// 	Days.findByIdAndUpdate(dayId, {restaurants: } )
	// }
})


module.exports = dayRouter;