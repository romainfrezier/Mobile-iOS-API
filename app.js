const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

const volunteerRoutes = require('./routes/volunteers');
const zoneRoutes = require('./routes/zones');
const festivalRoutes = require('./routes/festivals');
const slotRoutes = require('./routes/timeslots');
const dayRoutes = require('./routes/days');
const security = require('./middlewares/security.mid');

const app = express();

mongoose.connect(`mongodb+srv://${process.env.DB_URL}`, { useNewUrlParser: true, useUnifiedTopology: true, dbName: process.env.DB_NAME })
    .then(() => console.log('Connecion to MongoDB successful!'))
    .catch(() => console.log('Connecion to MongoDB failed!'));

app.use(bodyParser.json());
app.use(cors());

// app.use(security.checkAuth)

app.use('/volunteers', volunteerRoutes);
app.use('/zones', zoneRoutes);
app.use('/festivals', festivalRoutes);
app.use('/slots', slotRoutes);
app.use('/days', dayRoutes);

module.exports = app;