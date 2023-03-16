const mongoose = require('mongoose');

const volunteerSchema = new mongoose.Schema({
  first_name: {type: String,required: true},
  last_name: {type: String, required: true},
  email: { type: String, required: true, unique: true },
  firebaseId: { type: String, required: true },
  festival: { type: String, required: true },
  isAdmin: { type: Boolean, required: true },
  available_slots: [{
    slot: { type: String, required: true },
    zone: { type: String, default: null },
  }],
}, { collection : 'volunteers' });

module.exports = mongoose.model('Volunteers', volunteerSchema);
