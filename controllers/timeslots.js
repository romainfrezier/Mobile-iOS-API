const Timeslots = require('../models/timeslots');
const Volunteers = require('../models/volunteers');

// Get one timeslot from its id
// Route: GET /slots/:id
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
// Get one timeslot from its id with the volunteers
// Route: GET /slots/full/:id
exports.getFullSlot = async (req, res, next) => {
    let slot = await Timeslots.findOne({
        _id: req.params.id
    });
    if (!slot) {
        return res.status(404).json({
            error: 'Slot not found'
        });
    }

    // Get the volunteers assigned to the slot
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

    // Build the slot object and return it
    const slotComplete = {
        _id: req.params.id,
        start: slot.start,
        end: slot.end,
        volunteers: volunteers,
    }
    return res.status(200).json(slotComplete);
}

// Get all timeslots
// Route: GET /slots
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