const puppeteer = require("puppeteer");
const cheerio = require("cheerio");
const Excel = require("exceljs");
const path = require("path");

const TARGET_DOT_COM_PAGE_URL = 'https://www.target.com/s?searchTerm=headphones&tref=typeahead%7Cterm%7Cheadphones%7C%7C%7Chistory';
const EXPORT_FILENAME = 'products.xlsx';

const waitFor = (timeInMs) => new Promise(r => setTimeout(r, timeInMs));

const exportProductsInExcelFile = async (productsList) => {
    const workbook = new Excel.Workbook();
    const worksheet = workbook.addWorksheet('Headphones');

    worksheet.columns = [
        { key: 'title', header: 'Title' },
        { key: 'brand', header: 'Brand' },
        { key: 'currentPrice', header: 'Current Price' },
        { key: 'regularPrice', header: 'Regular Price' },
        { key: 'averageRating', header: 'Average Rating' },
        { key: 'totalReviews', header: 'Total Reviews' },
        { key: 'link', header: 'Link' },
    ];

    worksheet.getRow(1).font = {
        bold: true,
        size: 13,
    };

    productsList.forEach((product) => {
        worksheet.addRow(product);
    });

    const exportFilePath = path.resolve(__dirname, EXPORT_FILENAME);

    await workbook.xlsx.writeFile(exportFilePath);
};

const parseProductReview = (inputString) => {
    const ratingRegex = /(\d+(\.\d+)?)/;
    const reviewCountRegex = /(\d+) ratings/;

    const ratingMatch = inputString.match(ratingRegex);
    const reviewCountMatch = inputString.match(reviewCountRegex);

    const rating = ratingMatch?.length > 0 ? parseFloat(ratingMatch[0]) : null;
    const reviewCount = reviewCountMatch?.length > 1 ? parseInt(reviewCountMatch[1]) : null;

    return { rating, reviewCount };
};


const webScraper = async () => {
    const browser = await puppeteer.launch({
        headless: false
    });
    const page = await browser.newPage();

    await page.setExtraHTTPHeaders({
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 13.5; rv:109.0) Gecko/20100101 Firefox/117.0",
    });

    await page.goto(TARGET_DOT_COM_PAGE_URL);

    const buttonConsentReject = await page.$('.VfPpkd-LgbsSe[aria-label="Reject all"]');
    await buttonConsentReject?.click();

    await waitFor(3000);

    await page.evaluate(async () => {
        await new Promise((resolve) => {
            let totalHeight = 0;
            const distance = 100;

            const timer = setInterval(() => {
                const scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;

                if (totalHeight >= scrollHeight) {
                    clearInterval(timer);
                    resolve()
                }
            }, 100);
        });
    });

    const html = await page.content();
    await browser.close();

    const $ = cheerio.load(html);

    const productList = [];

    $(".dOpyUp").each((_, el) => {
        const link = $(el).find("a.csOImU").attr('href');
        const title = $(el).find('a.csOImU').text();
        const brand = $(el).find('a.cnZxgy').text();
        const currentPrice = $(el).find("span[data-test='current-price'] span").text();
        const regularPrice = $(el).find("span[data-test='comparison-price'] span").text();
        const reviews = $(el).find(".hMtWwx").text();

        const { rating, reviewCount } = parseProductReview(reviews);

        productList.push({
            title,
            brand,
            currentPrice,
            regularPrice,
            averageRating: rating,
            totalReviews: reviewCount,
            link,
        });
    });

    console.log(`Number of items extracted:`, productList.length);

    await exportProductsInExcelFile(productList);

    console.log('The products has been successfully exported in the Excel file!');
};

void webScraper();
