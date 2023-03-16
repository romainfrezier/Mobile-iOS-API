const mongoose = require('mongoose');

const volunteerSchema = new mongoose.Schema({
  firstName: {type: String,required: true},
  lastName: {type: String, required: true},
  email: { type: String, required: true, unique: true },
  firebaseId: { type: String, required: true },
  festival: { type: String, required: true },
  isAdmin: { type: Boolean, required: true },
  availableSlots: [{
    slot: { type: String, default: null },
    zone: { type: String, default: null },
  }],
}, { collection : 'volunteers' });

module.exports = mongoose.model('Volunteers', volunteerSchema);
