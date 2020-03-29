class WrongUserPasswordError extends Error {
    constructor() {
        super(`inserted password is wrong for specified email`);

        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = WrongUserPasswordError;