const fs = require('fs');
const path = require('path');

const FILE = path.join(__dirname, '../data/subscriptions.json');

const getSubscriptions = () => {
  if (!fs.existsSync(FILE)) return [];
  return JSON.parse(fs.readFileSync(FILE, 'utf8'));
};

const saveSubscriptions = (subscriptions) => {
  fs.writeFileSync(FILE, JSON.stringify(subscriptions, null, 2));
};

module.exports = { getSubscriptions, saveSubscriptions };