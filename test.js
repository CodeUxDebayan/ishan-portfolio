const db = require('./portfolio_db.json'); const missing = db.filter(item => !item.asset_locations || item.asset_locations.length === 0); console.log('Missing:', missing.length);
