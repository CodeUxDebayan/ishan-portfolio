const fs = require('fs');
const path = require('path');
const db = require('./portfolio_db.json');
let missingCount = 0;
for (const item of db) {
  if (item.asset_locations && item.asset_locations.length > 0) {
    const loc = item.asset_locations[0];
    const fullPath = path.join(__dirname, 'public', decodeURI(loc));
    if (!fs.existsSync(fullPath)) {
      console.log('Missing file on disk:', fullPath);
      missingCount++;
    }
  }
}
console.log('Total missing files:', missingCount);
