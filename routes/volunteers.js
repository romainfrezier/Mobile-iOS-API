const express = require('express');
const router = express.Router();

const volunteersCtrl = require('../controllers/volunteers');

router.post('/', volunteersCtrl.createVolunteer);
router.put('/:id', volunteersCtrl.modifyVolunteer);
router.delete('/:id', volunteersCtrl.deleteVolunteer);
router.get('/:id', volunteersCtrl.getOneVolunteer);
router.get('/', volunteersCtrl.getAllVolunteers);

module.exports = router;