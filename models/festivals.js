const mongoose = require('mongoose');
const { Schema } = mongoose;

const festivalSchema = new Schema({
  name: { type: String, required: true }, // Name of the festival
  zones: { type: Array, default: [] }, // Zones of the festival
  days: { type: Array, default: [] }, // Days of the festival
}, { collection : 'festivals' });

module.exports = mongoose.model('Festivals', festivalSchema);
