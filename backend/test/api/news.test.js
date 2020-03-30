const fetch = require('node-fetch');
const config = require('config');

const ModelValidationError = require('../../model/exceptions/logic/modelValidationError');
const CountryIdNotFoundError = require('../../model/exceptions/logic/countryIdNotFoundError');

jest.mock('../../logic/newsImplInstance');
const newsImplInstance = require('../../logic/newsImplInstance');

const app = require('../../index');
const HOST = config.host;
const PORT = config.port;

let mockedResetSet = new Set();

beforeAll(async () => {
    await app.server_starting;
});

beforeEach(() => {
    for (let mockFn of mockedResetSet) {
        mockFn.mockReset();
    }
})

function genericCallApi(specificRoute, options) {
    return fetch(`http://${HOST}:${PORT}/news${specificRoute}`, options);
}

function mockFunctionImplementationOnce(fn, implementation) {
    let mockFn = fn.mockImplementation(implementation);
    mockedResetSet.add(mockFn);

    return mockFn;
}

describe('getNewsFilteredByPositivity', () => {
    let callApi = async (countryId, positivityStart, positivityEnd) => await genericCallApi(
        `?countryId=${countryId}&positivityStart=${positivityStart}&positivityEnd=${positivityEnd}`, {
        method: 'GET'
    });

    test('countryId undefined, should call function with default countryId', async () => {
        const POS_START = 0.2;
        const POS_END = 0.6;
        const DEFAULT_COUNTRYID = 'us';
        let mockFn = mockFunctionImplementationOnce(newsImplInstance.getNewsFilteredByPositivity, () => {});

        let res = await genericCallApi(`?positivityStart=${POS_START}&positivityEnd=${POS_END}`);

        expect(res.status).toBe(200);
        expect(mockFn).toHaveBeenCalledWith(DEFAULT_COUNTRYID, POS_START, POS_END);
    });

    test('positivity start undefined, should call function with default positivity start', async () => {
        const POS_END = 0.6;
        const COUNTRY_ID = 'it';
        let mockFn = mockFunctionImplementationOnce(newsImplInstance.getNewsFilteredByPositivity, () => {});

        let res = await genericCallApi(`?countryId=${COUNTRY_ID}&positivityEnd=${POS_END}`);

        expect(res.status).toBe(200);
        expect(mockFn).toHaveBeenCalledWith(COUNTRY_ID, 0, POS_END);
    });

    test('positivity end undefined, should call function with default positivity end', async () => {
        const POS_START = 0.6;
        const COUNTRY_ID = 'it';
        let mockFn = mockFunctionImplementationOnce(newsImplInstance.getNewsFilteredByPositivity, () => {});

        let res = await genericCallApi(`?countryId=${COUNTRY_ID}&positivityStart=${POS_START}`);

        expect(res.status).toBe(200);
        expect(mockFn).toHaveBeenCalledWith(COUNTRY_ID, POS_START, 1);
    });

    test('positivity start validation, should return 400 for all', async () => {
        const POS_END = 0.6;

        let res = await genericCallApi(`?positivityStart=test&positivityEnd=${POS_END}`);
        expect(res.status).toBe(400);

        res = await genericCallApi(`?positivityStart=-2&positivityEnd=${POS_END}`);
        expect(res.status).toBe(400);
        
        res = await genericCallApi(`?positivityStart=11&positivityEnd=${POS_END}`);
        expect(res.status).toBe(400);      
    });

    test('positivity end validation, should return 400 for all', async () => {
        const POS_START = 0.6;

        let res = await genericCallApi(`?positivityStart=${POS_START}&positivityEnd=test`);
        expect(res.status).toBe(400);   

        res = await genericCallApi(`?positivityStart=${POS_START}&positivityEnd=-2`);
        expect(res.status).toBe(400);   

        res = await genericCallApi(`?positivityStart=${POS_START}&positivityEnd=11`);
        expect(res.status).toBe(400);   
    });

    test('countryId does not exist, should return 404', async () => {
        const POS_START = 0.2;
        const POS_END = 0.6;
        const COUNTRY_ID = "notexist";
        let mockFn = mockFunctionImplementationOnce(newsImplInstance.getNewsFilteredByPositivity, () => { throw new CountryIdNotFoundError(COUNTRY_ID)});

        let res = await genericCallApi(`?countryId=${COUNTRY_ID}&positivityStart=${POS_START}&positivityEnd=${POS_END}`);
        expect(res.status).toBe(404);
        expect(mockFn).toHaveBeenCalledWith(COUNTRY_ID, POS_START, POS_END);
    });

    test('validation succeeds', async () => {
        const COUNTRY_ID = 'fr';
        const POS_START = 0.6;
        const POS_END = 0.9;
        let returnedNews = [{
            "author": "authorTest",
            "title": "titleTest",
            "url": "urlTest",
            "urlToImage": "urlToImageTest",
            "publishedAt": "2020-03-29T12:47:41Z",
            "sentiment": 0.832656
        }];
        let mockFn = mockFunctionImplementationOnce(newsImplInstance.getNewsFilteredByPositivity, () => { return returnedNews});

        let res = await genericCallApi(`?countryId=${COUNTRY_ID}&positivityStart=${POS_START}&positivityEnd=${POS_END}`);
        expect(res.status).toBe(200);

        let body = await res.json();
        expect(body).toEqual(returnedNews);
            
        expect(mockFn).toHaveBeenCalledWith(COUNTRY_ID, POS_START, POS_END);
    });
});

afterAll(() => {
    app.server.close();
});