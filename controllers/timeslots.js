const Timeslots = require('../models/timeslots');
const Volunteers = require('../models/volunteers');

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

// TODO : Check
exports.getFullSlot = async (req, res, next) => {
    let slot = await Timeslots.findOne({
        _id: req.params.id
    });
    if (!slot) {
        return res.status(404).json({
            error: 'Slot not found'
        });
    }
    let volunteers = await Volunteers.find({
        _id: {
            $in: slot.volunteers
        }
    });
    if (!volunteers) {
        return res.status(404).json({
            error: 'Volunteers not found'
        });
    }
    const slotComplete = {
        _id: req.params.id,
        start: slot.start,
        end: slot.end,
        volunteers: volunteers,
    }
    return res.status(200).json(slotComplete);
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