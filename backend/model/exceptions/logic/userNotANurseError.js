class UserNotANurseError extends Error {
    constructor(userId) {
        super(`user with id ${userId} must be a nurse to call this method`);

        this.userId = userId;
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = UserNotANurseError;