const path = require('path');
const csvWriter = require('csv-writer');

const COLUMN_HEADER = [
    { id: 'model', title: 'Model' },
    { id: 'description', title: 'Description' },
    { id: 'price', title: 'Price (USD)' },
    { id: 'brand', title: 'Brand' },
    { id: 'link', title: 'Link' },
    { id: 'characteristics', title: 'Characteristics' },
];

const exportDataInCsvFile = async (filename, data) => {
    // TODO perform fields validation in data

    const writer = csvWriter.createObjectCsvWriter({
        path: path.resolve(__dirname, filename),
        header: COLUMN_HEADER,
    });

    await writer.writeRecords(data);
};

module.exports = {
    exportDataInCsvFile,
}