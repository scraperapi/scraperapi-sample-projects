const axios = require('axios');

const pageURLs = [
    'https://www.google.com/travel/search?ved=0CAAQ5JsGahcKEwiI9IHigKuBAxUAAAAAHQAAAAAQBg',
    'https://www.google.com/travel/search?ved=0CAAQ5JsGahcKEwiI9IHigKuBAxUAAAAAHQAAAAAQBg&ts=CAEaHgoAEhoSFAoHCOcPEAoYAhIHCOcPEAoYAxgBMgIQACoHCgU6A1VTRA&qs=EgRDQkk9OA0&ap=MAE',
    'https://www.google.com/travel/search?ved=0CAAQ5JsGahcKEwiI9IHigKuBAxUAAAAAHQAAAAAQBg&ts=CAESCgoCCAMKAggDEAAaHBIaEhQKBwjnDxAKGAISBwjnDxAKGAMYATICEAAqBwoFOgNVU0Q&qs=EgRDQ1E9OA1IAA&ap=MAE',
    'https://google.fr'
];

const apiKey = 'API_KEY'; // <-- enter your API_Key here
const apiUrl = 'https://async.scraperapi.com/batchjobs';
const callbackUrl = 'https://791f-2605-6440-4010-2000-00-46d2.ngrok.io'; // <-- enter your webhook URL here

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
