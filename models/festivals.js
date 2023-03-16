const mongoose = require('mongoose');
const { Schema } = mongoose;

const festivalSchema = new Schema({
  name: { type: String, required: true },
  zones: { type: [String], default: [] },
  days: { type: [String], default: [] },
}, { collection : 'festivals' });

module.exports = mongoose.model('Festivals', festivalSchema);
