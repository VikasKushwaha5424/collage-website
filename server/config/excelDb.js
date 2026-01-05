const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');
const { DATA_DIR } = require('../utils/constants');

const getFilePath = (filename) => path.join(DATA_DIR, filename);

const read = (filename) => {
    try {
        const filePath = getFilePath(filename);
        if (!fs.existsSync(filePath)) return [];
        const workbook = xlsx.readFile(filePath);
        return xlsx.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
    } catch (err) {
        console.error(`Error reading ${filename}:`, err.message);
        return [];
    }
};

const write = (filename, data) => {
    try {
        const worksheet = xlsx.utils.json_to_sheet(data);
        const workbook = xlsx.utils.book_new();
        xlsx.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
        xlsx.writeFile(workbook, getFilePath(filename));
        return true;
    } catch (err) {
        console.error(`Error writing ${filename}:`, err.message);
        return false;
    }
};

module.exports = { read, write };