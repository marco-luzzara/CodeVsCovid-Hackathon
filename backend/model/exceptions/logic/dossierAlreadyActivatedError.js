class DossierAlreadyActivatedError extends Error {
    constructor(dossierId) {
        super(`dossier with id ${dossierId} has already been activated`);

        this.dossierId = dossierId;
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = DossierAlreadyActivatedError;