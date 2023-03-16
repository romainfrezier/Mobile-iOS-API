const Festivals = require('../models/festivals');

exports.createFestival = (req, res, next) => {
    // TODO: create all things related to this festival
    const festival = new Festivals({
        name: req.body.name,
        zones: req.body.zones,
        days: req.body.days,
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