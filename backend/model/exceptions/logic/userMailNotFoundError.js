class UserMailNotFoundError extends Error {
    constructor(mail) {
        super(`mail ${mail} does not exist`);

        this.mail = mail;
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = UserMailNotFoundError;