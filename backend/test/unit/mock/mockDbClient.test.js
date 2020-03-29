const MockDbClient = require('../../../logic/mock/mockDbClient');

// exceptions
const WrongUserPasswordError = require("../../../model/exceptions/logic/wrongUserPasswordError");
const WrongDossierPasswordError = require("../../../model/exceptions/logic/wrongDossierPasswordError");
const UserMailNotFoundError = require("../../../model/exceptions/logic/userMailNotFoundError");
const UserMailAlreadyExistsError = require("../../../model/exceptions/logic/userMailAlreadyExistsError");
const UserNotANurseError = require("../../../model/exceptions/logic/userNotANurseError");
const UserIdNotFoundError = require("../../../model/exceptions/logic/userIdNotFoundError");
const DossierNotActivatedError = require("../../../model/exceptions/logic/dossierNotActivatedError");
const DossierIdNotFoundError = require("../../../model/exceptions/logic/dossierIdNotFoundError");
const DossierNotAssociatedToUserError = require("../../../model/exceptions/logic/dossierNotAssociatedToUserError");
const DossierAlreadyAssociatedToUserError = require("../../../model/exceptions/logic/dossierAlreadyAssociatedToUserError");
const DossierAlreadyActivatedError = require("../../../model/exceptions/logic/dossierAlreadyActivatedError");


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
    test('user already associated to dossier, should throw', async () => {
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

        await dbClient.associateDossierToUser(requestedDossier, USER_ID);
        await expect(dbClient.associateDossierToUser(requestedDossier, USER_ID)).rejects.toThrow(DossierAlreadyAssociatedToUserError);
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

    test('multiple dossiers for a user, should return only active dossiers', async () => {
        const USER_ID = 111;
        const DOSSIERS = [
            {
                "id": 0,
                "isActive": true,
                "patientLabel": "testme1"
            },
            {
                "id": 1,
                "isActive": false,
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
                },
                {
                    "userId": 222,
                    "dossierId": 1
                },
            ],
            dossiers: DOSSIERS
        });

        await expect(dbClient.getUserDossiers(USER_ID)).resolves.toEqual([
            {
                "id": 0,
                "patientLabel": "testme1"
            }
        ]);
    });
});

describe('getInfoFromDossier', () => {
    test('user id does not exist, should throw', async () => {
        const DOSSIER_ID = 222;

        let dbClient = new MockDbClient({
            dossiers: [
                {
                    "id": DOSSIER_ID
                }
            ]
        });

        await expect(dbClient.getInfoFromDossier(DOSSIER_ID, 111)).rejects.toThrow(UserIdNotFoundError);
    });

    test('user id cannot access this dossier because not associated, should throw', async () => {
        const USER_ID = 111;
        const DOSSIER_ID = 222;

        let dbClient = new MockDbClient({
            users: [
                {
                    "id": USER_ID
                }
            ],
            dossiers: [
                {
                    "id": DOSSIER_ID,
                    "isActive": true
                }
            ],
            users_dossiers: []
        });

        await expect(dbClient.getInfoFromDossier(DOSSIER_ID, USER_ID)).rejects.toThrow(DossierNotAssociatedToUserError);
    });

    test('dossier id does not exist, should throw', async () => {
        const USER_ID = 111;

        let dbClient = new MockDbClient({
            users: [
                {
                    "id": USER_ID
                }
            ]
        });

        await expect(dbClient.getInfoFromDossier(222, USER_ID)).rejects.toThrow(DossierIdNotFoundError);
    });

    test('dossier not activated yet, should throw', async () => {
        const USER_ID = 111;
        const DOSSIER_ID = 222;

        let dbClient = new MockDbClient({
            users: [
                {
                    "id": USER_ID
                }
            ],
            dossiers: [
                {
                    "id": DOSSIER_ID,
                    "isActive": false
                }
            ]
        });

        await expect(dbClient.getInfoFromDossier(DOSSIER_ID, USER_ID)).rejects.toThrow(DossierNotActivatedError);
    });

    test('no message in a dossier, should return zero messages', async () => {
        const USER_ID = 111;
        const DOSSIER_ID = 222;

        let dbClient = new MockDbClient({
            users: [
                {
                    "id": USER_ID
                }
            ],
            dossiers: [
                {
                    "id": DOSSIER_ID,
                    "isActive": true
                }
            ],
            users_dossiers: [
                {
                    "userId": USER_ID,
                    "dossierId": DOSSIER_ID
                }
            ]
        });

        await expect(dbClient.getInfoFromDossier(DOSSIER_ID, USER_ID)).resolves.toEqual({
            messages: []
        });
    });

    test('multiple messages in a dossier, should return these messages ordered', async () => {
        const USER_ID = 111;
        const DOSSIER_ID = 222;

        const MESSAGES = [
            {
                "userId": 1,
                "dossierId": DOSSIER_ID,
                "message": "the patient is dying",
                "timestamp": "2020-03-29T07:29:15.545Z"
            },
            {
                "userId": 1,
                "dossierId": DOSSIER_ID,
                "message": "he is healthy as tobi",
                "timestamp": "2020-03-30T07:29:15.545Z"
            }
        ]

        let dbClient = new MockDbClient({
            users: [
                {
                    "id": USER_ID
                }
            ],
            dossiers: [
                {
                    "id": DOSSIER_ID,
                    "isActive": true
                }
            ],
            users_dossiers: [
                {
                    "userId": USER_ID,
                    "dossierId": DOSSIER_ID
                }
            ],
            messages: MESSAGES
        });

        await expect(dbClient.getInfoFromDossier(DOSSIER_ID, USER_ID)).resolves.toEqual({
            messages: MESSAGES.map(x => x).reverse()
        });
    });
});

describe('activateDossier', () => {
    test('user id does not exist, should throw', async () => {
        const DOSSIER_ID = 222;

        let dbClient = new MockDbClient({
            dossiers: [
                {
                    "id": DOSSIER_ID
                }
            ]
        });

        await expect(dbClient.activateDossier(DOSSIER_ID, 111)).rejects.toThrow(UserIdNotFoundError);
    });

    test('user id is not a nurse, should throw', async () => {
        const USER_ID = 111;
        const DOSSIER_ID = 222;

        let dbClient = new MockDbClient({
            users: [
                {
                    "id": USER_ID,
                    "isNurse": false
                }
            ],
            dossiers: [
                {
                    "id": DOSSIER_ID
                }
            ]
        });

        await expect(dbClient.activateDossier(DOSSIER_ID, USER_ID)).rejects.toThrow(UserNotANurseError);
    });

    test('dossier id does not exist, should throw', async () => {
        const USER_ID = 111;

        let dbClient = new MockDbClient({
            users: [
                {
                    "id": USER_ID,
                    "isNurse": true
                }
            ]
        });

        await expect(dbClient.activateDossier(222, USER_ID)).rejects.toThrow(DossierIdNotFoundError);
    });

    test('dossier already activated, should throw', async () => {
        const USER_ID = 111;
        const DOSSIER_ID = 222;

        let dbClient = new MockDbClient({
            users: [
                {
                    "id": USER_ID,
                    "isNurse": true
                }
            ],
            dossiers: [
                {
                    "id": DOSSIER_ID,
                    "isActive": true
                }
            ]
        });

        await expect(dbClient.activateDossier(DOSSIER_ID, USER_ID)).rejects.toThrow(DossierAlreadyActivatedError);
    });

    test('dossier is activated, should success', async () => {
        const USER_ID = 111;
        const DOSSIER_ID = 222;

        let dbClient = new MockDbClient({
            users: [
                {
                    "id": USER_ID,
                    "isNurse": true
                }
            ],
            dossiers: [
                {
                    "id": DOSSIER_ID,
                    "isActive": false
                }
            ]
        });

        await dbClient.activateDossier(DOSSIER_ID, USER_ID);
        await expect(dbClient.activateDossier(DOSSIER_ID, USER_ID)).rejects.toThrow(DossierAlreadyActivatedError);
    });
});

describe('createDossier', () => {
    test('user id does not exist, should throw', async () => {
        let dbClient = new MockDbClient({});

        await expect(dbClient.createDossier(111)).rejects.toThrow(UserIdNotFoundError);
    });

    test('user id is not a nurse, should throw', async () => {
        const USER_ID = 111;

        let dbClient = new MockDbClient({
            users: [
                {
                    "id": USER_ID,
                    "isNurse": false
                }
            ]
        });

        await expect(dbClient.createDossier(USER_ID)).rejects.toThrow(UserNotANurseError);
    });

    test('dossier is created and requested from user, should success', async () => {
        const NURSE_ID = 111;
        const USER_ID = 333;
        const DOSSIER_ID = 222;

        let dbClient = new MockDbClient({
            users: [
                {
                    "id": NURSE_ID,
                    "isNurse": true
                },
                {
                    "id": USER_ID,
                    "isNurse": false
                }
            ],
            dossiers: [
                {
                    "id": DOSSIER_ID
                }
            ]
        });

        let dossier = await dbClient.createDossier(NURSE_ID);
        expect(dossier.id).toBe(DOSSIER_ID + 1);
        expect(typeof(dossier.pwd)).toBe('string');
        expect(dossier.pwd.length).toBeGreaterThan(0);

        await dbClient.activateDossier(DOSSIER_ID + 1, NURSE_ID);
        await dbClient.associateDossierToUser({
            id: DOSSIER_ID + 1,
            pwd: dossier.pwd,
            patientLabel: "Ciccio pasticcio"
        }, USER_ID);

        let dossiers = await dbClient.getUserDossiers(USER_ID);
        expect(dossiers).toContainEqual({
            id: DOSSIER_ID + 1,
            patientLabel: "Ciccio pasticcio"
        });
    });
});

describe('sendMessageToDossier', () => {
    test('user id does not exist, should throw', async () => {
        const DOSSIER_ID = 222;

        let dbClient = new MockDbClient({
            dossiers: [
                {
                    "id": DOSSIER_ID
                }
            ]
        });

        await expect(dbClient.sendMessageToDossier(DOSSIER_ID, 111)).rejects.toThrow(UserIdNotFoundError);
    });

    test('user id is not a nurse, should throw', async () => {
        const USER_ID = 111;
        const DOSSIER_ID = 222;

        let dbClient = new MockDbClient({
            users: [
                {
                    "id": USER_ID,
                    "isNurse": false
                }
            ],
            dossiers: [
                {
                    "id": DOSSIER_ID
                }
            ]
        });

        await expect(dbClient.sendMessageToDossier(DOSSIER_ID, USER_ID)).rejects.toThrow(UserNotANurseError);
    });

    test('dossier id does not exist, should throw', async () => {
        const USER_ID = 111;

        let dbClient = new MockDbClient({
            users: [
                {
                    "id": USER_ID,
                    "isNurse": true
                }
            ]
        });

        await expect(dbClient.sendMessageToDossier(222, USER_ID)).rejects.toThrow(DossierIdNotFoundError);
    });

    test('dossier not activated yet, should throw', async () => {
        const USER_ID = 111;
        const DOSSIER_ID = 222;

        let dbClient = new MockDbClient({
            users: [
                {
                    "id": USER_ID,
                    "isNurse": true
                }
            ],
            dossiers: [
                {
                    "id": DOSSIER_ID,
                    "isActive": false
                }
            ]
        });

        await expect(dbClient.sendMessageToDossier(DOSSIER_ID, USER_ID)).rejects.toThrow(DossierNotActivatedError);
    });

    const setTimeoutPromisified = (timeout) => new Promise((resolve) => 
        setTimeout(() => resolve(), timeout)
    );

    test('message has been sent, should success', async () => {
        const NURSE_ID = 111;
        const DOSSIER_ID = 222;
        const MESSAGE = "testmessage";

        let dbClient = new MockDbClient({
            users: [
                {
                    "id": NURSE_ID,
                    "isNurse": true
                }
            ],
            dossiers: [
                {
                    "id": DOSSIER_ID,
                    "isActive": true
                }
            ],
            users_dossiers: [
                {
                    "userId": NURSE_ID,
                    "dossierId": DOSSIER_ID
                }
            ]
        });

        await dbClient.sendMessageToDossier(DOSSIER_ID, NURSE_ID, MESSAGE);
        await setTimeoutPromisified(100);
        await dbClient.sendMessageToDossier(DOSSIER_ID, NURSE_ID, MESSAGE + "2");

        let messages = (await dbClient.getInfoFromDossier(DOSSIER_ID, NURSE_ID)).messages;
        expect(messages[0].message).toBe(MESSAGE + "2");
        expect(messages[1].message).toBe(MESSAGE);
    });
});