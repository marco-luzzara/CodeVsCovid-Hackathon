const config = require('config');

const MockDbClientBuilder = require('./mockDbClientBuilder');
const BUILDER_CONFIG = config.builderConfig;

let builder = new MockDbClientBuilder()
    .usersFrom(BUILDER_CONFIG.usersFilePath)
    .dossiersFrom(BUILDER_CONFIG.dossiersFilePath)
    .users_dossiersFrom(BUILDER_CONFIG.users_dossiersFilePath)
    .messagesFrom(BUILDER_CONFIG.messagesFilePath);

module.exports = builder;