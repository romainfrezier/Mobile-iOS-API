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
router.get('/firebase/:firebaseId', volunteersCtrl.getVolunteerByFirebaseId); // Get a volunteer by firebase id
router.put('/firebase/:firebaseId', volunteersCtrl.updateVolunteerByFirebaseId); // Update a volunteer by firebase id
router.delete('/firebase/:firebaseId', volunteersCtrl.deleteVolunteerByFirebaseId); // Delete a volunteer by firebase id

// Advanced Queries
router.get('/festival/:festivalId', volunteersCtrl.getVolunteersByFestival); // Get all the volunteers of a festival
router.get('/assignedSlots/:id', volunteersCtrl.getAssignedSlots); // Get all the assigned slots of a volunteer
router.get('/assignedSlots/firebase/:firebaseId', volunteersCtrl.getAssignedSlotsByFirebaseId); // Get all the assigned slots of a volunteer from a firebase id
router.put('/assign/:id', security.isAdmin, volunteersCtrl.assignVolunteer); // Assign a volunteer to a slot
router.put('/free/:id', security.isAdmin, volunteersCtrl.freeVolunteer); // Free a volunteer from a slot
router.put('/admin/:id', security.isAdmin, volunteersCtrl.makeAdmin); // Make a volunteer an admin
router.put('/festival/:id', volunteersCtrl.changeFestival); // Change the festival of a volunteer
router.put('/festival/firebase/:firebaseId', volunteersCtrl.changeFestivalByFirebaseId); // Change the festival of a volunteer from its firebase id

module.exports = router;