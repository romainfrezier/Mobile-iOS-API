const Festivals = require('../models/festivals');
const Zones = require('../models/zones');
const Days = require('../models/days');
const Timeslots = require('../models/timeslots');
const Volunteers = require('../models/volunteers');
const timeslots = require('../commons/timeslots');

// Aux function to add zones if they are passed in the request body at the creation of a festival
// Returns an array of the ids of the zones created
async function addZones(zones) {
    let zonesIds = [];
    for(zone of zones){
        let newZone = new Zones({
            name: zone.name,
            volunteersNumber: zone.volunteersNumber
        });
        await newZone.save((err, zone) => {
            if (err) {
                console.log(err);
            } else {
                zonesIds.push(zone._id);
            }
        })
    }
    return zonesIds;
}

// Aux function to add days that are passed in the request body at the creation of a festival
// Returns an array of the ids of the days created
async function addDays(days) {
    let daysIds = [];
    for(let day of days){
        let slots = await timeslots.addSlots(day.hours.opening, day.hours.closing);
        let newDay = new Days({
            name: day.name,
            hours: {
                opening: day.hours.opening,
                closing: day.hours.closing
            },
            slots: slots
        });
        try {
            let result = await newDay.save();
            daysIds.push(result._id);
        } catch (error) {
            console.log(error);
        }
    }
    console.log("days created");
    return daysIds;
}

// Create a festival from all the data passed in the request body
// Route: POST /festivals
// Body: {
//     "name": String,
//     "zones": [
//         {
//             "name": String,
//             "volunteersNumber": Number => minimum number of volunteers needed for this zone
//         }
//     ],
//     "days": [
//         {
//             "name": String,
//             "hours": {
//                 "opening": Date,
//                 "closing": Date
//             }
//         }
//     ],
// }
exports.createFestival = async (req, res, next) => {
    // Add zones if they are passed in the request body
    let zones = [];
    if (req.body.zones) {
        zones = await addZones(req.body.zones);
    }

    // Add days if they are passed in the request body
    let daysCreated = [];
    if (req.body.days) {
        daysCreated = await addDays(req.body.days);
    }

    // Create festival
    const festival = new Festivals({
        name: req.body.name,
        zones: zones,
        days: daysCreated,
    });
    festival.save().then(
        () => {
            console.log("festival created");
            res.status(201).json({
                message: 'Festival saved successfully!'
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

// Change the name of a festival from its id
// Route: PUT /festivals/name/:id
// Body: {
//     "name": String
// }
exports.changeFestivalName = async (req, res, next) => {
    let festival = await Festivals.findOne({_id: req.params.id});
    if (!festival) {
        return res.status(404).json({
            error: 'Festival not found'
        });
    }
    festival.name = req.body.name;
    festival.save().then(
        () => {
            res.status(201).json({
                message: 'Festival name changed successfully!'
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
// Update a festival from its id. Only an admin can do this
// Route: PUT /festivals/:id
// Body: {
//     "name": String,
//     "zones": [
//         {
//             "name": String,
//             "volunteersNumber": Number => minimum number of volunteers needed for this zone
//         }
//     ],
//     "days": [
//         {
//             "name": String,
//             "hours": {
//                 "opening": Date,
//                 "closing": Date
//             }
//         }
//     ]
// }
exports.updateFestival = async (req, res, next) => {

    let festival = await Festivals.findOne({_id: req.params.id});
    if (!festival) {
        return res.status(404).json({
            error: 'Festival not found'
        });
    }

    // Update zones if they are passed in the request body
    if (req.body.zones) {

        // Add new zones
        for (let zone of req.body.zones) {
            if (!zone._id) {
                let newZone = new Zones({
                    name: zone.name,
                    volunteersNumber: zone.volunteersNumber
                });
                await newZone.save((err, createdZone) => {
                    if (err) {
                        console.log(err);
                    } else {
                        festival.zones.push(createdZone._id);
                        zone._id = createdZone._id;
                    }
                })
            }
        }

        // Remove zones that are not in the request body
        for (let zone of festival.zones) {
            if (!req.body.zones.includes(zone._id)) {
                await Zones.findOneAndDelete({_id: zone._id});
                festival.zones.splice(festival.zones.indexOf(zone._id), 1);
            }
        }

    }

    // Update days if they are passed in the request body
    if (req.body.days) {

        // Add new days
        for (let day of req.body.days) {
            if (!day._id) {
                let slots = await timeslots.addSlots(day.hours.opening, day.hours.closing);
                let newDay = new Days({
                    name: day.name,
                    hours: {
                        opening: day.hours.opening,
                        closing: day.hours.closing
                    },
                    slots: slots
                });
                try {
                    let result = await newDay.save();
                    festival.days.push(result._id);
                    day._id = result._id;

                } catch (error) {
                    console.log(error);
                }
            }
        }

        // Remove days that are not in the request body
        for (let day of festival.days) {
            if (!req.body.days.includes(day._id)) {
                for (let slot of day.slots) {
                    let volunteers = await Volunteers.find({availableSlots: {$elemMatch: {slot: slot._id}}});
                    for (let volunteer of volunteers) {
                        volunteer.availableSlots.splice(volunteer.availableSlots.indexOf(slot._id), 1);
                        await volunteer.save();
                    }
                    await Timeslots.findOneAndDelete({_id: slot._id});
                }
                await Days.findOneAndDelete({_id: day._id});
                festival.days.splice(festival.days.indexOf(day._id), 1);
            }
        }
    }

    Festivals.findOneAndUpdate({_id: req.params.id}, {
        name: festival.name,
        zones: festival.zones,
        days: festival.days,
    }).then(
        () => {
            res.status(201).json({
                message: 'Festival updated successfully!'
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
// Delete a festival from its id
// Route: DELETE /festivals/:id
// }
exports.deleteFestival = async (req, res, next) => {
    let festival = await Festivals.findOne({_id: req.params.id});
    if (!festival) {
        return res.status(404).json({
            error: 'Festival not found'
        });
    } else {

        // Delete all the zones of the festival
        for (let zoneId of festival.zones) {
            Zones.deleteOne({_id: zoneId}).then(
                () => {
                    console.log("zone deleted");
                }
            ).catch(
                (error) => {
                    console.log(error);
                }
            );
        }

        // Delete all the days of the festival
        for (let dayId of festival.days) {
            let day = await Days.findOne({_id: dayId});
            if (!day) {
                return res.status(404).json({
                    error: 'Day not found'
                });
            } else {

                // Delete all the timeslots of the day
                for (let slotId of day.slots) {
                    Timeslots.deleteOne({_id: slotId}).then(
                        () => {
                            console.log("slot deleted");
                        }
                    ).catch(
                        (error) => {
                            console.log(error);
                        }
                    );
                }

                // Delete the day
                Days.deleteOne({_id: dayId}).then(
                    () => {
                        console.log("day deleted");
                    }
                ).catch(
                    (error) => {
                        console.log(error);
                    }
                );
            }
        }

        // Remove the festival from the concerned volunteers
        Volunteers.updateMany({festival: req.params.id}, {festival: null, availableSlots: []}).then(
            () => {
                console.log("volunteers updated");
            }
        ).catch(
            (error) => {
                console.log(error);
            }
        );

        // Delete the festival
        Festivals.deleteOne({_id: req.params.id}).then(
            () => {
                res.status(200).json({
                    message: 'Festival deleted successfully!'
                });
            }).catch(
            (error) => {
                res.status(400).json({
                    error: error
                });
            }
        );
    }

}

// Get the festival with all the information related to it
// Route: GET /festivals/full/:id
exports.getFullFestival = async (req, res, next) => {
    let festival = await Festivals.findOne({_id: req.params.id});
    if (!festival) {
        return res.status(404).json({
            error: 'Festival not found'
        });
    }

    // Get the zones of the festival
    let zones = await Zones.find({_id: {$in: festival.zones}});
    if (!zones) {
        return res.status(404).json({
            error: 'Zones not found'
        });
    }

    // Get the days of the festival
    let days = await Days.find({_id: {$in: festival.days}});
    if (!days) {
        return res.status(404).json({
            error: 'Days not found'
        });
    }

    // Get the timeslots of the festival
    for (let day of days) {
        day.slots = await Timeslots.find({_id: {$in: day.slots}});
        for (let slot of day.slots) {
            slot.volunteers = await Volunteers.find({_id: {$in: slot.volunteers}});
        }
    }

    // Build the festival object and return it
    const festivalComplete = {
        _id: req.params.id,
        name: festival.name,
        zones: zones,
        days: days,
    }
    return res.status(200).json(festivalComplete);
}

// Get one festival with the minimum of information
// Route: GET /festivals/:id
exports.getOneFestival = (req, res, next) => {
    Festivals.findOne({
        _id: req.params.id
    }).then(
        (festival) => {
            res.status(200).json(festival);
        }
    ).catch(
        (error) => {
            res.status(404).json({
                error: error
            });
        }
    );
}

// Get all the festivals
// Route: GET /festivals
exports.getAllFestivals = (req, res, next) => {
    Festivals.find().then(
        (festivals) => {
            res.status(200).json(festivals);
        }
    ).catch(
        (error) => {
            res.status(400).json({
                error: error
            });
        }
    );
}

// Get all the festivals that are not the one of the volunteer
// Route: GET /festivals/other/:id
exports.getOtherFestivals = async (req, res, next) => {
    let festivals = await Festivals.find();
    let volunteer = await Volunteers.findOne({_id: req.params.id});
    if (!volunteer) {
        return res.status(404).json({
            error: 'Volunteer not found'
        });
    }
    let festivalsOther = [];
    for (let festival of festivals) {
        if (festival._id.toString() !== volunteer.festival) {
            festivalsOther.push(festival);
        }
    }
    return res.status(200).json(festivalsOther);
}