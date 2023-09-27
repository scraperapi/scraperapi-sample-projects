const cheerio = require("cheerio");
const axios = require("axios");

const URL = 'https://www.google.com/search?q=halloween+gift';
const API_KEY = 'api_key'; // <-- enter your API key here

const extractResultsInfo = (html) => {
    const $ = cheerio.load(html);
    const result = [];

    $('.Ww4FFb').each((_, el) => {
       const title = $(el).find('.LC20lb').text();
       const sellerName = $(el).find('.VuuXrf').first().text();
       const link = $(el).find('.yuRUbf span a').attr('href');

       if (!title) {
           return;
       }

       result.push({
           title,
           link,
           price: null,
           sellerName
       });
    });

    return result;
}

const runScraper = async () => {
    const searchParams = new URLSearchParams({
        api_key: API_KEY,
        url: URL,
        render: true,
    });

    try {
        const response = await axios.get(`http://api.scraperapi.com/?${searchParams.toString()}`);

        const html = response.data;

        const result = extractResultsInfo(html);

        console.log(result);
    } catch (e) {
        console.error('Error: ', e);
    }
};

(async () => {
    await runScraper();

    setInterval(async () => {
       await runScraper();
    }, 3600000);
})();
