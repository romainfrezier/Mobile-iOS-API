const express = require('express');
const router = express.Router();

const slotsCtrl = require('../controllers/slots');

router.get('/:id', slotsCtrl.getOneSlot);
router.get('/', slotsCtrl.getAllSlots);

module.exports = router;