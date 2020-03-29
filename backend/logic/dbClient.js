function validateSubclassing() {
    throw new Error("function not subclassed");
}

class DbClient
{
    /**
     * 
     * @param {Object} user : an object in this format
     * {
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
     * @param {Object} dossier : an object in this format
     * {
     *  id: int,
     *  pwd: String,
     *  patientLabel: String
     * }
     * @param {int} userId 
     * @returns {void}
     */
    async associateDossierToUser(dossier, userId) {
        validateSubclassing();
    }

    /**
     * 
     * @param {int} dossierId 
     * @param {int} userId 
     * @returns {Object} an object of this type
     * {
     *  messages: Array<String>
     * }
     */
    async getInfoFromDossier(dossierId, userId) {
        validateSubclassing();
    }

    /**
     * 
     * @param {int} dossierId 
     * @param {int} userId 
     * @returns {void}
     */
    async activateDossier(dossierId, userId) {
        validateSubclassing();
    }

    /**
     * 
     * @param {int} userId 
     * @returns {Array} an array containing objects of this type:
     * {
     *  id: int,
     *  patientLabel: String
     * }
     */
    async getUserDossiers(userId) {
        validateSubclassing();
    }

    /**
     * 
     * @param {int} userId 
     * @returns {Object} an object of this type:
     * {
     *  id: int
     *  pwd: String
     * }
     */
    async createDossier(userId) {
        validateSubclassing();
    }

    /**
     * 
     * @param {int} dossierId 
     * @param {int} userId 
     * @param {String} message
     * @returns {void}
     */
    async sendMessageToDossier(dossierId, userId, message) {
        validateSubclassing();
    }
}

module.exports = DbClient;