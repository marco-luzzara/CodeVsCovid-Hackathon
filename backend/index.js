const http = require('http')
const express = require('express');
const bodyParser = require('body-parser');
const config = require('config');

const app = express();
const PORT = config.port || 3333;
const HOST = config.host || 'localhost';

const router_user = require("./api/user.js");
const router_dossier = require("./api/dossier.js");
let router_news = require('./api/news');

app.use(bodyParser.json());
app.use(bodyParser.text());

app.use('/users', router_user);
app.use('/dossiers', router_dossier);
app.use('/news', router_news);

let server = http.createServer(app);

let server_starting = new Promise((resolve, reject) => {
    server.listen(PORT, HOST, () => {
        console.log("CodeVsCovid app is listening at port " + PORT);
        resolve();
    });
});

module.exports = {
    server: server,
    server_starting: server_starting
}
