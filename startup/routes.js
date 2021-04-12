const express = require('express')
const auth = require('../routes/auth');
const users = require('../routes/users');
const categories = require('../routes/categories');
const types = require('../routes/types');
const products = require('../routes/products');

const error = require('../middleware/error');
const { required } = require('joi');

module.exports = function(app) {
    app.use(express.json());
    app.use('/api/auth', auth);
    app.use('/api/users', users);
    app.use('/api/categories', categories);
    app.use('/api/types', types);
    app.use('/api/products', products);

    app.use(error);
}