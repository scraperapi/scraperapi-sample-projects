const axios = require('axios');

const apiKey = '<API_KEY>'; // <-- Enter your API_Key here
const apiUrl = 'https://async.scraperapi.com/batchjobs';
const callbackUrl = '<WEBHOOK_URL>'; // <-- enter your webhook URL here

const runScraper = () => {
    const PAGE_NUMBER = 5;
    const pageURLs = [];

    for (let i = 1; i <= PAGE_NUMBER; i++) {
        pageURLs.push(`https://www.walmart.com/reviews/product/1277532195?page=${i}`);
    }

    const requestData = {
        apiKey: apiKey,
        urls: pageURLs,
        callback: {
            type: 'webhook',
            url: callbackUrl,
        },
    };

    axios.post(apiUrl, requestData)
        .then(response => {
            console.log(response.data);
        })
        .catch(error => {
            console.error(error);
        });
};


void runScraper();
