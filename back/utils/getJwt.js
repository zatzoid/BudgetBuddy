const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.resolve(__dirname, '../..', '.env') });


const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.getJWT = function () {
  return NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret';
};