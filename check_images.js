const db = require('./portfolio_db.json');
const missing = db.filter(item => !item.asset_locations || item.asset_locations.length === 0);
console.log('Missing:', missing.length);
if (missing.length > 0) {
  console.log(missing.map(m => m.id));
}
console.log('Total items:', db.length);
