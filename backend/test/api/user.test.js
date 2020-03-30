jest.mock("../../logic/dbClientInstance.js");

const fetch = require('node-fetch');
const REGISTER_USER_URL = "http://localhost:3333/users";
const LOGIN_USER_URL = "http://localhost:3333/users/login";
const ASSOCIATE_DOSSIER_URL = "http://localhost:3333/users/dossiers";

const testUsers = "./test/resources/testUsers.json";
const db = require("../../logic/dbClientInstance.js");
const app = require("../../index");

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

beforeAll(async () => {
    await app.server_starting;
});

beforeEach(() => {
    jest.resetAllMocks();
});

afterAll(() => {
    app.server.close();
});

function mockManagerFunction(mockFun, behaviour) {
    return mockFun.mockImplementationOnce(() => {
        if (behaviour !== null && behaviour.prototype instanceof Error)
            throw new behaviour();
        else
            return behaviour;
    });
}

describe("Register a new user", () => {
    test("00 - Mail not valid", () => {
        let options = {
            method: 'POST',
            body: JSON.stringify({mail: 111, pwd: "abc", role: true}),
            headers: {'Content-Type': 'application/json'}
        }

        return fetch(REGISTER_USER_URL, options).then(
            res => {
                expect(res.status).toBe(400);
            }
        )
    });

    test("01 - Mail not inserted", () => {
        let options = {
            method: 'POST',
            body: JSON.stringify({pwd: "abc", role: true}),
            headers: {'Content-Type': 'application/json'}
        }

        return fetch(REGISTER_USER_URL, options).then(
            res => {
                expect(res.status).toBe(400);
            }
        )
    });

    test("02 - Password not valid", () => {
        let options = {
            method: 'POST',
            body: JSON.stringify({mail: "test@test.it", pwd: 111, role: true}),
            headers: {'Content-Type': 'application/json'}
        }

        return fetch(REGISTER_USER_URL, options).then(
            res => {
                expect(res.status).toBe(400);
            }
        )
    });

    test("03 - Password not inserted", () => {
        let options = {
            method: 'POST',
            body: JSON.stringify({mail: "test@test.it", role: true}),
            headers: {'Content-Type': 'application/json'}
        }

        return fetch(REGISTER_USER_URL, options).then(
            res => {
                expect(res.status).toBe(400);
            }
        )
    });

    test("04 - Role not inserted", () => {
        let options = {
            method: 'POST',
            body: JSON.stringify({mail: "test@test.it", pwd: "pwd"}),
            headers: {'Content-Type': 'application/json'}
        }

        return fetch(REGISTER_USER_URL, options).then(
            res => {
                expect(res.status).toBe(400);
            }
        )
    });

    test("05 - Mail already exists", () => {
        mockManagerFunction(db.addNewUser, UserMailAlreadyExistsError);

        let options = {
            method: 'POST',
            body: JSON.stringify({mail: "mail", pwd: "pwd", role: true}),
            headers: {'Content-Type': 'application/json'}
        }

        return fetch(REGISTER_USER_URL, options).then(
            res => {
                expect(res.status).toBe(409);
            }
        )
    });

    test("06 - Valid registration", () => {
        mockManagerFunction(db.addNewUser, 111);

        let options = {
            method: 'POST',
            body: JSON.stringify({mail: "newmail@test.it", pwd: "pwd", role: true}),
            headers: {'Content-Type': 'application/json'}
        }

        return fetch(REGISTER_USER_URL, options).then(
            res => {
                expect(res.status).toBe(201);
            }
        )
    });
});

describe("User login", () => {
    test("00 - Mail not valid", () => {
        let options = {
            method: 'POST',
            body: JSON.stringify({mail: 111, pwd: "abc"}),
            headers: {'Content-Type': 'application/json'}
        }

        return fetch(LOGIN_USER_URL, options).then(
            res => {
                expect(res.status).toBe(400);
            }
        )
    });

    test("01 - Mail not inserted", () => {
        let options = {
            method: 'POST',
            body: JSON.stringify({pwd: "abc"}),
            headers: {'Content-Type': 'application/json'}
        }

        return fetch(LOGIN_USER_URL, options).then(
            res => {
                expect(res.status).toBe(400);
            }
        )
    });

    test("02 - Password not valid", () => {
        let options = {
            method: 'POST',
            body: JSON.stringify({mail: "test@test.it", pwd: 111}),
            headers: {'Content-Type': 'application/json'}
        }

        return fetch(LOGIN_USER_URL, options).then(
            res => {
                expect(res.status).toBe(400);
            }
        )
    });

    test("03 - Password not inserted", () => {
        let options = {
            method: 'POST',
            body: JSON.stringify({mail: "test@test.it"}),
            headers: {'Content-Type': 'application/json'}
        }

        return fetch(LOGIN_USER_URL, options).then(
            res => {
                expect(res.status).toBe(400);
            }
        )
    });

    test("04 - User not recognized - wrong password", () => {
        mockManagerFunction(db.getUserIdFromCredentials, WrongUserPasswordError);

        let options = {
            method: 'POST',
            body: JSON.stringify({mail: "mail", pwd: "pwd"}),
            headers: {'Content-Type': 'application/json'}
        }

        return fetch(LOGIN_USER_URL, options).then(
            res => {
                expect(res.status).toBe(401);
            }
        )
    });

    test("05 - User not recognized - wrong mail", () => {
        mockManagerFunction(db.getUserIdFromCredentials, UserMailNotFoundError);

        let options = {
            method: 'POST',
            body: JSON.stringify({mail: "mail", pwd: "pwd"}),
            headers: {'Content-Type': 'application/json'}
        }

        return fetch(LOGIN_USER_URL, options).then(
            res => {
                expect(res.status).toBe(401);
            }
        )
    });

    test("06 - User not recognized - wrong mail and password", () => {
        mockManagerFunction(db.getUserIdFromCredentials, UserMailNotFoundError);

        let options = {
            method: 'POST',
            body: JSON.stringify({mail: "abc", pwd: "abc"}),
            headers: {'Content-Type': 'application/json'}
        }

        return fetch(LOGIN_USER_URL, options).then(
            res => {
                expect(res.status).toBe(401);
            }
        )
    });

    test("07 - Valid login", () => {
        mockManagerFunction(db.getUserIdFromCredentials, 111);

        let options = {
            method: 'POST',
            body: JSON.stringify({mail: "mail", pwd: "pwd"}),
            headers: {'Content-Type': 'application/json'}
        }

        return fetch(LOGIN_USER_URL, options).then(
            res => {
                expect(res.status).toBe(200);
            }
        )
    });
});

describe("Dossier association to a user", () => {
    test("00 - User ID not valid", () => {
        let options = {
            method: 'POST',
            body: JSON.stringify({dossierId: 111, dossierPwd: "pwd", patientLabel: "label"}),
            headers: {'Content-Type': 'application/json', 'uid': 'hello'}
        }

        return fetch(ASSOCIATE_DOSSIER_URL, options).then(
            res => {
                expect(res.status).toBe(401);
            }
        )
    });

    test("01 - Missing uid", () => {
        let options = {
            method: 'POST',
            body: JSON.stringify({dossierId: 111, dossierPwd: "pwd", patientLabel: "label"}),
            headers: {'Content-Type': 'application/json'}
        }

        return fetch(ASSOCIATE_DOSSIER_URL, options).then(
            res => {
                expect(res.status).toBe(401);
            }
        )
    });

    test("02 - Wrong dossierId", () => {
        let options = {
            method: 'POST',
            body: JSON.stringify({dossierId: "hello", dossierPwd: "pwd", patientLabel: "label"}),
            headers: {'Content-Type': 'application/json', 'uid': '111'}
        }

        return fetch(ASSOCIATE_DOSSIER_URL, options).then(
            res => {
                expect(res.status).toBe(400);
            }
        )
    });

    test("03 - Missing dossierId", () => {
        let options = {
            method: 'POST',
            body: JSON.stringify({dossierPwd: "pwd", patientLabel: "label"}),
            headers: {'Content-Type': 'application/json', 'uid': 111}
        }

        return fetch(ASSOCIATE_DOSSIER_URL, options).then(
            res => {
                expect(res.status).toBe(400);
            }
        )
    });

    test("04 - Wrong dossierPwd", () => {
        let options = {
            method: 'POST',
            body: JSON.stringify({dossierId: 111, dossierPwd: [], patientLabel: "label"}),
            headers: {'Content-Type': 'application/json', 'uid': 111}
        }

        return fetch(ASSOCIATE_DOSSIER_URL, options).then(
            res => {
                expect(res.status).toBe(400);
            }
        )
    });

    test("05 - Missing dossierPwd", () => {
        let options = {
            method: 'POST',
            body: JSON.stringify({dossierId: 111, patientLabel: "label"}),
            headers: {'Content-Type': 'application/json', 'uid': 111}
        }

        return fetch(ASSOCIATE_DOSSIER_URL, options).then(
            res => {
                expect(res.status).toBe(400);
            }
        )
    });

    test("06 - Wrong patient label", () => {
        let options = {
            method: 'POST',
            body: JSON.stringify({dossierId: 111, dossierPwd: "pwd", patientLabel: []}),
            headers: {'Content-Type': 'application/json', 'uid': 111}
        }

        return fetch(ASSOCIATE_DOSSIER_URL, options).then(
            res => {
                expect(res.status).toBe(400);
            }
        )
    });

    test("07 - Missing patient label", () => {
        let options = {
            method: 'POST',
            body: JSON.stringify({dossierId: 111, dossierPwd: "pwd"}),
            headers: {'Content-Type': 'application/json', 'uid': 111}
        }

        return fetch(ASSOCIATE_DOSSIER_URL, options).then(
            res => {
                expect(res.status).toBe(400);
            }
        )
    });

    test("08 - Dossier not found", () => {
        mockManagerFunction(db.associateDossierToUser, DossierIdNotFoundError);

        let options = {
            method: 'POST',
            body: JSON.stringify({dossierId: 111, dossierPwd: "pwd", patientLabel: "label"}),
            headers: {'Content-Type': 'application/json', 'uid': 111}
        }

        return fetch(ASSOCIATE_DOSSIER_URL, options).then(
            res => {
                expect(res.status).toBe(404);
            }
        )
    });

    test("09 - Dossier already activated", () => {
        mockManagerFunction(db.associateDossierToUser, DossierAlreadyActivatedError);

        let options = {
            method: 'POST',
            body: JSON.stringify({dossierId: 111, dossierPwd: "pwd", patientLabel: "label"}),
            headers: {'Content-Type': 'application/json', 'uid': 111}
        }

        return fetch(ASSOCIATE_DOSSIER_URL, options).then(
            res => {
                expect(res.status).toBe(409);
            }
        )
    });

    test("10 - Wrong dossier password", () => {
        mockManagerFunction(db.associateDossierToUser, WrongDossierPasswordError);

        let options = {
            method: 'POST',
            body: JSON.stringify({dossierId: 111, dossierPwd: "pwd", patientLabel: "label"}),
            headers: {'Content-Type': 'application/json', 'uid': 111}
        }

        return fetch(ASSOCIATE_DOSSIER_URL, options).then(
            res => {
                expect(res.status).toBe(401);
            }
        )
    });

    test("11 - Correct association", () => {
        mockManagerFunction(db.associateDossierToUser, true);

        let options = {
            method: 'POST',
            body: JSON.stringify({dossierId: 111, dossierPwd: "pwd", patientLabel: "label"}),
            headers: {'Content-Type': 'application/json', 'uid': 111}
        }

        return fetch(ASSOCIATE_DOSSIER_URL, options).then(
            res => {
                expect(res.status).toBe(200);
            }
        )
    });
});