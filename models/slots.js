const mongoose = require('mongoose');
const { Schema } = mongoose;

const slotSchema = new Schema({
  start: { type: Date, required: true },
  end: { type: Date, required: true },
  zone: { type: String, required: true },
  volunteers: [{ type: String, required: true }],
},{ collection : 'slots' });

module.exports = mongoose.model('Slots', slotSchema);