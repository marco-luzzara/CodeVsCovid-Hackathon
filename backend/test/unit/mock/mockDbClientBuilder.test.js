const fs = require('fs');

const MockDbClientBuilder = require('../../../logic/mock/mockDbClientBuilder');
const MockDbClient = require('../../../logic/mock/mockDbClient');

const USERS_JSON_FILEPATH = "./test/resources/testUsers.json";

describe('Take configs from object', () => {
    test('complete object, should be equals', () => {
        const USERS = [{ "id": 111 }];
        const DOSSIERS = [{ "id": 333 }];
        const USERS_DOSSIERS = [{ "userId": 111, "dossierId": 222 }];
        const MESSAGES = [{ "userId": 111, "dossierId": 444 }];

        let dbClient = new MockDbClientBuilder()
            .usersFrom(USERS)
            .users_dossiersFrom(USERS_DOSSIERS)
            .dossiersFrom(DOSSIERS)
            .messagesFrom(MESSAGES)
            .build();

        expect(dbClient).toEqual(new MockDbClient({
            users: USERS,
            dossiers: DOSSIERS,
            users_dossiers: USERS_DOSSIERS,
            messages: MESSAGES
        }));
    });

    test('partial object, should be equals', () => {
        const USERS = [{ "id": 111 }];
        const USERS_DOSSIERS = [{ "userId": 111, "dossierId": 222 }];

        let dbClient = new MockDbClientBuilder()
            .usersFrom(USERS)
            .users_dossiersFrom(USERS_DOSSIERS)
            .build();

        expect(dbClient).toEqual(new MockDbClient({
            users: USERS,
            dossiers: [],
            users_dossiers: USERS_DOSSIERS,
            messages: []
        }));
    });
});

describe('Take configs from json file', () => {
    test('partial object, should be equals', async () => {
        let dbClient = new MockDbClientBuilder()
            .usersFrom(USERS_JSON_FILEPATH)
            .build();

        const jsonContent = JSON.parse(fs.readFileSync(USERS_JSON_FILEPATH, 'utf8'));
        expect(dbClient).toEqual(new MockDbClient({
            users: jsonContent,
            dossiers: [],
            users_dossiers: [],
            messages: []
        }));
    });
});