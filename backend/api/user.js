const express = require('express');
const router = express.Router();
const db = require("../logic/dbClientInstance.js");
const BodyValidator = require("../utils/BodyValidator.js").BodyValidator;
const BodyValidatorError = require("../utils/BodyValidator.js").BodyValidatorError;
const errorHandler = require('../utils/errorHandler.js');

const UserMailAlreadyExistsError = require("../model/exceptions/logic/userMailAlreadyExistsError.js");
const WrongUserPasswordError = require("../model/exceptions/logic/wrongUserPasswordError.js");
const WrongDossierPasswordError = require("../model/exceptions/logic/wrongDossierPasswordError.js");
const DossierIdNotFoundError = require("../model/exceptions/logic/dossierIdNotFoundError.js");
const DossierAlreadyActivatedError = require("../model/exceptions/logic/dossierAlreadyActivatedError.js");

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
            "400": [BodyValidatorError],
            "409": [UserMailAlreadyExistsError],
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
            "401": [WrongUserPasswordError],
            "500": [null]
        })
    }
});

//Associate a new dossier to a user
router.post("/dossiers", async function(req, res){
    let uid = req.headers.uid;
    let body = req.body;

    let requiredFields = {
        dossierId: "number",
        dossierPwd: "string",
        patientLabel: "string"
    };

    if (uid == undefined || typeof uid !== 'number'){
        res.status(401).end();
        return;
    }

    try {
        BodyValidator.validate(body, requiredFields);

        let result = await db.associateDossierToUser(body, uid);
        let status = (result != undefined) ? 200 : 404;
        res.status(status).end();
    } catch(exc){
        errorHandler(res, exc, {
            "400": [BodyValidatorError],
            "401": [WrongDossierPasswordError],
            "404": [DossierIdNotFoundError],
            "409": [DossierAlreadyActivatedError],      //TO change maybe
            "500": [null]
        })
    }
});

module.exports = router;