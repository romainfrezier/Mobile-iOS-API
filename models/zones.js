const mongoose = require('mongoose');
const { Schema } = mongoose;

const zoneSchema = new Schema({
  name: { type: String, required: true },
  volunteersNumber: { type: Number, required: true, default: 1 },
});

module.exports = mongoose.model('Zones', zoneSchema);