const express = require('express');
const router = express.Router();
const db = require("../logic/dbClientInstance.js");
const errorHandler = require('../utils/errorHandler.js');

const DossierAlreadyActivatedError = require("../model/exceptions/logic/dossierAlreadyActivatedError.js");
const DossierNotActivatedError = require("../model/exceptions/logic/dossierNotActivatedError.js");
const DossierIdNotFoundError = require("../model/exceptions/logic/dossierIdNotFoundError.js");
const UserNotANurseError = require("../model/exceptions/logic/userNotANurseError.js");
const UserIdNotFoundError = require("../model/exceptions/logic/userIdNotFoundError.js");
const DossierNotAssociatedToUserError = require("../model/exceptions/logic/dossierNotAssociatedToUserError.js");

//Generate a new dossier
router.post("/", async function(req, res){
    let uid = req.headers.uid;
    if (uid == undefined || typeof uid !== 'number'){
        res.status(401).end();
        return;
    }

    try {
        let result = await db.createDossier(uid);
        if (result != undefined)
            res.status(201).json(result);
        else
            res.status(500).end();
    } catch(exc){
        errorHandler(res, exc, {
            "401": [UserNotANurseError],
            "500": [null]
        })
    }
});

//Activate an existing dossier
router.put("/", async function(req, res){
    let uid = req.headers.uid;
    let dossierId = req.query.dossierId;

    if (uid == undefined || typeof uid !== 'number'){
        res.status(401).end();
        return;
    }
    if (dossierId == undefined || typeof dossierId !== 'number'){
        res.status(400).end();
        return;
    }

    try {
        let result = await db.activateDossier(dossierId, uid);
        let status = (result != undefined) ? 200 : 404;
        res.status(status).end();
    } catch (exc){
        errorHandler(res, exc, {
            "401": [UserNotANurseError],
            "404": [DossierIdNotFoundError],
            "409": [DossierAlreadyActivatedError],
            "500": [null]
        })
    }
});

//Retrieve dossier info
router.get("/:dossierId", async function(req, res){
    let uid = req.headers.uid;
    let dossierId = req.query.dossierId;

    if (uid == undefined || typeof uid !== 'number'){
        res.status(401).end();
        return;
    }
    if (dossierId == undefined || typeof dossierId !== 'number'){
        res.status(400).end();
        return;
    }

    try {
        let result = await db.getInfoFromDossier(dossierId, uid);
        if (result != undefined)
            res.status(200).json(result);
        else    
            res.status(404).end();
    } catch (exc){
        errorHandler(res, exc, {
            "401": [DossierNotAssociatedToUserError],
            "403": [DossierNotActivatedError],
            "404": [DossierIdNotFoundError],
            "500": [null]
        })
    }
});

//Retrieve base information of all the dossiers
router.get("/", async function(req, res){
    let uid = req.headers.uid;
    if (uid == undefined || typeof uid !== 'number'){
        res.status(401).end();
        return;
    }

    try {
        let result = await db.getUserDossiers(uid);
        if (result != undefined)
            res.status(200).json(result);
        else    
            res.status(404).end();
    } catch (exc){
        errorHandler(res, exc, {
            "500": [null]
        })
    }
});

//Send a message for a specific dossier
router.post("/:dossierId/messages", async function(req, res){
    let uid = req.headers.uid;
    let dossierId = req.query.dossierId;
    let message = req.body;

    if (uid == undefined || typeof uid !== 'number'){
        res.status(401).end();
        return;
    }
    if (dossierId == undefined || typeof dossierId !== 'number'){
        res.status(400).end();
        return;
    }
    if (message == undefined || typeof message !== 'string' || message == ""){
        res.status(400).end();
        return;
    }

    try {
        let result = await db.sendMessageToDossier(dossierId, uid, message);
        let status = (result != undefined) ? 201 : 404;
        res.status(status).end();
    } catch (exc){
        errorHandler(res, exc, {
            "401": [UserNotANurseError],
            "404": [UserIdNotFoundError, DossierIdNotFoundError],
            "409": [DossierNotActivatedError],
            "500": [null]
        })
    }
});

module.exports = router;