const mongoose = require('mongoose');
const { Schema } = mongoose;

const timeslotSchema = new Schema({
  start: { type: Date, required: true },
  end: { type: Date, required: true },
  zone: { type: String },
  volunteers: {type : [String], default: []},
}, { collection : 'slots' });

module.exports = mongoose.model('Timeslots', timeslotSchema);