jest.mock("../../logic/dbClientInstance.js");

const fetch = require('node-fetch');
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

describe("Get all messages for a dossier", () => {
    const PATH = "http://localhost:3333/dossiers/";

    test("00 - Wrong User-Id", () => {
        let options = {
            method: 'GET',
            headers: {'User-Id': 'hello'}
        }

        return fetch(PATH + 111, options).then(
            res => {
                expect(res.status).toBe(401);
            }
        )
    });

    test("01 - Missing User-Id", () => {
        let options = {
            method: 'GET'
        }

        return fetch(PATH + 111, options).then(
            res => {
                expect(res.status).toBe(401);
            }
        )
    });

    test("02 - Wrong dossierId", () => {
        let options = {
            method: 'GET',
            headers: {'User-Id': '111'}
        }

        return fetch(PATH + "hello", options).then(
            res => {
                expect(res.status).toBe(400);
            }
        )
    });

    test("03 - Missing dossierId", () => {
        let options = {
            method: 'GET',
            headers: {'User-Id': 111}
        }

        return fetch(PATH, options).then(
            res => {
                expect(res.status).toBe(404); //API do not exists
            }
        )
    });

    test("04 - Cannot access a dossierId", () => {
        mockManagerFunction(db.getInfoFromDossier, DossierNotAssociatedToUserError);

        let options = {
            method: 'GET',
            headers: {'User-Id': '111'}
        }

        return fetch(PATH + 222, options).then(
            res => {
                expect(res.status).toBe(401);
            }
        )
    });

    test("05 - Dossier not activated yet", () => {
        mockManagerFunction(db.getInfoFromDossier, DossierNotActivatedError);

        let options = {
            method: 'GET',
            headers: {'User-Id': 111}
        }

        return fetch(PATH + 222, options).then(
            res => {
                expect(res.status).toBe(403);
            }
        )
    });

    test("06 - Dossier not found", () => {
        mockManagerFunction(db.getInfoFromDossier, DossierIdNotFoundError);

        let options = {
            method: 'GET',
            headers: {'User-Id': '111'}
        }

        return fetch(PATH + 222, options).then(
            res => {
                expect(res.status).toBe(404);
            }
        )
    });

    test("07 - Correct association", () => {
        mockManagerFunction(db.getInfoFromDossier, []);

        let options = {
            method: 'GET',
            headers: {'User-Id': 111}
        }

        return fetch(PATH + 222, options).then(
            res => {
                expect(res.status).toBe(200);
            }
        )
    });
});

describe("Get all dossiers for a user", () => {
    const PATH = "http://localhost:3333/dossiers";

    test("00 - Wrong userId", () => {
        let options = {
            method: 'GET',
            headers: {'User-Id': "hello"}
        }

        return fetch(PATH, options).then(
            res => {
                expect(res.status).toBe(401);
            }
        )
    });

    test("01 - Missing userId", () => {
        let options = {
            method: 'GET'
        }

        return fetch(PATH, options).then(
            res => {
                expect(res.status).toBe(401);
            }
        )
    });

    test("02 - Correct request", () => {
        mockManagerFunction(db.getUserDossiers, []);
        let options = {
            method: 'GET',
            headers: {'User-Id': 111}
        }

        return fetch(PATH, options).then(
            res => {
                expect(res.status).toBe(200);
            }
        )
    });
});

describe("Activate a dossier", () => {
    const PATH = "http://localhost:3333/dossiers/";

    test("00 - Wrong userId", () => {
        let options = {
            method: 'PUT',
            headers: {'User-Id': "hello"}
        }

        return fetch(PATH + 222, options).then(
            res => {
                expect(res.status).toBe(401);
            }
        )
    });

    test("01 - Missing userId", () => {
        let options = {
            method: 'PUT'
        }

        return fetch(PATH + 222, options).then(
            res => {
                expect(res.status).toBe(401);
            }
        )
    });

    test("02 - Missing dossierId", () => {
        let options = {
            method: 'PUT',
            headers: {'User-Id': '111'}
        }

        return fetch(PATH, options).then(
            res => {
                expect(res.status).toBe(404);   //Api do not exists
            }
        )
    });

    test("03 - Wrong dossierId", () => {
        let options = {
            method: 'PUT',
            headers: {'User-Id': '111'}
        }

        return fetch(PATH + "hello", options).then(
            res => {
                expect(res.status).toBe(400);
            }
        )
    });

    test("04 - User not a nurse", () => {
        mockManagerFunction(db.activateDossier, UserNotANurseError);

        let options = {
            method: 'PUT',
            headers: {'User-Id': 111}
        }

        return fetch(PATH + 111, options).then(
            res => {
                expect(res.status).toBe(401);
            }
        )
    });

    test("05 - Dossier not found", () => {
        mockManagerFunction(db.activateDossier, DossierIdNotFoundError);
        
        let options = {
            method: 'PUT',
            headers: {'User-Id': 111}
        }

        return fetch(PATH + 111, options).then(
            res => {
                expect(res.status).toBe(404);
            }
        )
    });

    test("06 - Dossier already activated", () => {
        mockManagerFunction(db.activateDossier, DossierAlreadyActivatedError);
        
        let options = {
            method: 'PUT',
            headers: {'User-Id': 111}
        }

        return fetch(PATH + 111, options).then(
            res => {
                expect(res.status).toBe(409);
            }
        )
    });

    test("07 - Correct activation", () => {
        mockManagerFunction(db.activateDossier, true);
        
        let options = {
            method: 'PUT',
            headers: {'User-Id': 111}
        }

        return fetch(PATH + 111, options).then(
            res => {
                expect(res.status).toBe(200);
            }
        )
    });
});

describe("Generate a new dossier", () => {
    const PATH = "http://localhost:3333/dossiers";

    test("00 - Wrong userId", () => {
        let options = {
            method: 'POST',
            headers: {'User-Id': 'hello'}
        }

        return fetch(PATH, options).then(
            res => {
                expect(res.status).toBe(401);
            }
        )
    });

    test("01 - Missing userId", () => {
        let options = {
            method: 'POST'
        }

        return fetch(PATH, options).then(
            res => {
                expect(res.status).toBe(401);
            }
        )
    });

    test("02 - User is not a nurse", () => {
        mockManagerFunction(db.createDossier, UserNotANurseError);

        let options = {
            method: 'POST',
            headers: {'User-Id': 111}
        }

        return fetch(PATH, options).then(
            res => {
                expect(res.status).toBe(401);
            }
        )
    });

    test("03 - Correct generation", () => {
        mockManagerFunction(db.createDossier, {});

        let options = {
            method: 'POST',
            headers: {'User-Id': 111}
        }

        return fetch(PATH, options).then(
            res => {
                expect(res.status).toBe(201);
            }
        )
    });
});

describe("Send messages", () => {
    const PATH = "http://localhost:3333/dossiers/";

    test("00 - Wrong userId", () => {
        let options = {
            method: 'POST',
            body: "messageText",
            headers: {'Content-Type': 'text/plain', 'User-Id': 'hello'}
        }

        return fetch(PATH + "111/messages", options).then(
            res => {
                expect(res.status).toBe(401);
            }
        )
    });

    test("01 - Missing userId", () => {
        let options = {
            method: 'POST',
            body: "messageText",
            headers: {'Content-Type': 'text/plain'}
        }

        return fetch(PATH + "111/messages", options).then(
            res => {
                expect(res.status).toBe(401);
            }
        )
    });

    test("02 - Missing message", () => {
        let options = {
            method: 'POST',
            headers: {'User-Id': 111}
        }

        return fetch(PATH + "111/messages", options).then(
            res => {
                expect(res.status).toBe(400);
            }
        )
    });

    test("03 - Empty message", () => {
        let options = {
            method: 'POST',
            body: "",
            headers: {'Content-Type': 'text/plain', 'User-Id': 111}
        }

        return fetch(PATH + "111/messages", options).then(
            res => {
                expect(res.status).toBe(400);
            }
        )
    });

    test("04 - Missing dossierId", () => {
        let options = {
            method: 'POST',
            body: "messageText",
            headers: {'Content-Type': 'text/plain', 'User-Id': 111}
        }

        return fetch(PATH + "/messages", options).then(
            res => {
                expect(res.status).toBe(404);   //API do not exists
            }
        )
    });

    test("05 - Wrong dossierId", () => {
        let options = {
            method: 'POST',
            body: "messageText",
            headers: {'Content-Type': 'text/plain', 'User-Id': 111}
        }

        return fetch(PATH + "aaa/messages", options).then(
            res => {
                expect(res.status).toBe(400);
            }
        )
    });

    test("06 - User is not a nurse", () => {
        mockManagerFunction(db.sendMessageToDossier, UserNotANurseError);

        let options = {
            method: 'POST',
            body: "messageText",
            headers: {'Content-Type': 'text/plain', 'User-Id': '111'}
        }

        return fetch(PATH + "111/messages", options).then(
            res => {
                expect(res.status).toBe(401);
            }
        )
    });

    test("07 - DossierId not found", () => {
        mockManagerFunction(db.sendMessageToDossier, DossierIdNotFoundError);

        let options = {
            method: 'POST',
            body: "messageText",
            headers: {'Content-Type': 'text/plain', 'User-Id': '111'}
        }

        return fetch(PATH + "1111/messages", options).then(
            res => {
                expect(res.status).toBe(404);
            }
        )
    });

    test("08 - Dossier not activated yet", () => {
        mockManagerFunction(db.sendMessageToDossier, DossierNotActivatedError);

        let options = {
            method: 'POST',
            body: "messageText",
            headers: {'Content-Type': 'text/plain', 'User-Id': '111'}
        }

        return fetch(PATH + "111/messages", options).then(
            res => {
                expect(res.status).toBe(409);
            }
        )
    });
});