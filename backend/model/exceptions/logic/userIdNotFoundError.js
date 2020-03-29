class UserIdNotFoundError extends Error {
    constructor(userId) {
        super(`user with id ${userId} does not exist`);

        this.userId = userId;
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = UserIdNotFoundError;