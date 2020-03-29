const express = require('express');
const router = express.Router();
const BodyValidator = require("../utils/BodyValidator.js").BodyValidator;
const BodyValidatorError = require("../utils/BodyValidator.js").BodyValidatorError;
//--------------
const db = require('');
//--------------


const userLogic = require('./logic/userLogic.js');
const errorHandler = require('../utils/errorHandler.js');

//Register a new user
router.post("/", async function(req, res, next){
    let body = req.body;
    let requiredFields = {
        mail: "string",
        pwd: "string",
        role: "boolean"
    };

    try {
        BodyValidator.validate(body, requiredFields);

        let result = await db.addNewUser(body);
        if (result != undefined)
            res.status(201).send(result);
        else    
            res.status(500).json({message: "Cannot create a new user"});
    } catch (exc) {
        errorHandler(res, exc, {
            "400": [BodyValidatorError],                    //TODO: add 409 conflict exception
            "500": [null]
        })
    }
});

//User login
router.post("/login", async function(req, res){
    let body = req.body;
    let requiredFields = {
        mail: "string",
        pwd: "string"
    };

    try {
        BodyValidator.validate(body, requiredFields);

        let result = await db.getUserIdFromCredentials(body.mail, body.pwd);
        if (result != undefined)
            res.status(200).send(result);
        else    
            res.status(401).end();
    } catch (exc){
        errorHandler(res, exc, {
            "400": [BodyValidatorError],
            "500": [null]
        })
    }
});

//Associate a new dossier to a user
router.post("/dossiers", async function(req, res){
    let uid = req.headers.uid;
    let body = req.body;
    body.uid = uid;

    let requiredFields = {
        uid: "number",
        dossierId: "number",
        dossierPwd: "string",
        patientLabel: "string"
    };

    if (uid == undefined){
        res.status(401).end();
        return;
    }

    try {
        BodyValidator.validate(body, requiredFields);

        let result = await db.associateDossierToUser(uid, dossierId);
    } catch(exc){
        errorHandler(res, exc, {
            "400": [BodyValidatorError],
            "500": [null]
        })
    }
});

module.exports = router;