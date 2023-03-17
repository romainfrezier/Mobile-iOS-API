const mongoose = require('mongoose');
const { Schema } = mongoose;

const zoneSchema = new Schema({
  name: { type: String, required: true }, // Name of the zone
  volunteersNumber: { type: Number, required: true, default: 1 }, // Minimum of volunteers required for this zone
});

module.exports = mongoose.model('Zones', zoneSchema);