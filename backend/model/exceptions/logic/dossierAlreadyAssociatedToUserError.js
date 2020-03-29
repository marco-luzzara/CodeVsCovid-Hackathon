class DossierAlreadyAssociatedToUserError extends Error {
    constructor(dossierId, userId) {
        super(`dossier with id ${dossierId} has already been associated to user with id ${userId}`);

        this.dossierId = dossierId;
        this.userId = userId;
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = DossierAlreadyAssociatedToUserError;