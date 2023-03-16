const Zones = require('../models/Zones');

exports.createZone = (req, res, next) => {
    const zone = new Zones({
        name: req.body.name,
        volunteersNumber: req.body.volunteersNumber,
    });
    zone.save().then(
        () => {
            res.status(201).json({
                message: 'Zone saved successfully!'
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

exports.updateZone = (req, res, next) => {
    Zones.findOneAndUpdate({_id: req.params.id}, {
        name: req.body.name,
        volunteersNumber: req.body.volunteersNumber,
    }).then(
        () => {
            res.status(201).json({
                message: 'Zone updated successfully!'
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

exports.deleteZone = (req, res, next) => {
    Zones.deleteOne({_id: req.params.id}).then(
        () => {
            res.status(200).json({
                message: 'Zone deleted successfully!'
            });
        }).catch(
            (error) => {
                res.status(400).json({
                    error: error
                });
            }
        );
}

exports.getOneZone = (req, res, next) => {
    Zones.findOne({
        _id: req.params.id
    }).then(
        (zone) => {
            res.status(200).json(zone);
        }
    ).catch(
        (error) => {
            res.status(404).json({
                error: error
            });
        }
    );
}

exports.getAllZones = (req, res, next) => {
    Zones.find().then(
        (zones) => {
            res.status(200).json(zones);
        }
    ).catch(
        (error) => {
            res.status(400).json({
                error: error
            });
        }
    );
}
