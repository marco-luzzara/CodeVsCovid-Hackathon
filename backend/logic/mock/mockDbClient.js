const DbClient = require('../dbClient');

// exceptions
const WrongUserPasswordError = require("../../model/exceptions/logic/wrongUserPasswordError");
const WrongDossierPasswordError = require("../../model/exceptions/logic/wrongDossierPasswordError");
const UserMailNotFoundError = require("../../model/exceptions/logic/userMailNotFoundError");
const UserMailAlreadyExistsError = require("../../model/exceptions/logic/userMailAlreadyExistsError");
const UserNotANurseError = require("../../model/exceptions/logic/userNotANurseError");
const UserIdNotFoundError = require("../../model/exceptions/logic/userIdNotFoundError");
const DossierNotActivatedError = require("../../model/exceptions/logic/dossierNotActivatedError");
const DossierIdNotFoundError = require("../../model/exceptions/logic/dossierIdNotFoundError");
const DossierNotAssociatedToUserError = require("../../model/exceptions/logic/dossierNotAssociatedToUserError");
const DossierAlreadyAssociatedToUserError = require("../../model/exceptions/logic/dossierAlreadyAssociatedToUserError");
const DossierAlreadyActivatedError = require("../../model/exceptions/logic/dossierAlreadyActivatedError");

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

        this.dossiers = repo.dossiers || [];
        this.currentMaxDossierId = this.dossiers.reduce((acc, curDossier) => acc < curDossier.id ? curDossier.id : acc, 0);

        this.users_dossiers = repo.users_dossiers || [];
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

            return (({id, isNurse}) => ({id, isNurse}))(user);
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

            if (this.users_dossiers.find(user_dossier => user_dossier.userId === userId && user_dossier.dossierId === dossierObj.id) !== undefined)
                throw new DossierAlreadyAssociatedToUserError(dossierObj.id, userId);

            if (dossier.patientLabel === null)
                dossier.patientLabel = dossierObj.patientLabel;

            this.users_dossiers.push({
                "userId": userId,
                "dossierId": dossier.id
            });
        });
    }

    getInfoFromDossier(dossierId, userId) {
        return wrapInPromise(() => {
            let user = this.users.find(_user => _user.id === userId);

            if (user === undefined)
                throw new UserIdNotFoundError(userId);

            let dossier = this.dossiers.find(_dossier => _dossier.id === dossierId);

            if (dossier === undefined)
                throw new DossierIdNotFoundError(dossierId);

            if (!dossier.isActive)
                throw new DossierNotActivatedError(dossierId);

            if (this.users_dossiers.find(user_dossier => user_dossier.userId === userId &&
                user_dossier.dossierId === dossierId) === undefined)
                throw new DossierNotAssociatedToUserError(dossierId, userId);

            return {
                messages: this.messages
                    .filter(message => message.dossierId = dossierId)
                    .sort((m1, m2) => m1.timestamp > m2.timestamp ? -1 : 1)
            };
        });
    }

    activateDossier(dossierId, userId) {
        return wrapInPromise(() => {
            let user = this.users.find(_user => _user.id === userId);

            if (user === undefined)
                throw new UserIdNotFoundError(userId);

            if (!user.isNurse)
                throw new UserNotANurseError(userId);

            let dossier = this.dossiers.find(_dossier => _dossier.id === dossierId);

            if (dossier === undefined)
                throw new DossierIdNotFoundError(dossierId);

            if (dossier.isActive)
                throw new DossierAlreadyActivatedError(dossierId);

            dossier.isActive = true;
        });
    }

    getUserDossiers(userId) {
        return wrapInPromise(() => {
            let user = this.users.find(_user => _user.id === userId);

            if (!this.users.some(_user => _user.id === userId))
                throw new UserIdNotFoundError(userId);

            return this.users_dossiers
                .filter(user_dossier => user_dossier.userId === userId)
                .map(user_dossier => this.dossiers.find(dossier => dossier.id === user_dossier.dossierId))
                .filter(dossier => dossier.isActive)
                .map(dossier => (({pwd, isActive, ...rest}) => rest)(dossier));
        });
    }

    createDossier(userId) {
        return wrapInPromise(() => {
            let user = this.users.find(_user => _user.id === userId);

            if (user === undefined)
                throw new UserIdNotFoundError(userId);

            if (!user.isNurse)
                throw new UserNotANurseError(userId);

            this.currentMaxDossierId++;
            let newDossier = {
                id: this.currentMaxDossierId,
                pwd: `passwordCreatedByUser${userId}AndDossier${this.currentMaxDossierId}`,
                isActive: false,
                patientLabel: null
            };

            this.dossiers.push(newDossier);

            return (({id, pwd}) => ({id, pwd}))(newDossier);
        });
    }

    sendMessageToDossier(dossierId, userId, message) {
        return wrapInPromise(() => {
            let user = this.users.find(_user => _user.id === userId);

            if (user === undefined)
                throw new UserIdNotFoundError(userId);

            if (!user.isNurse)
                throw new UserNotANurseError(userId);

            let dossier = this.dossiers.find(_dossier => _dossier.id === dossierId);

            if (dossier === undefined)
                throw new DossierIdNotFoundError(dossierId);

            if (!dossier.isActive)
                throw new DossierNotActivatedError(dossierId);

            let currentDate = new Date();
            this.messages.push({
                "userId": userId,
                "dossierId": dossierId,
                "message": message,
                "timestamp": currentDate.toISOString()
            })
        });
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