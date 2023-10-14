const express = require('express');
const cheerio = require('cheerio');
const { createCsvFile, isCsvFileExists, addLineInCsvFile} = require("./csv-utils");

const PORT = 5001;
const CSV_FILENAME = 'ebay-products.csv';

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: "10mb", extended: true }));

app.post('/ebay-product', async (req, res) => {
    console.log('New request received!', req.body.id);

    if (req.body.response?.body) {
        console.log("Extract product information!");

        const $ = cheerio.load(req.body.response.body);

        const nameElement = $('.x-item-title__mainTitle > span');
        const priceElement = $('.x-price-primary');
        const ebayIdElement = $('.product-spectification .spec-row:first-child ul li:last-child .s-value');

        const currentDate = new Date();

        const product = {
          id: ebayIdElement.text(),
          name: nameElement.text(),
          price: priceElement.text().trim().replace('$', '').replace(',', ''),
          date: `${currentDate.getMonth() + 1}/${currentDate.getDate()}/${currentDate.getFullYear()}`
        };

        await addLineInCsvFile(CSV_FILENAME, product);

        console.log(`Product "${product.name}" added in the CSV file successfully!`);

        return res.json({ data: product });
    }


    return res.json({ data: {} });
});

app.listen(PORT, async () => {
    if (!isCsvFileExists(CSV_FILENAME)) {
        await createCsvFile(CSV_FILENAME);
    }

    console.log(`Application started on URL http://localhost:${PORT} 🎉`);
});