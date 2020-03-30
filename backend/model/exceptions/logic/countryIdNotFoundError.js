class CountryIdNotFoundError extends Error {
    constructor(countryId) {
        super(`countryId ${countryId} is not supported or does not exist`);

        this.countryId = countryId;
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = CountryIdNotFoundError;