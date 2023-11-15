const fs = require("fs");
const path = require("path");

const extractProductIdFromURL = (url) => {
  const parsedUrl = new URL(url);

  const pathnameParts = parsedUrl.pathname.split("/");

  if (pathnameParts.length === 0) {
      return url;
  }

  return pathnameParts[pathnameParts.length - 1];
};

const createStorageFile = (filename) => {
    const filePath = path.resolve(__dirname, filename);

    if (fs.existsSync(filePath)) {
        return;
    }

    fs.writeFileSync(filePath, JSON.stringify([], null, 2), { encoding: "utf-8" });
};

const saveDataInFile = (filename, items) => {
    // TODO perform fields validation in data

    const filePath = path.resolve(__dirname, filename);
    const fileContent = fs.readFileSync(filePath, { encoding: "utf-8" });
    const dataParsed = JSON.parse(fileContent);

    const dataUpdated = dataParsed.concat(items);

    fs.writeFileSync(filePath, JSON.stringify(dataUpdated, null, 2), { encoding: "utf-8" });
};

module.exports = {
    createStorageFile,
    extractProductIdFromURL,
    saveDataInFile,
};