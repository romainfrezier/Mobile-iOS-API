const mongoose = require('mongoose');
const { Schema } = mongoose;

const daySchema = new Schema({
  name: { type: String, required: true }, // Name of the day
  hours: { // Hours of the day
    opening: { type: Date, required: true }, // Opening of the day
    closing: { type: Date, required: true } // Closing of the day
  },
  slots: { type: Array, default: [] }, // Slots of the day
}, { collection : 'days' });

module.exports = mongoose.model('Days', daySchema);