require('dotenv').config();
const app = require("./app");
const functions = require("firebase-functions");

const port = process.env.APP_PORT;
console.log("port ", port);
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

exports.api = functions.region("europe-west1").https.onRequest(app);