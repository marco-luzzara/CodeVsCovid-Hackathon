const express = require('express');
const router = express.Router();

const errorHandler = require('../utils/errorHandler');
//const NewsImpl = requ

const ModelValidationError = require('../model/exceptions/logic/modelValidationError');

// GET news
router.get("/", async function(req, res, next){
    // try {
    //     let posStart = req.query.positivityStart;
    //     let posEnd = req.query.positivityEnd;
    //     let countryId = req.query.countryId;

    //     if (countryId === undefined)
    //         countryId = 'en';

    //     posStart = parseFloat(posStart);
    //     if (isNaN(posStart) || posStart < 0 || posStart > 1)
    //         throw new ModelValidationError('0 <= positivityStart <= 1');

    //     posEnd = parseFloat(posEnd);
    //     if (isNaN(posEnd) || posEnd < 0 || posEnd > 1)
    //         throw new ModelValidationError('0 <= positivityEnd <= 1');

    //     if (posStart > posEnd)
    //         throw new ModelValidationError('positivityStart < positivityEnd');

    //     let news = await db.addNewUser(body);
    //     if (result != undefined)
    //         res.status(201).send(result);
    //     else    
    //         res.status(500).json({message: "Cannot create a new user"});
    // } catch (exc) {
    //     errorHandler(res, exc, {
    //         "400": [BodyValidatorError],
    //         "409": [UserMailAlreadyExistsError],
    //         "500": [null]
    //     })
    // }
});

module.exports = router;