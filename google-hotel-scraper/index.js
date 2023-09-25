const cheerio = require("cheerio");
const puppeteer = require("puppeteer");
const { sanitize } = require("./utils");

const GOOGLE_HOTEL_PRICE = 'https://www.google.com/travel/search';

const main = async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  await page.goto(GOOGLE_HOTEL_PRICE);

  const buttonConsentReject = await page.$('.VfPpkd-LgbsSe[aria-label="Reject all"]');
  await buttonConsentReject?.click();

  await page.waitForTimeout(3000);
  const html = await page.content();
  await browser.close();

  const hotelsList = [];
  const $ = cheerio.load(html);

  $('.uaTTDe').each((i, el) => {
    const titleElement = $(el).find('.QT7m7 > h2');
    const priceElement = $(el).find('.kixHKb span').first();
    const reviewsElement = $(el).find('.oz2bpb > span');
    const hotelStandingElement = $(el).find('.HlxIlc .UqrZme');

    const options = [];
    const pictureURLs = [];

    $(el).find('.HlxIlc .XX3dkb').each((i, element) => {
      options.push($(element).find('span').last().text());
    });

    $(el).find('.EyfHd .x7VXS').each((i, element) => {
      pictureURLs.push($(element).attr('src'));
    });

    const hotelInfo = sanitize({
      title: titleElement.text(),
      price: priceElement.text(),
      standing: hotelStandingElement.text(),
      averageReview: reviewsElement.eq(0).text(),
      reviewsCount: reviewsElement.eq(1).text(),
      options,
      pictures: pictureURLs,
    });

    hotelsList.push(hotelInfo);
  });

  const sortedHotelsList = hotelsList.slice().sort((hotelOne, hotelTwo) => {
    if (!hotelTwo.price) {
      return 1;
    }

    return hotelOne.price - hotelTwo.price;
  });

  console.log(sortedHotelsList);
}

void main();