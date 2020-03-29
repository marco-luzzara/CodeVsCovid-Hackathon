const express = require('express');
const bodyParser = require('body-parser');
const config = require('config');

const app = express();
const PORT = config.PORT || 3333;
const router_user = require("./api/user.js");
const router_dossier = require("./api/dossier.js");


app.use(bodyParser.json());

app.use('/users', router_user);
app.use('/dossiers', router_dossier);

app.listen(PORT, () => {
    console.log("CodeVsCovid app is listening at port " + PORT);
})
