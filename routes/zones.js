const express = require('express');
const router = express.Router();
const zonesCtrl = require('../controllers/zones');
const security = require('../middlewares/security.mid');

// Basic CRUD
router.post('/:festivalId', security.isAdmin, zonesCtrl.createZone); // Create a new zone
router.put('/:id', security.isAdmin, zonesCtrl.updateZone); // Update a zone
router.delete('/:id', security.isAdmin, zonesCtrl.deleteZone); // Delete a zone
router.get('/:id', zonesCtrl.getOneZone); // Get a zone
router.get('/', zonesCtrl.getAllZones); // Get all zones

// Advanced Queries
router.get('/festival/:festivalId', zonesCtrl.getAllZonesOfFestival); // Get all the zones of a festival
router.get('/volunteers/:id', zonesCtrl.getVolunteersOfZone); // Get all the volunteers of a zone
router.get('notFull', zonesCtrl.getNotFullZones); // Get all the zones that are not full

module.exports = router;