var mongoose = require('mongoose');
var PlaceSchema = require('./place').schema;
var Days;

var daySchema = new mongoose.Schema({
  number: Number,
  hotels: [{type: mongoose.Schema.Types.ObjectId, ref: 'Hotels'}],
  restaurants: [{type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant'}],
  activities: [{type: mongoose.Schema.Types.ObjectId, ref: 'Activity'}]
})

Days = mongoose.model('Days', daySchema);


module.exports = Days;