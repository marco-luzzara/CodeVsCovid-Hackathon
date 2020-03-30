const express = require('express');
const router = express.Router();
const db = require('../logic/dbClientInstance');
const BodyValidator = require("./utils/BodyValidator.js").BodyValidator;
const BodyValidatorError = require("./utils/BodyValidator.js").BodyValidatorError;
const errorHandler = require('./utils/errorHandler.js');

const UserMailAlreadyExistsError = require("../model/exceptions/logic/userMailAlreadyExistsError.js");
const WrongUserPasswordError = require("../model/exceptions/logic/wrongUserPasswordError.js");
const WrongDossierPasswordError = require("../model/exceptions/logic/wrongDossierPasswordError.js");
const DossierIdNotFoundError = require("../model/exceptions/logic/dossierIdNotFoundError.js");
const DossierAlreadyActivatedError = require("../model/exceptions/logic/dossierAlreadyActivatedError.js");
const UserMailNotFoundError = require("../model/exceptions/logic/userMailNotFoundError.js");

function canBeParsedInt(n) {
    return Number(n) === parseInt(n);
}

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

        let userObj = await db.addNewUser(body);
        
        res.status(201).json(userObj);
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
        res.status(200).send(result.toString());
    } catch (exc){
        errorHandler(res, exc, {
            "400": [BodyValidatorError],
            "401": [WrongUserPasswordError, UserMailNotFoundError],
            "500": [null]
        })
    }
});

//Associate a new dossier to a user
router.post("/dossiers", async function(req, res){
    let uid = req.header("User-Id");
    let body = req.body;

    let requiredFields = {
        id: "number",
        pwd: "string",
        patientLabel: "string"
    };

    if (uid == undefined || !canBeParsedInt(uid)){
        res.status(401).end();
        return;
    }

    try {
        BodyValidator.validate(body, requiredFields);

        let result = await db.associateDossierToUser(body, parseInt(uid));
        let status = (result != undefined) ? 200 : 404;
        res.status(status).end();
    } catch(exc){
        errorHandler(res, exc, {
            "400": [BodyValidatorError],
            "401": [WrongDossierPasswordError],
            "404": [DossierIdNotFoundError],
            "409": [DossierAlreadyActivatedError],
            "500": [null]
        })
    }
});

module.exports = router;