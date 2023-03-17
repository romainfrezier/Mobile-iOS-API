const Zones = require('../models/zones');
const Festivals = require('../models/festivals');
const Volunteers = require('../models/volunteers');

exports.createZone = async (req, res, next) => {
    let festival = await Festivals.findOne({_id: req.params.festivalId});
    if (!festival) {
        return res.status(404).json({
            error: 'Festival not found'
        });
    }
    const zone = new Zones({
        name: req.body.name,
        volunteersNumber: req.body.volunteersNumber,
    });
    try {
        let result = await zone.save();
        let festivalZonesIds = festival.zones;
        festivalZonesIds.push(result._id);
        Festivals.findOneAndUpdate({_id: req.params.festivalId}, {
            zones: festivalZonesIds,
        }).then(
            () => {
                res.status(201).json({
                    message: 'Zone created successfully!'
                });
            }
        ).catch(
            (error) => {
                res.status(400).json({
                    error: error
                });
            }
        );
    } catch (error) {
        return res.status(400).json({
            error: error
        });
    }
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

exports.deleteZone = async (req, res, next) => {
    await Festivals.updateMany(
        {zones: req.params.id},
        {$pull: {zones: req.params.id}}
    );
    await Volunteers.updateMany(
        { 'availableSlots.zone': req.params.id },
        { $set: { 'availableSlots.$[elem].zone': null } },
        { arrayFilters: [{ 'elem.zone': req.params.id }] }
    );
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
