const config = require('config');
const BUILDER_INSTANCE_PATH = config.builderInstancePath;

let builder = require("./" + BUILDER_INSTANCE_PATH);
let dbClient = builder.build();

module.exports = dbClient;