const axios = require('axios');
const cheerio = require('cheerio');
const { exportDataInCsvFile } = require("./csv-exporter");

const EXPORT_FILENAME = 'products.csv';
const HOMEDEPOT_PAGE_URL = 'https://www.homedepot.com/b/Appliances-Refrigerators/N-5yc1vZc3pi?catStyle=ShowProducts&NCNI-5&searchRedirect=refrigerators&semanticToken=i10r10r00f22000000000_202311261341369949425674627_us-east4-5qn1%20i10r10r00f22000000000%20%3E%20rid%3A%7B945c050322f005b6254c2457daf503cb%7D%3Arid%20st%3A%7Brefrigerators%7D%3Ast%20ml%3A%7B24%7D%3Aml%20ct%3A%7Brefrigerator%7D%3Act%20nr%3A%7Brefrigerator%7D%3Anr%20nf%3A%7Bn%2Fa%7D%3Anf%20qu%3A%7Brefrigerator%7D%3Aqu%20ie%3A%7B0%7D%3Aie%20qr%3A%7Brefrigerator%7D%3Aqr&Nao=24';
const API_URL = 'https://api.scraperapi.com';
const API_KEY = '<API_KEY>' // <--- Enter your API key here

const webScraper = async () => {
    console.log('Fetching data with ScraperAPI...');

    const queryParams = new URLSearchParams({
        api_key: API_KEY,
        url: HOMEDEPOT_PAGE_URL,
        render: true,
        country_code: 'us'
    });

    try {
        const response = await axios.get(`${API_URL}?${queryParams.toString()}`);
        const html = response.data;

        const $ = cheerio.load(html);
        const productList = [];

        console.log('Extract information from the HTML...');

        $(".browse-search__pod").each((_, el) => {
            const price = $(el).find('.price-format__main-price').text();
            const model = $(el).find('.product-identifier--bd1f5').text();
            const link = $(el).find("div[data-testid='product-header'] a").attr('href');
            const description = $(el).find("div[data-testid='product-header'] .product-header__title-product--4y7oa").text();
            const brand = $(el).find("div[data-testid='product-header'] .product-header__title__brand--bold--4y7oa").text();

            const characteristics = [];
            const values = $(el).find('.kpf__specs .kpf__value');
            values.each((index, value) => {
                characteristics.push([$(value).text()]);
            });

            productList.push({
                description: description.trim(),
                price,
                model: model.replace('Model# ', ''),
                brand: brand.trim(),
                link: `https://homedepot.com${link}`,
                characteristics: characteristics.join(' - '),
            });
        });

        console.log(`Number of products extracted:`, productList.length);

        await exportDataInCsvFile(EXPORT_FILENAME, productList);
    } catch (error) {
        console.log(error)
    }
};

void webScraper();
