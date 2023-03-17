const Days = require('../models/days');
const timeslots = require('../commons/timeslots');

exports.createDay = (req, res, next) => {
    const day = new Days({
        name: req.body.name,
        hours: {
            opening: req.body.hours.opening,
            closing: req.body.hours.closing
        },
        // TODO: Add slots (calculate them from hours) min 2h
        slots: timeslots.calculateSlots(req.body.hours.opening, req.body.hours.closing)
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

exports.updateDay = (req, res, next) => {
    const day = new Days({
        name: req.body.name,
        hours: {
            opening: req.body.hours.opening,
            closing: req.body.hours.closing
        }
        // TODO: Update slots (re-calculate them from hours) min 2h
    });
    Days.updateOne({_id: req.params.id}, day).then(
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

