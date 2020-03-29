class WrongDossierPasswordError extends Error {
    constructor(dossierId) {
        super(`password inserted for dossier with id ${dossierId} is wrong`);

        this.dossierId = dossierId;
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = WrongDossierPasswordError;