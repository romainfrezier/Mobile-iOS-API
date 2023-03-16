const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const admin = require('firebase-admin');
const forge = require('node-forge');

const volunteerRoutes = require('./routes/volunteers');
const zoneRoutes = require('./routes/zones');

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

// const checkAuth=(req, res, next) => {
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

const app = express();

mongoose.connect(`mongodb+srv://${process.env.DB_URL}`, { useNewUrlParser: true, useUnifiedTopology: true, dbName: process.env.DB_NAME })
    .then(() => console.log('Connecion to MongoDB successful!'))
    .catch(() => console.log('Connecion to MongoDB failed!'));

app.use(bodyParser.json());
app.use(cors());

// app.use(checkAuth)

app.use('/volunteers', volunteerRoutes);
app.use('/zones', zoneRoutes);

module.exports = app;