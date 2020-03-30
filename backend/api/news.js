const express = require('express');
const router = express.Router();
const errorHandler = require('./utils/errorHandler');

// get news
router.get("/", async function(req, res, next){
    // let body = req.body;
    // let requiredFields = {
    //     mail: "string",
    //     pwd: "string",
    //     role: "boolean"
    // };

    // try {
    //     BodyValidator.validate(body, requiredFields);

    //     let result = await db.addNewUser(body);
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