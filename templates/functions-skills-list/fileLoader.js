// fileLoader.js
const fs = require('fs');
const path = require('path');

const loadFiles = (folderPath) => {
  const files = fs.readdirSync(folderPath).filter(file => fs.lstatSync(path.join(folderPath, file)).isFile());
  return files;
};

// Specify the folder path
const folderPath = path.join(__dirname, '..', '..', 'database', 's2');
const fileArray = loadFiles(folderPath);

// console.log('Loaded files:', fileArray); // Debug line

// Export the array
module.exports = fileArray;
