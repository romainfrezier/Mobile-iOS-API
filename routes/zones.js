const express = require('express');
const router = express.Router();

const zonesCtrl = require('../controllers/zones');

router.post('/',zonesCtrl.createZone);
router.put('/:id',zonesCtrl.modifyZone);
router.delete('/:id',zonesCtrl.deleteZone);
router.get('/:id', zonesCtrl.getOneZone);
router.get('/', zonesCtrl.getAllZones);
router.get('/:id/volunteers',zonesCtrl.getNbVolunteersRequired); //Get le nombre de bénévoles nécessaires pour une zone


module.exports = router;