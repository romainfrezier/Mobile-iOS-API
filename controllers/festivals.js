const Festivals = require('../models/festivals');
const Zones = require('../models/zones');
const Days = require('../models/days');
const Timeslots = require('../models/timeslots');
const Volunteers = require('../models/volunteers');
const timeslots = require('../commons/timeslots');

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

exports.createFestival = async (req, res, next) => {
    let zones = [];
    if (req.body.zones) {
        zones = await addZones(req.body.zones);
    }
    let daysCreated = await addDays(req.body.days);
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

exports.updateFestival = async (req, res, next) => {
    let zonesCreated = [];
    if (req.body.zones) {
        zonesCreated = await addZones(req.body.zones);
    }
    let daysCreated = await addDays(req.body.days);
    let festival = await Festivals.findOne({_id: req.params.id});

    festival.name = req.body.name;
    festival.zones.push(zonesCreated);
    festival.days.push(daysCreated);

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

exports.deleteFestival = async (req, res, next) => {
    let festival = await Festivals.findOne({_id: req.params.id});
    if (!festival) {
        return res.status(404).json({
            error: 'Festival not found'
        });
    } else {

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

        for (let dayId of festival.days) {
            let day = await Days.findOne({_id: dayId});
            if (!day) {
                return res.status(404).json({
                    error: 'Day not found'
                });
            } else {
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

        Volunteers.updateMany({festival: req.params.id}, {festival: null, availableSlots: []}).then(
            () => {
                console.log("volunteers updated");
            }
        ).catch(
            (error) => {
                console.log(error);
            }
        );

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

exports.getFullFestival = async (req, res, next) => {
    let festival = await Festivals.findOne({_id: req.params.id});
    if (!festival) {
        return res.status(404).json({
            error: 'Festival not found'
        });
    }
    let zones = await Zones.find({_id: {$in: festival.zones}});
    if (!zones) {
        return res.status(404).json({
            error: 'Zones not found'
        });
    }
    let days = await Days.find({_id: {$in: festival.days}});
    if (!days) {
        return res.status(404).json({
            error: 'Days not found'
        });
    }

    for (let day of days) {
        day.slots = await Timeslots.find({_id: {$in: day.slots}});
        for (let slot of day.slots) {
            slot.volunteers = await Volunteers.find({_id: {$in: slot.volunteers}});
        }
    }

    const festivalComplete = {
        _id: req.params.id,
        name: req.body.name,
        zones: zones,
        days: days,
    }
    return res.status(200).json(festivalComplete);
}

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