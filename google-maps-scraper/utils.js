const sanitize = (placeInfo) => {
    const totalReview = parseInt(placeInfo.totalReview.trim().replaceAll(/\(|\)|\,/gm, ''))

    const deliveryOptions = placeInfo.deliveryOptions.trim().startsWith('"') ? null : placeInfo.deliveryOptions;

    return {
        address: placeInfo.address,
        availability: placeInfo.availability?.replace('⋅', '').trim(),
        availabilityStatus: placeInfo.availabilityStatus,
        averageRating: +placeInfo.averageRating,
        phoneNumber: placeInfo.phoneNumber,
        deliveryOptions: deliveryOptions?.trim().split('·') ?? null,
        description: placeInfo.description,
        latitude: +placeInfo.latitude,
        link: placeInfo.link,
        longitude: +placeInfo.longitude,
        title: placeInfo.title,
        type: placeInfo.type,
        totalReview,
    };
}

module.exports = { sanitize };
