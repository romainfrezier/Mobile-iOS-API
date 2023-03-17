const mongoose = require('mongoose');
const { Schema } = mongoose;

const festivalSchema = new Schema({
  name: { type: String, required: true },
  zones: { type: Array, default: [] },
  days: { type: Array, default: [] },
}, { collection : 'festivals' });

module.exports = mongoose.model('Festivals', festivalSchema);
