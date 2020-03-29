class DossierNotAssociatedToUserError extends Error {
    constructor(dossierId, userId) {
        super(`dossier with id ${dossierId} has not been associated to user with id ${userId}`);

        this.dossierId = dossierId;
        this.userId = userId;
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = DossierNotAssociatedToUserError;