const mongoose = require('mongoose');

mongoose.connect(process.env.DATABASE_URL);
mongoose.set('debug', true);

module.exports.User = require('./user');
module.exports.Category = require('./category');
module.exports.Product = require('./product');
module.exports.Review = require('./review');
module.exports.Order = require('./order');
