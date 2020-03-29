const DbClient = require('../dbClient');

// exceptions
const WrongUserPasswordError = require("../../model/exceptions/logic/wrongUserPasswordError");
const WrongDossierPasswordError = require("../../model/exceptions/logic/wrongDossierPasswordError");
const UserMailNotFoundError = require("../../model/exceptions/logic/userMailNotFoundError");
const UserMailAlreadyExistsError = require("../../model/exceptions/logic/userMailAlreadyExistsError");
const DossierNotActivatedError = require("../../model/exceptions/logic/dossierNotActivatedError");
const UserIdNotFoundError = require("../../model/exceptions/logic/userIdNotFoundError");
const DossierIdNotFoundError = require("../../model/exceptions/logic/dossierIdNotFoundError");

function wrapInPromise(fn) {
    return new Promise((resolve, reject) => {
        let result = fn();
        resolve(result);
    });
}

class MockDbClient extends DbClient {
    /**
     * @param {Object} repo : an object containing all the necessary data
     */
    constructor(repo) {
        super();

        this.users = repo.users || [];
        this.currentMaxUserId = this.users.reduce((acc, curUser) => acc < curUser.id ? curUser.id : acc, 0);

        this.users_dossiers = repo.users_dossiers || [];
        this.dossiers = repo.dossiers || [];
        this.messages = repo.messages || [];
    }

    addNewUser(user) {
        return wrapInPromise(() => {
            let duplUser = this.users.find(_user => _user.mail === user.mail);

            if (duplUser !== undefined)
                throw new UserMailAlreadyExistsError(user.mail);

            this.currentMaxUserId++;
            user.id = this.currentMaxUserId;

            this.users.push(user);

            return user.id;
        });
    }

    getUserIdFromCredentials(mail, pwd) {
        return wrapInPromise(() => {
            let user = this.users.find(user => user.mail === mail);

            if (user === undefined)
                throw new UserMailNotFoundError(mail);

            if (user.pwd !== pwd)
                throw new WrongUserPasswordError();

            return user.id;
        });
    }

    associateDossierToUser(dossierObj, userId) {
        return wrapInPromise(() => {
            let user = this.users.find(_user => _user.id === userId);

            if (user === undefined)
                throw new UserIdNotFoundError(userId);

            let dossier = this.dossiers.find(_dossier => _dossier.id === dossierObj.id);

            if (dossier === undefined)
                throw new DossierIdNotFoundError(dossierObj.id);

            if (dossier.pwd !== dossierObj.pwd)
                throw new WrongDossierPasswordError(dossierObj.id);

            if (!dossier.isActive)
                throw new DossierNotActivatedError(dossierObj.id);

            if (dossier.patientLabel === null)
                dossier.patientLabel = dossierObj.patientLabel;

            this.users_dossiers.push({
                "userId": userId,
                "dossierId": dossier.id
            });
        });
    }

    async getInfoFromDossier(dossierId, userId) {
    }

    async activateDossier(dossierId, userId) {
    }

    getUserDossiers(userId) {
        return wrapInPromise(() => {
            let user = this.users.find(_user => _user.id === userId);

            if (!this.users.some(_user => _user.id === userId))
                throw new UserIdNotFoundError(userId);

            return this.users_dossiers
                .filter(user_dossier => user_dossier.userId === userId)
                .map(user_dossier => this.dossiers.find(dossier => dossier.id === user_dossier.dossierId));
        });
    }

    async createDossier(userId) {
    }

    async sendMessageToDossier(dossierId, userId) {
    }
}

module.exports = MockDbClient;

// https://stackoverflow.com/questions/14031763/doing-a-cleanup-action-just-before-node-js-exits
// process.on('exit', () => {
//     process.exit();
// });
// process.on('SIGINT', () => {
//     process.exit();
// });