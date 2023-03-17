const mongoose = require('mongoose');

const volunteerSchema = new mongoose.Schema({
  firstName: {type: String,required: true}, // First name of the volunteer
  lastName: {type: String, required: true}, // Last name of the volunteer
  email: { type: String, required: true }, // Email of the volunteer
  firebaseId: { type: String, required: true }, // Firebase ID of the volunteer
  festival: { type: String }, // Festival of the volunteer
  isAdmin: { type: Boolean, default: false }, // Is the volunteer an admin
  availableSlots: { type: [{ // Available slots of the volunteer
    slot: { type: String, default: null }, // Slot where the volunteer is available
    zone: { type: String, default: null }, // Zone where the volunteer is assigned if he is assigned on this slot
  }], default: []},
}, { collection : 'volunteers' });

module.exports = mongoose.model('Volunteers', volunteerSchema);
