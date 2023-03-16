const mongoose = require('mongoose');
const { Schema } = mongoose;

const festivalSchema = new Schema({
  name: { type: String, required: true },

  zones: [{ type: String, required: true }],
  days: [{ type: String, required: true }],
}, { collection : 'festivals' });

module.exports = mongoose.model('Festivals', festivalSchema);
