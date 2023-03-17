const express = require('express');
const router = express.Router();

const volunteersCtrl = require('../controllers/volunteers');

router.post('/', volunteersCtrl.createVolunteer);
router.put('/:id', volunteersCtrl.updateVolunteer);
router.delete('/:id', volunteersCtrl.deleteVolunteer);
router.get('/:id', volunteersCtrl.getOneVolunteer);
router.get('/firebase/:id', volunteersCtrl.getVolunteerByFirebaseId);
router.get('/festival/:festivalId', volunteersCtrl.getVolunteersByFestival);
router.get('/', volunteersCtrl.getAllVolunteers);

module.exports = router;