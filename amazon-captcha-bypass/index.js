const axios = require('axios');

const AMAZON_PAGE_URL = 'https://www.amazon.com/s?crid=2S8Z5MXHF5A2&i=electronics-intl-ship&k=printers&ref=glow_cls&refresh=3&sprefix=printers%2Celectronics-intl-ship%2C174';
const API_URL = 'https://api.scraperapi.com';
const API_KEY = '<API_KEY>' // <--- Enter your API key here

const webScraper = async () => {
    const queryParams = new URLSearchParams({
        api_key: API_KEY,
        url: AMAZON_PAGE_URL,
        render: true,
    });

    try {
        const response = await axios.get(`${API_URL}/?${queryParams.toString()}`);

        const html = response.data;

        console.log(html);

        console.log("HTML content length: %d", html.length);
    } catch (error) {
        console.log(error.response.data)
    }
};

void webScraper();
