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
			
			Days.findOne({number: (dayToDelete+1)})
			.then (function (day){
				
				if (day){ // switch the stored day number 
					day.number = day.number-1;
					day.save()
					.then (function (){
						res.send();
					})
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