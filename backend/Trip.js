const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const TripsSchema = new Schema({
  origin: { type: String, required: true},
  destination: { type: String, required: true },
  travelMode: { type: String, required: true},
  distance: { type: String, required: true},
  duration: { type: String, required: true},
});

module.exports = mongoose.model('Trip', TripsSchema)