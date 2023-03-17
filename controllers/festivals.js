const Festivals = require('../models/festivals');
const Zones = require('../models/zones');
const Days = require('../models/days');
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
        let slotsOfTheDay = timeslots.addSlots(day.hours.opening, day.hours.closing);
        let newDay = new Days({
            name: day.name,
            hours: {
                opening: day.hours.opening,
                closing: day.hours.closing
            },
            slots: slotsOfTheDay
        });
        await newDay.save((err, day) => {
            if (err) {
                console.log(err);
            } else {
                daysIds.push(day._id);
            }
        })
    }
    return daysIds;
}

exports.createFestival = async (req, res, next) => {
    let zones = [];
    if (req.body.zones) {
        zones = await addZones(req.body.zones);
    }
    let days = await addDays(req.body.days);
    const festival = new Festivals({
        name: req.body.name,
        zones: zones,
        days: days,
    });
    festival.save().then(
        () => {
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

exports.updateFestival = (req, res, next) => {
    // TODO: update all things related to this festival
    Festivals.findOneAndUpdate({_id: req.params.id}, {
        name: req.body.name,
        zones: req.body.zones,
        days: req.body.days,
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

exports.deleteFestival = (req, res, next) => {
    // TODO: delete all things related to this festival
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