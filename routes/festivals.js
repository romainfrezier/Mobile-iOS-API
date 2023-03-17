const express = require('express');
const router = express.Router();
const festivalsCtrl = require('../controllers/festivals');
const security = require('../middlewares/security.mid');

// Basic CRUD
router.post('/', security.isAdmin, festivalsCtrl.createFestival); // Create a new festival
router.put('/:id', security.isAdmin, festivalsCtrl.updateFestival); // Update a festival
router.delete('/:id', security.isAdmin, festivalsCtrl.deleteFestival); // Delete a festival
router.get('/:id', festivalsCtrl.getOneFestival); // Get a festival
router.get('/', festivalsCtrl.getAllFestivals); // Get all festivals

// Advanced Queries
router.get('/full/:id', festivalsCtrl.getFullFestival); // Get a festival with all the details and information
router.get('others/:firebaseId', festivalsCtrl.getOtherFestivals); // Get all the festivals that the user is not a volunteer of

module.exports = router;