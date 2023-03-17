const mongoose = require('mongoose');
const { Schema } = mongoose;

const daySchema = new Schema({
  name: { type: String, required: true },
  hours: {
    opening: { type: Date, required: true },
    closing: { type: Date, required: true }
  },
  slots: { type: Array, default: [] },
}, { collection : 'days' });

module.exports = mongoose.model('Days', daySchema);