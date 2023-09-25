const uniq = (items) => {
  const map = {};

  for (const item of items) {
      if (!map[item]) {
          map[item] = true;
      }
  }

  return Object.keys(map);
}

const sanitize = (item) => {
    const price = parseInt(item.price.substring(1), 10);
    const averageReview = parseFloat(item.averageReview);
    const totalReview = parseInt(item.reviewsCount.trim().replaceAll(/\(|\)|\,/gm, ''));

    return {
        title: item.title,
        price: isNaN(price) ? null : price,
        standing: item.standing,
        reviews: {
            average: averageReview,
            total: totalReview,
        },
        options: uniq(item.options).sort(),
        pictures: item.pictures.filter(Boolean),
    };
};

module.exports = { uniq, sanitize };