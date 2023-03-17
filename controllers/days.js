const Days = require('../models/days');
const timeslots = require('../commons/timeslots');
const Timeslots = require('../models/timeslots');

exports.createDay = (req, res, next) => {
    const day = new Days({
        name: req.body.name,
        hours: {
            opening: req.body.hours.opening,
            closing: req.body.hours.closing
        },
        slots: timeslots.addSlots(req.body.hours.opening, req.body.hours.closing)
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

exports.updateDay = async (req, res, next) => {
    let dayToUpdate = await Days.findOne({_id: req.params.id});

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

    let slots = await timeslots.addSlots(req.body.hours.opening, req.body.hours.closing)
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
exports.deleteDay = (req, res, next) => {
    // TODO: Delete all things related to this day
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

// TODO : Maybe a method to get all slots of a day with the day

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

