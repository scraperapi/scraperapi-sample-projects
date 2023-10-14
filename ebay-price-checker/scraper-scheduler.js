const axios = require('axios');

const pageURLs = [
    'https://www.ebay.com/p/26056267398?iid=314520138765',
    'https://www.ebay.com/p/10059052247?iid=325787830280',
    'https://www.ebay.com/p/3056929579?iid=266442214768'
];

const apiKey = 'API_KEY'; // <-- Enter your API_Key here
const apiUrl = 'https://async.scraperapi.com/batchjobs';
const callbackUrl = 'https://23df-2001-861-3003-e750-6032-b550-d934-7d2f.ngrok.io/ebay-product'; // <-- enter your webhook URL here

const requestData = {
    apiKey: apiKey,
    urls: pageURLs,
    callback: {
        type: 'webhook',
        url: callbackUrl,
    },
};

const runScraper = () => {
    axios.post(apiUrl, requestData)
        .then(response => {
            console.log(response.data);
        })
        .catch(error => {
            console.error(error);
        });
};


(() => {
    runScraper();
    setInterval(() => {
        runScraper();
    }, 3600000);
})();
