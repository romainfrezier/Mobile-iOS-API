const express = require('express');
const router = express.Router();

const volunteersCtrl = require('../controllers/volunteers');

router.post('/', volunteersCtrl.createVolunteer);
router.put('/:id', volunteersCtrl.updateVolunteer);
router.delete('/:id', volunteersCtrl.deleteVolunteer);
router.get('/:id', volunteersCtrl.getOneVolunteer);
router.get('/', volunteersCtrl.getAllVolunteers);

router.get('/firebase/:id', volunteersCtrl.getVolunteerByFirebaseId);
router.put('/firebase/:id', volunteersCtrl.updateVolunteerByFirebaseId);
router.delete('/firebase/:id', volunteersCtrl.deleteVolunteerByFirebaseId);

router.get('/festival/:festivalId', volunteersCtrl.getVolunteersByFestival);
router.get('/assigned/:id', volunteersCtrl.getAssignedSlots);
router.put('/assign/:id', volunteersCtrl.assignVolunteer);
router.put('/free/:id', volunteersCtrl.freeVolunteer);

module.exports = router;