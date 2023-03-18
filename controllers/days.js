const Days = require('../models/days');
const timeslotsFunctions = require('../commons/timeslots');
const Timeslots = require('../models/timeslots');
const Festivals = require('../models/festivals');

// Create a new day with its slots
// Route : POST /api/days
// Body : {
//     "name": String,
//     "hours": {
//         "opening": Date,
//         "closing": Date
//     }
// }
exports.createDay = (req, res, next) => {
    const day = new Days({
        name: req.body.name,
        hours: {
            opening: req.body.hours.opening,
            closing: req.body.hours.closing
        },
        slots: timeslotsFunctions.addSlots(req.body.hours.opening, req.body.hours.closing)
    });
    day.save().then(
        () => {
            res.status(201).json({
                message: 'Day saved successfully!'
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

// Update a day from its id, remove all its slots and create new ones according to the new hours
// Route : PUT /api/days/:id
// Body : {
//     "name": String,
//     "hours": {
//         "opening": Date,
//         "closing": Date
//     }
// }
exports.updateDay = async (req, res, next) => {
    let dayToUpdate = await Days.findOne({_id: req.params.id});

    // Delete all slots of the day
    for (let slotId of dayToUpdate.slots) {
        await Timeslots.deleteOne({_id: slotId}).then(
            () => {
                console.log("slot deleted");
            }
        ).catch(
            (error) => {
                console.log(error);
            }
        );
    }

    // Create new slots and update the day
    let slots = await timeslotsFunctions.addSlots(req.body.hours.opening, req.body.hours.closing)
    Days.updateOne({_id: req.params.id}, {
        name: req.body.name,
        hours: {
            opening: req.body.hours.opening,
            closing: req.body.hours.closing
        },
        slots: slots
    }).then(
        () => {
            res.status(201).json({
                message: 'Day updated successfully!'
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
// Delete a day from its id in the database
// Route : DELETE /api/days/:id
exports.deleteDay = async (req, res, next) => {
    let dayToDelete = await Days.findOne({_id: req.params.id});

    // Delete all slots of the day
    for (let slotId of dayToDelete.slots) {
        await Timeslots.deleteOne({_id: slotId}).then(
            () => {
                console.log("slot deleted");
            }
        ).catch(
            (error) => {
                console.log(error);
            }
        );
    }

    Days.deleteOne({_id: req.params.id}).then(
        () => {
            res.status(200).json({
                message: 'Day deleted successfully!'
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

// Get one day from its id in the database
// Route : GET /api/days/:id
exports.getOneDay = (req, res, next) => {
    Days.findOne({
        _id: req.params.id
    }).then(
        (day) => {
            res.status(200).json(day);
        }
    ).catch(
        (error) => {
            res.status(404).json({
                error: error
            });
        }
    );
}

// Get all days from the database
// Route : GET /api/days
exports.getAllDays = (req, res, next) => {
    Days.find().then(
        (days) => {
            res.status(200).json(days);
        }
    ).catch(
        (error) => {
            res.status(400).json({
                error: error
            });
        }
    );
}

// Get all the days of a festival from its id
// Route : GET /api/days/:festivalId
exports.getAllDaysOfFestival = (req, res, next) => {
    Festivals.findOne({_id: req.params.festivalId}).then(
        (festival) => {
            Days.find({_id: {$in: festival.days}}).then(
                (days) => {
                    // Get all the slots of each day
                    let promises = [];
                    for (let day of days) {
                        promises.push(Timeslots.find({_id: {$in: day.slots}}));
                    }
                    Promise.all(promises).then(
                        (slots) => {
                            // Add the slots to the days
                            for (let i = 0; i < days.length; i++) {
                                days[i].slots = slots[i];
                            }
                            res.status(200).json(days);
                        }
                    ).catch(
                        (error) => {
                            res.status(400).json({
                                error: error
                            });
                        }
                    );
                }
            ).catch(
                (error) => {
                    res.status(400).json({
                        error: error
                    });
                }
            );
        }
    ).catch(
        (error) => {
            res.status(400).json({
                error: error
            });
        }
    );
}

