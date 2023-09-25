const puppeteer = require("puppeteer");
const cheerio = require("cheerio");
const { sanitize } = require("./utils");

const waitFor = (timeInMs) => new Promise(r => setTimeout(r, timeInMs));

const extractPlacesInfo = (htmlContent) => {
    const result = [];
    const $ = cheerio.load(htmlContent);

    $(".Nv2PK").each((index, el) => {
        const link = $(el).find("a.hfpxzc").attr("href");
        const title = $(el).find(".qBF1Pd").text();
        const averageRating = $(el).find(".MW4etd").text();
        const totalReview = $(el).find(".UY7F9").text();

        const infoElement = $(el).find(".W4Efsd:last-child").find('.W4Efsd');

        const type = $(infoElement).eq(0).find("span:first-child > span").text();
        const address = $(infoElement).eq(0).find("span:last-child span:last-child").text();
        let description = null;
        let availability = null;
        let availabilityStatus = null;
        let phoneNumber = null;

        if (infoElement.length === 2) {
            availabilityStatus = $(infoElement).eq(1).find("span > span > span:first-child").text();
            availability = $(infoElement).eq(1).find("span > span > span:last-child").text();
            phoneNumber = $(infoElement).eq(1).children("span").last().find("span:last-child").text();
        }

        if (infoElement.length === 3) {
            description = $(infoElement).eq(1).find("span > span").text();
            availabilityStatus = $(infoElement).eq(2).find("span > span > span:first-child").text();
            availability = $(infoElement).eq(2).find("span > span > span:last-child").text();
            phoneNumber = $(infoElement).eq(2).children("span").last().find("span:last-child").text();
        }

        const deliveryOptions = $(el).find(".qty3Ue").text();
        const latitude = link.split("!8m2!3d")[1].split("!4d")[0];
        const longitude = link.split("!4d")[1].split("!16s")[0];

        const placeInfo = sanitize({
            address,
            availability,
            availabilityStatus,
            averageRating,
            phoneNumber,
            deliveryOptions,
            description,
            latitude,
            link,
            longitude,
            title,
            type,
            totalReview
        });

        result.push(placeInfo);
    });

    return result;
}

// ScraperAPI proxy configuration
PROXY_USERNAME = 'scraperapi';
PROXY_PASSWORD = 'API_KEY'; // <-- enter your API_Key here
PROXY_SERVER = 'proxy-server.scraperapi.com';
PROXY_SERVER_PORT = '8001';

const main = async () => {
    const browser = await puppeteer.launch({
        ignoreHTTPSErrors: true,
        args: [
            `--proxy-server=http://${PROXY_SERVER}:${PROXY_SERVER_PORT}`
        ]
    });
    const page = await browser.newPage();

    await page.authenticate({
        username: PROXY_USERNAME,
        password: PROXY_PASSWORD,
    });

    await page.setExtraHTTPHeaders({
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 13.5; rv:109.0) Gecko/20100101 Firefox/117.0",
    });

    await page.goto("https://www.google.com/maps/search/bookshop/@37.7575973,-122.5934873,12z?entry=ttu" , {
        waitUntil: 'domcontentloaded',
        timeout: 60000
    });

    const buttonConsentReject = await page.$('.VfPpkd-LgbsSe[aria-label="Reject all"]');
    await buttonConsentReject?.click();

    await waitFor(3000);

    const TOTAL_SCROLL = 5;
    let scrollCounter = 0;
    const scrollContainerSelector = '.m6QErb[aria-label]';

    while (scrollCounter < TOTAL_SCROLL) {
        await page.evaluate(`document.querySelector("${scrollContainerSelector}").scrollTo(0, document.querySelector("${scrollContainerSelector}").scrollHeight)`);

        await waitFor(2000);
        scrollCounter++;
    }

    const html = await page.content();

    await browser.close();

    const result = extractPlacesInfo(html);

    console.log(result);
};

void main();
