const config = require('config');

const MockDbClientBuilder = require('./mockDbClientBuilder');
const BUILDER_CONFIG = config.builderConfig;

let builder = new MockDbClientBuilder()
    .usersFrom(BUILDER_CONFIG.usersFilePathOrJson)
    .dossiersFrom(BUILDER_CONFIG.dossiersFilePathOrJson)
    .users_dossiersFrom(BUILDER_CONFIG.users_dossiersFilePathOrJson)
    .messagesFrom(BUILDER_CONFIG.messagesFilePathOrJson);

module.exports = builder;