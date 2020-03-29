class DossierNotActivatedError extends Error {
    constructor(dossierId) {
        super(`dossier with id ${dossierId} has not been activated yet`);

        this.dossierId = dossierId;
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = DossierNotActivatedError;