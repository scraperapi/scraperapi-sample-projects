const puppeteer = require("puppeteer");
const cheerio = require("cheerio");

const URL = 'https://www.google.com/search?q=halloween+gift';

const waitFor = (timeInMs) => new Promise(r => setTimeout(r, timeInMs));

const extractResultsInfo = (html) => {
    const $ = cheerio.load(html);

    const result = {
        sponsored: [],
        organics: [],
    }

    $('.top-pla-group-inner .pla-unit-container').each((index, el) => {
        const thumbnail = $(el).find('.Gor6zc').children('img').attr('src');
        const title = $(el).find('.RnJeZd .pla-unit-title-link').text();
        const link = $(el).find('.RnJeZd .pla-unit-title-link').attr('href');
        const price = $(el).find('.orXoSd .e10twf').text();
        const sellerName = $(el).find('.orXoSd .zPEcBd').attr('aria-label');

        result.sponsored.push({
            // thumbnail,
            title,
            link,
            price,
            sellerName
        });
    });

    $('.Ww4FFb').each((_, el) => {
       const title = $(el).find('.LC20lb').text();
       const sellerName = $(el).find('.VuuXrf').first().text();
       const link = $(el).find('.yuRUbf span a').attr('href');

       if (!title) {
           return;
       }

       result.organics.push({
           title,
           link,
           price: null,
           sellerName
       });
    });

    return result;
}

const runScraper = async () => {
    const browser = await puppeteer.launch({
        headless: 'new',
        args: ["--disabled-setuid-sandbox", "--no-sandbox"],
    });
    const page = await browser.newPage();

    await page.setExtraHTTPHeaders({
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 13.5; rv:109.0) Gecko/20100101 Firefox/117.0",
    });

    await page.goto(URL , { waitUntil: 'domcontentloaded', timeout: 60000 });

    const buttonConsentReject = await page.$('.VfPpkd-LgbsSe[aria-label="Reject all"]');
    await buttonConsentReject?.click();

    await waitFor(3000);

    const html = await page.content();

    await browser.close();

    const result = extractResultsInfo(html);

    console.log(result);
};

(async () => {
    await runScraper();

    setInterval(async () => {
       await runScraper();
    }, 3600000);
})();
