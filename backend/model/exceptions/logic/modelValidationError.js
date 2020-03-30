class ModelValidationError extends Error {
    constructor(message) {
        super(message);

        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = ModelValidationError;