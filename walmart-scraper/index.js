const axios = require('axios');
const cheerio = require('cheerio');

const WALMART_PAGE_URL = 'https://walmart.com/search?q=computer+screen';
const API_URL = 'https://api.scraperapi.com';
const API_KEY = '<API_KEY>' // <--- Enter your API key here

const parseProductReview = (inputString) => {
    const ratingRegex = /(\d+\.\d+)/;
    const reviewCountRegex = /(\d+) reviews/;

    const ratingMatch = inputString.match(ratingRegex);
    const reviewCountMatch = inputString.match(reviewCountRegex);

    const rating = ratingMatch?.length > 0 ? parseFloat(ratingMatch[0]) : null;
    const reviewCount = reviewCountMatch?.length > 1 ? parseInt(reviewCountMatch[1]) : null;

    return { rating, reviewCount };
};

const webScraper = async () => {
    const queryParams = new URLSearchParams({
        api_key: API_KEY,
        url: WALMART_PAGE_URL,
        render: true,
    });

    try {
        const response = await axios.get(`${API_URL}?${queryParams.toString()}`);

        const html = response.data;

        const $ = cheerio.load(html);
        const productList = [];

        $("div[data-testid='list-view']").each((_, el) => {
            const link = $(el).prev('a').attr('href');
            const price = $(el).find('.f2').text();
            const priceCents = $(el).find('.f2 + span.f6').text();
            const description = $(el).find("span[data-automation-id='product-title']").text();
            const reviews = $(el).find('.w_iUH7').last().text();
            const delivery = $(el).find("div[data-automation-id='fulfillment-badge']").find('span.b').last().text();

            const { rating, reviewCount } = parseProductReview(reviews);

            productList.push({
                description,
                price: `$${price}.${priceCents}`,
                averageRating: rating,
                totalReviews: reviewCount,
                delivery,
                link: `https://www.walmart.com${link}`
            });
        });

        console.log(productList);
    } catch (error) {
        console.log(error)
    }
};

void webScraper();
