const NewsImpl = require('./newsImpl');
const config = require('config');

const NEWS_DATA_FOLDER = config.newsDataFolder;
const MILLISEC_BEFORE_NEXT_UPDATE = config.milliSecBeforeNextUpdate;
let newsImplInstance = new NewsImpl(NEWS_DATA_FOLDER, MILLISEC_BEFORE_NEXT_UPDATE);

module.exports = newsImplInstance;