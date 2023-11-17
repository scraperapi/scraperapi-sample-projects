const crypto = require('crypto');
const cheerio = require('cheerio');
const express = require('express');
const { createStorageFile, extractProductIdFromURL, saveDataInFile } = require('./utils');

const PORT = 5001;
const STORAGE_FILENAME = 'products-reviews.json';

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: "10mb", extended: true }));

app.post('/product-review', async (req, res) => {
    console.log('New request received!', req.body.id);

    if (req.body.response?.body) {
        console.log("Extract review information!");

        const $ = cheerio.load(req.body.response.body);

        const productId = extractProductIdFromURL(req.body.url);
        const currentDate = new Date();
        const reviewsList = [];

        $("ul .w_HmLO").each((_, el) => {
            const rating = $(el).find('span.w_iUH7').text();
            const creationDate = $(el).find('div:first-child div:nth-child(2) > div.f7').text();
            const title = $(el).find('div:nth-child(2) h3').text();
            const description = $(el).find('div:nth-child(2) div + span').text();
            const reviewer = $(el).find('div:nth-child(3) > div > div:first-child').text();
            const incentivizedReview = $(el).find('div:nth-child(3) > div > div:first-child + div').text();
            const upVoteCount = $(el).find('div:last-child button:first-child span').text();
            const downVoteCount = $(el).find('div:last-child button:last-child span').text();

            const review = {
                id: crypto.randomUUID(),
                productId,
                title: title.length > 0 ? title : null,
                description,
                rating: +rating.replace(' out of 5 stars review', ''),
                reviewer,
                upVoteCount: parseInt(upVoteCount.length > 0 ? upVoteCount : 0),
                downVoteCount: parseInt(downVoteCount.length > 0 ? downVoteCount : 0),
                isIncentivized: incentivizedReview.toLowerCase() === "incentivized review",
                creationDate,
                date: `${currentDate.getMonth() + 1}/${currentDate.getDate()}/${currentDate.getFullYear()}`
            };

            reviewsList.push(review);
        });

        saveDataInFile(STORAGE_FILENAME, reviewsList);

        console.log(`${reviewsList.length} review(s) added in the database successfully!`);

        return res.json({ data: reviewsList });
    }


    return res.json({ data: {} });
});

app.listen(PORT, async () => {
    createStorageFile(STORAGE_FILENAME);

    console.log(`Application started on URL http://localhost:${PORT} 🎉`);
});