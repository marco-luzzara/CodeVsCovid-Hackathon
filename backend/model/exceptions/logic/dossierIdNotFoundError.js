class DossierIdNotFoundError extends Error {
    constructor(dossierId) {
        super(`dossier with id ${dossierId} does not exist`);

        this.dossierId = dossierId;
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = DossierIdNotFoundError;