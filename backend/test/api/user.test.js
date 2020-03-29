const fetch = require('node-fetch');
const REGISTER_USER_URL = "http://localhost:3333/users";
const LOGIN_USER_URL = "http://localhost:3333/users/login";
const ASSOCIATE_DOSSIER_URL = "http://localhost:3333/users/dossiers";

const testUsers = "./test/resources/testUsers.json";
const app = require("../../index.js");
const db = require("../../../logic/dbClientInstance.js");

beforeAll(async () => {
    await app.server_starting;
});

beforeEach(() => {
    jest.resetAllMocks();
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
        let options = {
            method: 'POST',
            body: JSON.stringify({mail: testUsers[0].mail, pwd: "pwd", role: true}),
            headers: {'Content-Type': 'application/json'}
        }

        return fetch(REGISTER_USER_URL, options).then(
            res => {
                expect(res.status).toBe(409);
            }
        )
    });

    test("06 - Valid registration", () => {
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
        let options = {
            method: 'POST',
            body: JSON.stringify({mail: testUsers[0].mail, pwd: testUsers[0].pwd + "abc"}),
            headers: {'Content-Type': 'application/json'}
        }

        return fetch(LOGIN_USER_URL, options).then(
            res => {
                expect(res.status).toBe(401);
            }
        )
    });

    test("05 - User not recognized - wrong mail", () => {
        let options = {
            method: 'POST',
            body: JSON.stringify({mail: testUsers[0].mail + "abc", pwd: testUsers[0].pwd}),
            headers: {'Content-Type': 'application/json'}
        }

        return fetch(LOGIN_USER_URL, options).then(
            res => {
                expect(res.status).toBe(401);
            }
        )
    });

    test("06 - User not recognized - wrong mail and password", () => {
        let options = {
            method: 'POST',
            body: JSON.stringify({mail: testUsers[0].mail + "abc", pwd: testUsers[0].pwd + "abc"}),
            headers: {'Content-Type': 'application/json'}
        }

        return fetch(LOGIN_USER_URL, options).then(
            res => {
                expect(res.status).toBe(401);
            }
        )
    });

    test("07 - Valid login", () => {
        let options = {
            method: 'POST',
            body: JSON.stringify({mail: testUsers[0].mail, pwd: testUsers[0].pwd}),
            headers: {'Content-Type': 'application/json'}
        }

        return fetch(LOGIN_USER_URL, options).then(
            res => {
                expect(res.status).toBe(200);
            }
        )
    });
});

describe("Dossier association", () => {
    test("00 - User ID not valid", () => {
        return false;
    });
});