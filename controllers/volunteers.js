const Volunteers = require('../models/Volunteers');
const Slots = require('../models/Slots');

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

exports.updateVolunteer = (req, res, next) => {
    Volunteers.findOneAndUpdate({_id: req.params.id}, {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        festival: req.body.festival,
        // Si il y a un slot, alors on ajoute l'id bu bénévole dans le tableau des bénévoles du slot
        // Sinon, on ne fait rien
        // TODO
        slot: req.body.slot ? req.body.slot : null,
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

exports.deleteVolunteer = (req, res, next) => {
    Volunteers.deleteOne({_id: req.params.id}).then(
        Slots.updateMany({volunteers: req.params.id}, {$pull: {volunteers: req.params.id}}).then(
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