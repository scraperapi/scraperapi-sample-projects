const path = require('path');
const fs = require('fs');
const csvWriter = require('csv-writer');
const { parse } = require('csv-parse');

const CSV_HEADER = [
    { id: 'id', title: 'Ebay product ID' },
    { id: 'name', title: 'Product Name' },
    { id: 'date', title: 'Date' },
    { id: 'price', title: 'Price (USD)' },
];

const isCsvFileExists = (filename) => {
  return fs.existsSync(path.resolve(__dirname, filename));
}

const createCsvFile = async (filename) => {
    const writer = csvWriter.createObjectCsvWriter({
        path: path.resolve(__dirname, filename),
        header: CSV_HEADER,
    });

    await writer.writeRecords([]);
};

const retrieveCsvContent = (filename) => {
    const csvFilePath = path.resolve(__dirname, filename);

    const headers = ['id', 'name', 'date', 'price'];

    return new Promise((resolve, reject) => {
        const fileContent = fs.readFileSync(csvFilePath, { encoding: 'utf-8' });

        parse(fileContent, {
            delimiter: ',',
            columns: headers,
            fromLine: 2,
            skipEmptyLines: true
        }, (error, result) => {
            if (error) {
                console.error(error);
                reject(error);
            }

            resolve(result);
        });
    });
}

const addLineInCsvFile = async (filename, data) => {
    // TODO perform fields validation in data

    const fileContent = await retrieveCsvContent(filename);

    const contentUpdated = fileContent.concat([data]);

    const writer = csvWriter.createObjectCsvWriter({
        path: path.resolve(__dirname, filename),
        header: CSV_HEADER,
    });

    await writer.writeRecords(contentUpdated);
};

module.exports = {
    isCsvFileExists,
    createCsvFile,
    addLineInCsvFile,
}