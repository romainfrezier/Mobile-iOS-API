const Volunteers = require('../models/volunteers');
const Timeslots = require('../models/timeslots');

// Aux function to update the available slots of a volunteer
// Throws an error if the volunteer can not be updated or found
async function updateVolunteerAvailableSlots(volunteerId, slotId, availableSlots, action) {
    let volunteer = await Volunteers.findOneAndUpdate({_id: volunteerId}, {
        availableSlots: availableSlots
    });
    if (!volunteer) {
        throw new Error("Volunteer not found!");
    }
    if (action === "assign") {
        let updatedVolunteer = await Timeslots.updateOne({_id: slotId}, {$push: {volunteers: volunteerId}});
        if (!updatedVolunteer) {
            throw new Error("Volunteer not assigned!");
        }
    } else if (action === "free") {
        let updatedVolunteer = await Timeslots.updateOne({_id: slotId}, {$pull: {volunteers: volunteerId}});
        if (!updatedVolunteer) {
            throw new Error("Volunteer not freed!");
        }
    }

}

// TODO : Check
// Create a volunteer
// Route: POST /volunteers
// Body: {
//     firstName: String,
//     lastName: String,
//     email: String,
//     firebaseId: String, => firebaseId of the volunteer. Same as the one used in the Firebase authentication
//     festival: String, => festivalId if the volunteer had already registered to a festival
// }
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
// Update a volunteer from its id
// Route: PUT /volunteers/:id
// Body: {
//     firstName: String,
//     lastName: String,
//     email: String,
//     festival: String, => festivalId if the volunteer had already registered to a festival
//     availableSlots: [String] => array of timeslotIds selected by the volunteer as its available slots
// }
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
// Update a volunteer from its firebaseId
// Route: PUT /volunteers/firebase/:firebaseId
// Body: {
//     firstName: String,
//     lastName: String,
//     email: String,
//     festival: String, => festivalId if the volunteer had already registered to a festival
//     availableSlots: [String] => array of timeslotIds selected by the volunteer as its available slots
// }
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
// Assign a volunteer to a timeslot. Action possible only if the one who is doing the request is the festival admin
// Route: PUT /volunteers/assign/:id
// Body: {
//     slot: String, => timeslotId to assign the volunteer to
//     zone: String, => zoneId to assign the volunteer to
// }
exports.assignVolunteer = async (req, res, next) => {
    let volunteer = await Volunteers.findOne({_id: req.params.id});
    if (!volunteer) {
        res.status(400).json({
            error: "Volunteer not found"
        });
    }

    if (!volunteer.availableSlots) {
        return res.status(400).json({
            error: "Volunteer has no available slots"
        });
    }

    // Put the zone to the corresponding slot
    volunteer.availableSlots.forEach(slot => {
        if (slot.slot === req.body.slot) {
            slot.zone = req.body.zone;
        }
    });

    console.log(volunteer.availableSlots)

    // Update the volunteer and the timeslot with the aux function
    try {
        await updateVolunteerAvailableSlots(req.params.id, req.body.slot, volunteer.availableSlots, "assign");
        res.status(201).json({
            message: 'Volunteer assigned successfully!'
        });
    } catch (e) {
        res.status(400).json({
            error: e
        });
    }
}

// TODO : Check
// Free a volunteer from a timeslot. Action possible only if the one who is doing the request is the festival admin
// Route: PUT /volunteers/free/:id
// Body: {
//     slot: String, => timeslotId to free the volunteer from
// }
exports.freeVolunteer = async (req, res, next) => {
    let volunteer = await Volunteers.findOne({_id: req.params.id});
    if (!volunteer) {
        res.status(400).json({
            error: "Volunteer not found"
        });
    }

    if (!volunteer.availableSlots) {
        return res.status(400).json({
            error: "Volunteer has no available slots"
        });
    }

    // Remove the zone to the corresponding slot
    volunteer.availableSlots.forEach(slot => {
        if (slot.slot === req.body.slot) {
            slot.zone = null;
        }
    });

    // Update the volunteer and the timeslot with the aux function
    try {
        await updateVolunteerAvailableSlots(req.params.id, req.body.slot, volunteer.availableSlots, "free");
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
// Delete a volunteer from its id
// Route: DELETE /volunteers/:id
exports.deleteVolunteer = async (req, res, next) => {
    Volunteers.deleteOne({_id: req.params.id}).then(

        // Remove the volunteer from the timeslots concerned
        await Timeslots.updateMany({volunteers: req.params.id}, {$pull: {volunteers: req.params.id}}).then(
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
// Delete a volunteer from its firebaseId
// Route: DELETE /volunteers/firebase/:firebaseId
exports.deleteVolunteerByFirebaseId = async (req, res, next) => {
    let volunteer = await Volunteers.findOne({firebaseId: req.params.firebaseId});
    Volunteers.deleteOne({_id: volunteer._id}).then(

        // Remove the volunteer from the timeslots concerned
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

// Get a volunteer from its firebaseId
// Route: GET /volunteers/firebase/:firebaseId
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

// Get all the volunteers from a festival
// Route: GET /volunteers/festival/:festivalId
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

// Get a volunteer from its id
// Route: GET /volunteers/:id
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

// Get all the volunteers
// Route: GET /volunteers
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

// Get all the timeslots of a volunteer from its id
// Route: GET /volunteers/assignedSlots/:id
exports.getAssignedSlots = async (req, res, next) => {
    let volunteer = await Volunteers.findOne({_id: req.params.id});
    if (!volunteer) return res.status(404).json({message: "Volunteer not found"});
    let assignedSlots = [];

    // For each timeslot of the volunteer, check if the volunteer is assigned to it
    for (let i = 0; i < volunteer.availableSlots.length; i++) {
        let slot = await Timeslots.findOne({_id: volunteer.availableSlots[i]});
        if (!slot) return res.status(404).json({message: "Slot not found"});

        // Check if the volunteer is assigned to the slot, if yes, add it to the array
        if (slot.volunteers.includes(volunteer._id)){
            assignedSlots.push(slot);
        }
    }
    res.status(200).json(assignedSlots);
}

// Get all the timeslots of a volunteer from its firebase id
// Route: GET /volunteers/assignedSlots/firebase/:firebaseId
exports.getAssignedSlotsByFirebaseId = async (req, res, next) => {
    let volunteer = await Volunteers.findOne({firebaseId: req.params.firebaseId});
    if (!volunteer) return res.status(404).json({message: "Volunteer not found"});
    let assignedSlots = [];

    // For each timeslot of the volunteer, check if the volunteer is assigned to it
    for (let i = 0; i < volunteer.availableSlots.length; i++) {
        let slot = await Timeslots.findOne({_id: volunteer.availableSlots[i]});
        if (!slot) return res.status(404).json({message: "Slot not found"});

        // Check if the volunteer is assigned to the slot, if yes, add it to the array
        if (slot.volunteers.includes(volunteer._id)){
            assignedSlots.push(slot);
        }
    }
    res.status(200).json(assignedSlots);
}

// Make a volunteer an admin
// Route: PUT /volunteers/admin/:id
exports.makeAdmin = (req, res, next) => {
    Volunteers.updateOne({_id: req.params.id}, {isAdmin: true}).then(
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