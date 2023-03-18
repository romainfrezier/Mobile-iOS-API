const admin = require('firebase-admin');
const forge = require('node-forge');
const Volunteers = require('../models/volunteers');

exports.isAdmin = async (req, res, next) => {
    if (!req.headers.requester) {
        return res.status(400).json({error: "The person who makes the request was not specified"});
    }
    let volunteerToControl = await Volunteers.findOne({firebaseId: req.headers.requester});
    if (!volunteerToControl) {
        return res.status(404).json({error: "The person who makes the request was not found"});
    }
    if (!volunteerToControl.isAdmin) {
        return res.status(403).json({error: "The person who makes the request is not an admin"});
    }
    next();
}
//
// const privateKeyString = process.env.PRIVATE_KEY;
// const privateKey = forge.pki.privateKeyFromPem(privateKeyString);
// const privateKeyPem = forge.pki.privateKeyToPem(privateKey);
//
// admin.initializeApp({
//     credential: admin.credential.cert({
//         projectId: process.env.PROJECT_ID,
//         clientEmail: process.env.CLIENT_EMAIL,
//         privateKey: privateKeyPem,
//     }),
// });
//
// exports.checkAuth=(req, res, next) => {
//     if (req.headers.authtoken) {
//         admin.auth().verifyIdToken(req.headers.authtoken)
//             .then(() => {
//                 next()
//             }).catch(() => {
//             res.status(403).send('Unauthorized')
//         });
//     } else {
//         res.status(403).send('Unauthorized')
//     }
// }