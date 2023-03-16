const express = require('express');
const router = express.Router();

const zonesCtrl = require('../controllers/zones');

router.post('/',zonesCtrl.createZone);
router.put('/:id',zonesCtrl.updateZone);
router.delete('/:id',zonesCtrl.deleteZone);
router.get('/:id', zonesCtrl.getOneZone);
router.get('/', zonesCtrl.getAllZones);

module.exports = router;