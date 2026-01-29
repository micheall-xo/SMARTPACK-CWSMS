const mongoose = require('mongoose');
require('dotenv').config();

const uri = process.env.MONGO_URI;
const dbName = process.env.DB_NAME || 'CWSMS';

async function connect() {
  if (!uri) {
    throw new Error('MONGO_URI is not set');
  }
  await mongoose.connect(uri, { dbName });
}

module.exports = { connect };
