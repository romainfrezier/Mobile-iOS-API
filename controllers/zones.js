const Zones = require('../models/zones');
const Festivals = require('../models/festivals');
const Volunteers = require('../models/volunteers');
const checkAdmin = require("../middlewares/security.mid");

// Create a zone from all the data passed in the request body. Only an admin can do this
// Route: POST /zones/:festivalId
// Body: {
//     "name": String,
//     "volunteersNumber": Number => minimum number of volunteers needed for this zone
// }
exports.createZone = async (req, res, next) => {
    let festival = await Festivals.findOne({_id: req.params.festivalId});
    if (!festival) {
        return res.status(404).json({
            error: 'Festival not found'
        });
    }

    // Build the zone object
    const zone = new Zones({
        name: req.body.name,
        volunteersNumber: req.body.volunteersNumber,
    });
    try {

        // Save the zone in the database
        let result = await zone.save();
        let festivalZonesIds = festival.zones;
        festivalZonesIds.push(result._id);

        // Update the festival with the new zone
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

// Update a zone from all the data passed in the request body. Only an admin can do this
// Route: PUT /zones/:id
// Body: {
//     "name": String,
//     "volunteersNumber": Number => minimum number of volunteers needed for this zone
// }
exports.updateZone = async (req, res, next) => {
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

// Delete a zone from its id. Only an admin can do this
// Route: DELETE /zones/:id
exports.deleteZone = async (req, res, next) => {
    // Remove the zone from the festivals

    let festivals = await Festivals.find();
    for (let i = 0; i < festivals.length; i++) {
        let festival = festivals[i];
        let zones = festival.zones;
        if (zones.includes(req.params.id)) {
            let index = zones.indexOf(req.params.id);
            zones.splice(index, 1);
            await Festivals.findOneAndUpdate({_id: festival._id}, {
                zones: zones
            });
        }
    }

    // Remove the zone from the volunteers that were assigned to it
    await Volunteers.updateMany(
        { 'availableSlots.zone': req.params.id },
        { $set: { 'availableSlots.$[elem].zone': null } },
        { arrayFilters: [{ 'elem.zone': req.params.id }] }
    );

    // Remove the zone from the database
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

// Get a zone from its id
// Route: GET /zones/:id
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

// Get all the zones
// Route: GET /zones
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

// Get all the zones of a festival
// Route: GET /zones/festival/:festivalId
exports.getAllZonesOfFestival = (req, res, next) => {
    Festivals.findOne({_id: req.params.festivalId}).then(
        (festival) => {
            let zonesIds = festival.zones;
            Zones.find({
                _id: {$in: zonesIds}
            }).then(
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
    ).catch(
        (error) => {
            res.status(400).json({
                error: error
            });
        }
    );
}

// Get all the volunteers of a zone
// Route: GET /zones/volunteers/:id
exports.getVolunteersOfZone = async (req, res, next) => {
    let volunteers = await Volunteers.find({availableSlots: {$elemMatch: {zone: req.params.id}}});
    res.status(200).json(volunteers);
}

// Get all the zones that are not full
// Route: GET /zones/notFull
exports.getNotFullZones = async (req, res, next) => {
    let zones = await Zones.find();
    let zonesNotFull = [];
    for (let i = 0; i < zones.length; i++) {
        let volunteers = await Volunteers.find({availableSlots: {$elemMatch: {zone: zones[i]._id}}});
        if (volunteers.length < zones[i].volunteersNumber) {
            zonesNotFull.push(zones[i]);
        }
    }
    res.status(200).json(zonesNotFull);
}