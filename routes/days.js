const express = require('express');
const router = express.Router();
const daysCtrl = require('../controllers/days');
const security = require('../middlewares/security.mid');

// Basic CRUD
router.post('/', security.isAdmin,daysCtrl.createDay); // Create a new day
router.put('/:id', security.isAdmin, daysCtrl.updateDay); // Update a day
router.delete('/:id', security.isAdmin, daysCtrl.deleteDay); // Delete a day
router.get('/:id', daysCtrl.getOneDay); // Get a day
router.get('/', daysCtrl.getAllDays); // Get all days

// Advanced Queries
router.get('/festival/:festivalId', daysCtrl.getAllDaysOfFestival); // Get all the days of a festival

module.exports = router;