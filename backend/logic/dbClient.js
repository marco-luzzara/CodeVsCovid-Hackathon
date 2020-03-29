function validateSubclassing() {
    throw new Error("function not subclassed");
}

class DbClient
{
    /**
     * 
     * @param {Object} user : an object in this format
     * {
     *     "id": int,
     *     "mail": String,
     *     "pwd": String,
     *     "isNurse": bool
     * }
     * @returns {int} userId
     */
    async addNewUser(user) {
        validateSubclassing();
    }

    /**
     * 
     * @param {String} mail 
     * @param {String} pwd 
     * @returns {int} userId  
     */
    async getUserIdFromCredentials(mail, pwd) {
        validateSubclassing();
    }

    /**
     * 
     * @param {Object} dossier 
     * @param {int} userId 
     * @returns {void}
     */
    async associateDossierToUser(dossier, userId) {
        validateSubclassing();
    }

    async getInfoFromDossier(dossierId, userId) {
        validateSubclassing();
    }

    async activateDossier(dossierId, userId) {
        validateSubclassing();
    }

    async getUserDossiers(userId) {
        validateSubclassing();
    }

    async createDossier(userId) {
        validateSubclassing();
    }

    async sendMessageToDossier(dossierId, userId) {
        validateSubclassing();
    }
}

module.exports = DbClient;