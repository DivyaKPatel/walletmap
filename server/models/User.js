const fs = require('fs');
const path = require('path');

const FILE = path.join(__dirname, '../data/users.json');

const getUsers = () => {
  if (!fs.existsSync(FILE)) return [];
  return JSON.parse(fs.readFileSync(FILE, 'utf8'));
};

const saveUsers = (users) => {
  fs.writeFileSync(FILE, JSON.stringify(users, null, 2));
};

module.exports = { getUsers, saveUsers };