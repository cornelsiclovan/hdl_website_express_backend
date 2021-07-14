const winston = require('winston');
const mongoose = require('mongoose');
const config = require('config');
const dotenv = require('dotenv');
dotenv.config();

module.exports = function() {
    const db = config.get('db');
    
    mongoose.connect(`mongodb://${process.env.MONGODB_HOST}/hdl_db`).
        then(() => winston.info(`Connected to ${db}...`))
}