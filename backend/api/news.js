const express = require('express');
const router = express.Router();

const errorHandler = require('./utils/errorHandler');
let newsImplInstance = require('../logic/newsImplInstance');

const ModelValidationError = require('../model/exceptions/logic/modelValidationError');
const CountryIdNotFoundError = require('../model/exceptions/logic/countryIdNotFoundError');

// GET news
router.get("/", async function(req, res, next){
    try {
        let posStart = req.query.positivityStart;
        let posEnd = req.query.positivityEnd;
        let countryId = req.query.countryId;

        if (countryId === undefined)
            countryId = 'us';

        if (posStart === undefined)
            posStart = 0;
        posStart = parseFloat(posStart);
        if (isNaN(posStart) || posStart < 0 || posStart > 1)
            throw new ModelValidationError('0 <= positivityStart <= 1');

        if (posEnd === undefined)
            posEnd = 1;
        posEnd = parseFloat(posEnd);
        if (isNaN(posEnd) || posEnd < 0 || posEnd > 1)
            throw new ModelValidationError('0 <= positivityEnd <= 1');

        if (posStart > posEnd)
            throw new ModelValidationError('positivityStart < positivityEnd');

        let news = await newsImplInstance.getNewsFilteredByPositivity(countryId, posStart, posEnd);
        res.status(200).json(news);
    } catch (exc) {
        errorHandler(res, exc, {
            "404": [CountryIdNotFoundError],
            "400": [ModelValidationError],
            "500": [null]
        });
    }
});

module.exports = router;