const Timeslots = require('../models/timeslots');

exports.getOneSlot = (req, res, next) => {
    Timeslots.findOne({
        _id: req.params.id
    }).then(
        (slot) => {
            res.status(200).json(slot);
        }
    ).catch(
        (error) => {
            res.status(404).json({
                error: error
            });
        }
    );
}

exports.getAllSlots = (req, res, next) => {
    Timeslots.find().then(
        (slots) => {
            res.status(200).json(slots);
        }
    ).catch(
        (error) => {
            res.status(400).json({
                error: error
            });
        }
    );
}