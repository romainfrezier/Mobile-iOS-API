const express = require('express');
const router = express.Router();
const slotsCtrl = require('../controllers/timeslots');

// Basic Queries
router.get('/:id', slotsCtrl.getOneSlot); // Get a slot
router.get('/', slotsCtrl.getAllSlots); // Get all slots

// Advanced Queries
router.get('full/:id', slotsCtrl.getFullSlot); // Get a slot with all the details and information

module.exports = router;