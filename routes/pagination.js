const { Type } = require('../models/type');
const { Category } = require('../models/category');
const { Product, validate } = require('../models/product');
const express = require('express');

const router = express.Router();

router.get('/', async (req, res) => {
    
    const count = await Product.countDocuments();
    
    res.send({count: count});
});

router.get('/category/:id', async (req, res) => {
    const categoryId = req.params.id;
    const count = await Product.countDocuments({'category._id': categoryId});

    res.send({count: count});
});

router.get('/type/:id', async (req, res) => {
    const typeId = req.params.id;
    const count = await Product.countDocuments({'type._id': typeId});

    res.send({count: count});
});

module.exports = router;