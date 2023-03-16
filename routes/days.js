const express = require('express');
const router = express.Router();

const daysCtrl = require('../controllers/days');

router.post('/', daysCtrl.createDay);
router.put('/:id', daysCtrl.updateDay);
router.delete('/:id', daysCtrl.deleteDay);
router.get('/:id', daysCtrl.getOneDay);
router.get('/', daysCtrl.getAllDays);

module.exports = router;