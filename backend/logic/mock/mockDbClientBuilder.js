const fs = require('fs');

const MockDbClient = require('./mockDbClient');

function getJson(fileOrJson) {
    return typeof(fileOrJson) === 'object' ? 
        fileOrJson : 
        JSON.parse(fs.readFileSync(fileOrJson, 'utf8'));
}

class MockDbClientBuilder {
    constructor() {
        this.users = [];
        this.users_dossiers = [];
        this.dossiers = [];
        this.messages = [];
    }

    usersFrom(filePathOrJson) {
        this.users = getJson(filePathOrJson);
        return this;
    }

    users_dossiersFrom(filePathOrJson) {
        this.users_dossiers = getJson(filePathOrJson);
        return this;
    }

    dossiersFrom(filePathOrJson) {
        this.dossiers = getJson(filePathOrJson);
        return this;
    }

    messagesFrom(filePathOrJson) {
        this.messages = getJson(filePathOrJson);
        return this;
    }

    build() {
        return new MockDbClient({
            users: this.users, 
            users_dossiers: this.users_dossiers, 
            dossiers: this.dossiers, 
            messages: this.messages
        });
    }
}

module.exports = MockDbClientBuilder;