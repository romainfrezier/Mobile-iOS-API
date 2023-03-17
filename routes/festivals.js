const express = require('express');
const router = express.Router();

const festivalsCtrl = require('../controllers/festivals');

router.post('/', festivalsCtrl.createFestival);
router.put('/:id', festivalsCtrl.updateFestival);
router.delete('/:id', festivalsCtrl.deleteFestival);
router.get('/:id', festivalsCtrl.getOneFestival);
router.get('/', festivalsCtrl.getAllFestivals);

router.get('/full/:id', festivalsCtrl.getFullFestival);
router.get('others/:firebaseId', festivalsCtrl.getOtherFestivals);

module.exports = router;