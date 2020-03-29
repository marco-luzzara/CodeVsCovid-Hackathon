// const fs = require('fs');

// class NewsImpl {
//     /**
//      * 
//      * @param {Array} dataMap object of type:
//      * [
//      *  {
//      *      countryId: String,
//      *      filePathOrJson: String | Array
//      *  }
//      * ]
//      * @param {int} timeBeforeUpdate milliseconds specifying the period of time before the next update of the repo
//      */
//     constructor(dataMap, timeBeforeUpdate) {
//         for (let countryData of dataMap) {
//             if (typeof(countryData.countryId) === 'string') {
//                 setInterval(() => {
//                     this.newsRepo = JSON.parse(fs.readFileSync(filePathOrJson, 'utf8'));
//                 }, timeBeforeUpdate);
//             }
//         }

//         this.newsRepo = fileOrJson;
//     }

//     async getNewsFilteredByPositivity(countryId, startVal, endVal) {

//     }
// }

// module.exports = NewsImpl;