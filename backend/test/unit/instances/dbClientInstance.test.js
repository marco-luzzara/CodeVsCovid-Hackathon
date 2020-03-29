const dbClientInstance = require('../../../logic/dbClientInstance');

function assertMockDbClient() {
    expect(dbClientInstance.users.length).toBeGreaterThan(0);
    expect(dbClientInstance.dossiers.length).toBeGreaterThan(0);
    expect(dbClientInstance.users_dossiers.length).toBeGreaterThan(0);
    expect(dbClientInstance.messages.length).toBeGreaterThan(0);
}

test('dbClient has been correctly configured', () => {
    switch (dbClientInstance.constructor.name) {
        case "MockDbClient":
            assertMockDbClient();
            break;
    }
});