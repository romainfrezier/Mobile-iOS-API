const Volunteers = require('../models/volunteers');
const Timeslots = require('../models/timeslots');

function updateVolunteerAvailableSlots(volunteerId, slotId, availableSlots) {
    Volunteers.findOneAndUpdate({_id: volunteerId}, {
        availableSlots: availableSlots
    });
    Timeslots.updateMany({_id: slotId}, {$push: {volunteers: volunteerId}}).then(
        () => {
            console.log("Volunteer assigned successfully!");
        }
    ).catch(
        (error) => {
            throw error;
        }
    );
}

// TODO : Check
exports.createVolunteer = (req, res, next) => {
    const volunteer = new Volunteers({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        firebaseId: req.body.firebaseId,
        festival: req.body.festival,
    });
    volunteer.save().then(
        () => {
            res.status(201).json({
                message: 'Volunteer saved successfully!'
            });
        }
    ).catch(
        (error) => {
            res.status(400).json({
                error: error
            });
        }
    );
}

// TODO : Check
exports.updateVolunteer = (req, res, next) => {
    Volunteers.findOneAndUpdate({_id: req.params.id}, {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        festival: req.body.festival,
        availableSlots: req.body.availableSlots
    }).then(
        () => {
            res.status(201).json({
                message: 'Volunteer updated successfully!'
            });
        }
    ).catch(
        (error) => {
            res.status(400).json({
                error: error
            });
        }
    );
}

// TODO : Check
exports.updateVolunteerByFirebaseId = (req, res, next) => {
    Volunteers.findOneAndUpdate({firebaseId: req.params.firebaseId}, {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        festival: req.body.festival,
        availableSlots: req.body.availableSlots,
    }).then(
        () => {
            res.status(201).json({
                message: 'Volunteer updated successfully!'
            });
        }
    ).catch(
        (error) => {
            res.status(400).json({
                error: error
            });
        }
    );
}

// TODO : Check
exports.assignVolunteer = async (req, res, next) => {
    let volunteer = await Volunteers.findOne({_id: req.params.id});
    if (!volunteer) {
        res.status(400).json({
            error: "Volunteer not found"
        });
    }
    volunteer.availableSlots.forEach(slot => {
        if (slot.slot === req.body.slotId) {
            slot.zone = req.body.zoneId;
        }
    });
    try {
        updateVolunteerAvailableSlots(req.params.id, req.body.slotId, null, volunteer.availableSlots);
        res.status(201).json({
            message: 'Volunteer freed successfully!'
        });
    } catch (e) {
        res.status(400).json({
            error: e
        });
    }
}

// TODO : Check
exports.freeVolunteer = async (req, res, next) => {
    let volunteer = await Volunteers.findOne({_id: req.params.id});
    if (!volunteer) {
        res.status(400).json({
            error: "Volunteer not found"
        });
    }
    volunteer.availableSlots.forEach(slot => {
        if (slot.slot === req.body.slotId) {
            slot.zone = null;
        }
    });
    try {
        updateVolunteerAvailableSlots(req.params.id, req.body.slotId, null, volunteer.availableSlots);
        res.status(201).json({
            message: 'Volunteer freed successfully!'
        });
    } catch (e) {
        res.status(400).json({
            error: e
        });
    }
}

// TODO : Check
exports.deleteVolunteer = async (req, res, next) => {
    Volunteers.deleteOne({_id: req.params.firebaseId}).then(
        await Slots.updateMany({volunteers: req.params.id}, {$pull: {volunteers: req.params.id}}).then(
            () => {
                res.status(200).json({
                    message: 'Volunteer deleted successfully!'
                });
            }).catch(
            (error) => {
                res.status(400).json({
                    error: error
                });
            }
        )
    ).catch(
        (error) => {
            res.status(400).json({
                error: error
            });
        }
    )
}

// TODO : Check
exports.deleteVolunteerByFirebaseId = async (req, res, next) => {
    let volunteer = await Volunteers.findOne({firebaseId: req.params.firebaseId});
    Volunteers.deleteOne({_id: volunteer._id}).then(
        await Timeslots.updateMany({volunteers: volunteer.id}, {$pull: {volunteers: volunteer.id}}).then(
            () => {
                res.status(200).json({
                    message: 'Volunteer deleted successfully!'
                });
            }).catch(
            (error) => {
                res.status(400).json({
                    error: error
                });
            }
        )
    ).catch(
        (error) => {
            res.status(400).json({
                error: error
            });
        }
    )
}

exports.getVolunteerByFirebaseId = (req, res, next) => {
    Volunteers.findOne({
        firebaseId: req.params.firebaseId
    }).then(
        (volunteer) => {
            res.status(200).json(volunteer);
        }
    ).catch(
        (error) => {
            res.status(404).json({
                error: error
            });
        }
    );
}

exports.getVolunteersByFestival = (req, res, next) => {
    Volunteers.find({festival: req.params.festivalId}).then(
        (volunteers) => {
            res.status(200).json(volunteers);
        }
    ).catch(
        (error) => {
            res.status(400).json({
                error: error
            });
        }
    );
}

exports.getOneVolunteer = (req, res, next) => {
    Volunteers.findOne({
        _id: req.params.id
    }).then(
        (volunteer) => {
            res.status(200).json(volunteer);
        }
    ).catch(
        (error) => {
            res.status(404).json({
                error: error
            });
        }
    );
}

exports.getAllVolunteers = (req, res, next) => {
    Volunteers.find().then(
        (volunteers) => {
            res.status(200).json(volunteers);
        }
    ).catch(
        (error) => {
            res.status(400).json({
                error: error
            });
        }
    );
}

exports.getAssignedSlots = async (req, res, next) => {
    let volunteer = await Volunteers.findOne({_id: req.params.id});
    if (!volunteer) return res.status(404).json({message: "Volunteer not found"});
    let assignedSlots = [];
    for (let i = 0; i < volunteer.availableSlots.length; i++) {
        let slot = await Slots.findOne({_id: volunteer.availableSlots[i]});
        if (!slot) return res.status(404).json({message: "Slot not found"});
        if (slot.volunteers.includes(volunteer._id)){
            assignedSlots.push(slot);
        }
    }
    res.status(200).json(assignedSlots);
}