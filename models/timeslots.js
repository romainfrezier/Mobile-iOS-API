const mongoose = require('mongoose');
const { Schema } = mongoose;

const timeslotSchema = new Schema({
  start: { type: Date, required: true }, // Start of the slot
  end: { type: Date, required: true }, // End of the slot
  volunteers: {type : Array, default: []}, // Volunteers assigned to the slot
}, { collection : 'slots' });

module.exports = mongoose.model('Timeslots', timeslotSchema);