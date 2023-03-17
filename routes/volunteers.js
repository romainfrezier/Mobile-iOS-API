const express = require('express');
const router = express.Router();
const volunteersCtrl = require('../controllers/volunteers');
const security = require('../middlewares/security.mid');

// Basic CRUD
router.post('/', volunteersCtrl.createVolunteer); // Create a new volunteer
router.put('/:id', volunteersCtrl.updateVolunteer); // Update a volunteer
router.delete('/:id', volunteersCtrl.deleteVolunteer); // Delete a volunteer
router.get('/:id', volunteersCtrl.getOneVolunteer); // Get a volunteer
router.get('/', volunteersCtrl.getAllVolunteers); // Get all volunteers

// Firebase CRUD
router.get('/firebase/:id', volunteersCtrl.getVolunteerByFirebaseId); // Get a volunteer by firebase id
router.put('/firebase/:id', volunteersCtrl.updateVolunteerByFirebaseId); // Update a volunteer by firebase id
router.delete('/firebase/:id', volunteersCtrl.deleteVolunteerByFirebaseId); // Delete a volunteer by firebase id

// Advanced Queries
router.get('/festival/:festivalId', volunteersCtrl.getVolunteersByFestival); // Get all the volunteers of a festival
router.get('/assignedSlots/:id', volunteersCtrl.getAssignedSlots); // Get all the assigned slots of a volunteer
router.put('/assign/:id', security.isAdmin, volunteersCtrl.assignVolunteer); // Assign a volunteer to a slot
router.put('/free/:id', security.isAdmin, volunteersCtrl.freeVolunteer); // Free a volunteer from a slot

module.exports = router;