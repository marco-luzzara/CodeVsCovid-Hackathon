class UserMailAlreadyExistsError extends Error {
    constructor(mail) {
        super(`mail ${mail} already exists`);

        this.mail = mail;
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = UserMailAlreadyExistsError;