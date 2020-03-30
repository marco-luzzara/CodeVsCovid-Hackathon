const express = require('express');
const bodyParser = require('body-parser');
const config = require('config');

const app = express();
const PORT = config.port || 3333;
const router_user = require("./api/user.js");
const router_dossier = require("./api/dossier.js");
let router_news = require('./api/news');

async function startServer(){
    let server = await app.listen(PORT, () => {
        console.log("CodeVsCovid app is listening at port " + PORT);
    })
    return server;
}

async function stopServer(server){
    if (server != undefined)
        server.close();
}

app.use(bodyParser.json());

app.use('/users', router_user);
app.use('/dossiers', router_dossier);
app.use('/news', router_news);

startServer();

/*let server_starting = new Promise((resolve, reject) => {
    app.listen(PORT, () => {
        console.log("CodeVsCovid app is listening at port " + PORT);
        resolve(server);
    });
});

let stop_server = new Promise((resolve, reject) => {
    server.close(() => {
        resolve();
    });
});*/

module.exports = {
    startServer: startServer,
    stopServer: stopServer
}


// PER  DOMANI

/**
 * var express = require('express')
var https = require('https')
var http = require('http')
var app = express()

http.createServer(app).listen(80)
https.createServer(options, app).listen(443)

 */