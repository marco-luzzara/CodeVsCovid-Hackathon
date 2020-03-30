const fs = require('fs');

const NewsImpl = require('../../logic/newsImpl');

const CountryIdNotFoundError = require('../../model/exceptions/logic/countryIdNotFoundError');

const NEWS_FOLDER = './test/resources/news';
const IT_NEWS_FILEPATH = './test/resources/news/news_it_complete.json';
const EN_NEWS_FILEPATH = './test/resources/news/news_en_complete.json';

describe('NewsImpl creation', () => {
    test('news taken from folder, should store all news', async () => {
        let newsImpl = new NewsImpl(NEWS_FOLDER, 3000);

        let itNews = JSON.parse(fs.readFileSync(IT_NEWS_FILEPATH));
        let enNews = JSON.parse(fs.readFileSync(EN_NEWS_FILEPATH));
        expect(newsImpl.newsRepoMap.get("it")).toEqual(itNews);
        expect(newsImpl.newsRepoMap.get("en")).toEqual(enNews);
    });

    test('news taken from json map, should store all news', async () => {
        const TEST_NEWS = [
            {
                "title": "first new"
            },
            {
                "title": "second new"
            }
        ];
        let newsImpl = new NewsImpl([
            {
                countryId: "it",
                filePathOrJson: TEST_NEWS
            }
        ], 3000);

        expect(newsImpl.newsRepoMap.get("it")).toEqual(TEST_NEWS);
    });
});

describe('getNewsFilteredByPositivity', () => {
    test("countryId does not exist, should throw", async () => {
        let newsImpl = new NewsImpl(NEWS_FOLDER, 3000);

        await expect(newsImpl.getNewsFilteredByPositivity("test")).rejects.toThrow(CountryIdNotFoundError);
    });

    test("requested only positive news, should return filtered news", async () => {
        let newsImpl = new NewsImpl(NEWS_FOLDER, 3000);
        let returnedNews = [
            {
                "author": "authorTest",
                "title": "titleTest",
                "url": "urlTest",
                "urlToImage": "urlToImageTest",
                "publishedAt": "2020-03-29T12:47:41Z",
                "sentiment": 0.832656
            }
        ]

        await expect(newsImpl.getNewsFilteredByPositivity("en", 0.8, 1.0)).resolves
            .toEqual(returnedNews);
    });
});