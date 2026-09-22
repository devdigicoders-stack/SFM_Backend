const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '../data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const getFilePath = (collectionName) => path.join(dataDir, `${collectionName}.json`);

const readCollection = (collectionName, defaultData = []) => {
  try {
    const file = getFilePath(collectionName);
    if (fs.existsSync(file)) {
      const content = fs.readFileSync(file, 'utf-8');
      return JSON.parse(content);
    }
  } catch (err) {
    console.error(`Error reading collection ${collectionName}:`, err.message);
  }
  return defaultData;
};

const writeCollection = (collectionName, data) => {
  try {
    const file = getFilePath(collectionName);
    fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error(`Error writing collection ${collectionName}:`, err.message);
    return false;
  }
};

module.exports = {
  readCollection,
  writeCollection
};
