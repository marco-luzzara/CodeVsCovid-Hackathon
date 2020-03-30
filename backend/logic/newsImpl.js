const fs = require('fs');
const path = require('path');

const CountryIdNotFoundError = require('../model/exceptions/logic/countryIdNotFoundError');

function wrapInPromise(fn) {
    return new Promise((resolve, reject) => {
        let result = fn();
        resolve(result);
    });
}

class NewsImpl {
    /**
     * 
     * @param {Array | String} dataMap array of type:
     * [
     *  {
     *      countryId: String,
     *      filePathOrJson: String | Array
     *  }
     * ]
     * or 
     * string that represents the folder where data are stored
     * @param {int} timeBeforeUpdate milliseconds specifying the period of time before the next update of the repo
     */
    constructor(dataMap, timeBeforeUpdate) {
        this.newsRepoMap = new Map();

        if (typeof(dataMap) === 'string') {
            let initNewsRepoMap = () => {
                fs.readdirSync(dataMap).forEach(countryNewsFileName => {
                    let tokenizedFileName = countryNewsFileName.split('_');

                    let countryId = tokenizedFileName[1].toLowerCase();
                    let countryNewsPath = path.join(dataMap, countryNewsFileName);
                    let countryNewsRepo = JSON.parse(fs.readFileSync(countryNewsPath, 'utf8'));

                    this.newsRepoMap.set(countryId, countryNewsRepo);
                });
            };

            initNewsRepoMap();
            setInterval(() => initNewsRepoMap(), timeBeforeUpdate);
        }
        else {
            for (let countryData of dataMap) {
                if (typeof(countryData.filePathOrJson) === 'string') {
                    let initNewsRepoMap = () => {
                        let countryNewsRepo = JSON.parse(fs.readFileSync(countryData.filePathOrJson, 'utf8'));
                        this.newsRepoMap.set(countryData.countryId, countryNewsRepo);
                    };

                    initNewsRepoMap();
                    setInterval(() => initNewsRepoMap(), timeBeforeUpdate);
                }
                else {
                    this.newsRepoMap.set(countryData.countryId, countryData.filePathOrJson);
                }
            }
        }
    }

    getNewsFilteredByPositivity(countryId, startVal, endVal) {
        return wrapInPromise(() => {
            let countryData = this.newsRepoMap.get(countryId);

            if (countryData === undefined)
                throw new CountryIdNotFoundError(countryId);

            return countryData
                .filter(_new => _new.sentiment_scaled >= startVal && _new.sentiment_scaled <= endVal)
                .map(_new => ({
                    author: _new.source.name,
                    title: _new.title,
                    url: _new.url,
                    urlToImage: _new.urlToImage,
                    publishedAt: _new.publishedAt,
                    sentiment: _new.sentiment_scaled,
                }));
        });
    }
}

module.exports = NewsImpl;