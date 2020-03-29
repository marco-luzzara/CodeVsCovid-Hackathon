const MockDbClient = require('../../../logic/mock/mockDbClient');

// exceptions
const WrongUserPasswordError = require("../../../model/exceptions/logic/wrongUserPasswordError");
const WrongDossierPasswordError = require("../../../model/exceptions/logic/wrongDossierPasswordError");
const UserMailNotFoundError = require("../../../model/exceptions/logic/userMailNotFoundError");
const UserMailAlreadyExistsError = require("../../../model/exceptions/logic/userMailAlreadyExistsError");
const DossierNotActivatedError = require("../../../model/exceptions/logic/dossierNotActivatedError");
const UserIdNotFoundError = require("../../../model/exceptions/logic/userIdNotFoundError");
const DossierIdNotFoundError = require("../../../model/exceptions/logic/dossierIdNotFoundError");


describe('addNewUser', () => {
    test('mail already exists, should throw', async () => {
        const newUser = {
            "mail": "test@test.it"
        };

        let dbClient = new MockDbClient({
            users: [newUser]
        });

        await expect(dbClient.addNewUser(newUser)).rejects.toThrow(UserMailAlreadyExistsError);
    });

    test('user is correct, should success', async () => {
        const newUser = {
            "mail": "test1@test.it",
            "pwd": "mypasss",
            "isNurse": true
        };

        const CURRENT_ID = 0;

        let dbClient = new MockDbClient({
            users: [{
                "id": CURRENT_ID,
                "mail": "test@test.it",
                "pwd": "mypasss",
                "isNurse": false
            }]
        });

        await expect(dbClient.addNewUser(newUser)).resolves.toBe(CURRENT_ID + 1);
        await expect(dbClient.getUserIdFromCredentials(newUser.mail, newUser.pwd)).resolves.toBe(CURRENT_ID + 1);
    });
});

describe('getUserIdFromCredentials', () => {
    test('password is wrong, should throw', async () => {
        const MAIL = "ciccio.pasticcio@tobi.it";
        const PWD = "neversavemeinclear";

        let dbClient = new MockDbClient({
            users: [
                {
                    "id": 11,
                    "mail": MAIL,
                    "pwd": PWD,
                }
            ]
        });

        await expect(dbClient.getUserIdFromCredentials(MAIL, PWD + "wrong")).rejects.toThrow(WrongUserPasswordError);
    });

    test('email does not exist, should throw', async () => {
        const MAIL = "ciccio.pasticcio@tobi.it";
        const PWD = "neversavemeinclear";

        let dbClient = new MockDbClient({
            users: [
                {
                    "id": 11,
                    "mail": MAIL,
                    "pwd": PWD,
                }
            ]
        });

        await expect(dbClient.getUserIdFromCredentials(MAIL + ".fr", PWD)).rejects.toThrow(UserMailNotFoundError);
    });

    test('credentials are correct, should return userId', async () => {
        const USERID = 11;
        const MAIL = "ciccio.pasticcio@tobi.it";
        const PWD = "neversavemeinclear";

        let dbClient = new MockDbClient({
            users: [
                {
                    "id": USERID,
                    "mail": MAIL,
                    "pwd": PWD,
                }
            ]
        });

        await expect(dbClient.getUserIdFromCredentials(MAIL, PWD)).resolves.toBe(USERID);
    });
});

describe('associateDossierToUser', () => {
    test('dossier has not been activated yet, should throw', async () => {
        const USER_ID = 11;
        let requestedDossier = {
            "id": 22,
            "pwd": "longpassword0",
            "patientLabel": "testme"
        };

        let dbClient = new MockDbClient({
            users: [
                {
                    "id": USER_ID,
                }
            ],
            dossiers: [
                {
                    "id": 22,
                    "pwd": "longpassword0",
                    "isActive": false,
                    "patientLabel": null
                }
            ]
        });

        await expect(dbClient.associateDossierToUser(requestedDossier, USER_ID)).rejects.toThrow(DossierNotActivatedError);
    });

    test('user id does not exist, should throw', async () => {
        const USER_ID = 11;
        let requestedDossier = {
            "id": 22,
            "pwd": "longpassword0",
            "patientLabel": "testme"
        };

        let dbClient = new MockDbClient({
            users: [
            ],
            dossiers: [
                {
                    "id": 22,
                    "pwd": "longpassword0",
                    "isActive": true,
                    "patientLabel": null
                }
            ]
        });

        await expect(dbClient.associateDossierToUser(requestedDossier, USER_ID)).rejects.toThrow(UserIdNotFoundError);
    });

    test('dossier id does not exist, should throw', async () => {
        const USER_ID = 11;
        let requestedDossier = {
            "id": 22,
            "pwd": "longpassword0",
            "patientLabel": "testme"
        };

        let dbClient = new MockDbClient({
            users: [
                {
                    "id": USER_ID,
                }
            ],
            dossiers: [
            ]
        });

        await expect(dbClient.associateDossierToUser(requestedDossier, USER_ID)).rejects.toThrow(DossierIdNotFoundError);
    });

    test('password is wrong, should throw', async () => {
        const USER_ID = 11;
        let requestedDossier = {
            "id": 22,
            "pwd": "longpassword0wrong",
            "patientLabel": "testme"
        };

        let dbClient = new MockDbClient({
            users: [
                {
                    "id": USER_ID,
                }
            ],
            dossiers: [
                {
                    "id": 22,
                    "pwd": "longpassword0",
                    "isActive": true,
                    "patientLabel": null
                }
            ]
        });

        await expect(dbClient.associateDossierToUser(requestedDossier, USER_ID)).rejects.toThrow(WrongDossierPasswordError);
    });

    test('dossier requested is valid, should success', async () => {
        const USER_ID = 11;
        const DOSSIER_ID = 22;
        const PATIENT_LABEL = "testme";
        let requestedDossier = {
            "id": 22,
            "pwd": "longpassword0",
            "patientLabel": PATIENT_LABEL
        };

        let dbClient = new MockDbClient({
            users: [
                {
                    "id": USER_ID,
                }
            ],
            dossiers: [
                {
                    "id": DOSSIER_ID,
                    "pwd": "longpassword0",
                    "isActive": true,
                    "patientLabel": null
                }
            ]
        });

        await dbClient.associateDossierToUser(requestedDossier, USER_ID);

        let dossiers = await dbClient.getUserDossiers(USER_ID);
        let foundDossier = dossiers.find(dossier => dossier.id === DOSSIER_ID);
        expect(foundDossier).not.toBeUndefined();
        expect(foundDossier.patientLabel).toBe(PATIENT_LABEL);
    });
});

describe('getUserDossiers', () => {
    test('user id does not exist, should throw', async () => {
        let dbClient = new MockDbClient({
            users: []
        });

        await expect(dbClient.getUserDossiers(111)).rejects.toThrow(UserIdNotFoundError);
    });

    test('zero dossiers for a user, should return 0 dossiers', async () => {
        const USER_ID = 111;
        let dbClient = new MockDbClient({
            users: [
                {
                    "id": USER_ID
                }
            ]
        });

        await expect(dbClient.getUserDossiers(USER_ID)).resolves.toEqual([]);
    });

    test('multiple dossiers for a user, should return all dossiers', async () => {
        const USER_ID = 111;
        const DOSSIERS = [
            {
                "id": 0,
                "patientLabel": "testme1"
            },
            {
                "id": 1,
                "patientLabel": "testme2"
            }
        ];

        let dbClient = new MockDbClient({
            users: [
                {
                    "id": USER_ID
                }
            ],
            users_dossiers: [
                {
                    "userId": USER_ID,
                    "dossierId": 0
                },
                {
                    "userId": USER_ID,
                    "dossierId": 1
                }
            ],
            dossiers: DOSSIERS
        });

        await expect(dbClient.getUserDossiers(USER_ID)).resolves.toEqual(DOSSIERS);
    });
});