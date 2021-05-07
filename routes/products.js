const validateObjectId = require('../middleware/validateObjectId');
const { Type } = require('../models/type');
const { Category } = require('../models/category');
const { Product, validate } = require('../models/product');
const express = require('express');

const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const fileUpload = require('../middleware/file-upload');

router.get('/', async (req, res) => {
    
    const products = await Product.find().sort('title');

    res.send(products);
});

router.get('/:id', async (req, res) => {
    
    const product = await Product.findById(req.params.id);
    
    if(!product) return res.status(404).send('The product with this id is not found.');

    res.send(product);
});


router.get('/category/:id', async (req, res) => {
    
    const categoryId = req.params.id;

    let products;

   // console.log(categoryId);

    try {
        products = await Product.find({'category._id': categoryId});
    } catch(error) {
        res.send(products);
        //return res.status(404).send("No items found");
    }

    if(!products || products.length === 0) {
        return res.status(404).send('Could not find types for this category');
    }

    res.send(products);
});

router.get('/type/:id', async (req, res) => {
    
    const typeId = req.params.id;

    let products;

   // console.log(categoryId);

    try {
        products = await Product.find({'type._id': typeId});
    } catch(error) {
        return res.status(404).send(error.details[0].message);
    }

    if(!products || products.length === 0) {
        return res.status(404).send('Could not find types for this category');
    }

    res.send(products);
});

router.post('/', [fileUpload.fields([{name: 'image', maxCount: 12}, {name: 'docs', maxCount: 12} ]), auth], async (req, res) => {

    let picsArray = [];
    let docsArray = [];

    req.files['image'].map(file => picsArray.push(file.path));
    req.files['docs'].map(file => docsArray.push(file.path));

    const { error } = validate(req.body);
    if(error)
        return res.status(400).send(error.details[0].message);
    
    const category = await Category.findById(req.body.categoryId);
    if(!category)
        return res.status(400).send('Invalid category.');

    console.log(category);

    const type = await Type.findById(req.body.typeId);
    if(!type) 
        return res.status(400).send('Invalid type.');

    
    const product = new Product({
        name: req.body.name,
        description: req.body.description,
        unitsInStock: req.body.unitsInStock,
        sku: req.body.sku,
        bus_power: req.body.bus_power,
        width: req.body.width, 
        height: req.body.height,
        depth: req.body.depth,
        weight: req.body.weight,
        discountCategory: req.body.discountCategory,
        image: picsArray,
        docs: docsArray,
        category: {
            _id: category._id,
            name: category.name,
            description: category.description
        },
        type: {
            _id: type._id, 
            name: type.name,
            description: type.description,
            category: type.category
        }
    });    

    await product.save();
    res.send(product);    
});

router.put('/:id',  [fileUpload.fields([{name: 'image', maxCount: 12}, {name: 'docs', maxCount: 12} ]), auth], async (req, res) => {
    let picsArray = [];
    let docsArray = [];

    req.files['image'].map(file => picsArray.push(file.path));
    req.files['docs'].map(file => docsArray.push(file.path));

    
    const { error } = validate(req.body);
    if(error)
       return res.status(400).send(error.details[0].message);

    const category = await Category.findById(req.body.categoryId);
    if(!category)
        return res.status(400).send('Invalid category.');


    const type = await Type.findById(req.body.typeId);
    if(!category)
        return res.status(400).send('Invalid category.');

    const product = await Product.findByIdAndUpdate(
        req.params.id, 
        {
            name: req.body.name,
            description: req.body.description,
            unitsInStock: req.body.unitsInStock,
            sku: req.body.sku,
            bus_power: req.body.bus_power,
            width: req.body.width, 
            height: req.body.height,
            depth: req.body.depth,
            weight: req.body.weight,
            discountCategory: req.body.discountCategory,
            image: picsArray,
            docs: docsArray,
            category: {
                _id: category._id,
                name: category.name,
                description: category.description
            },
            type: {
                _id: type._id, 
                name: type.name,
                description: type.description,
                category: type.category
            }
        }, 
    {
        new: true
    });

    if(!product)
        return res.status(404).send('The type with this id is not found');

    res.send(product);
});

router.delete('/:id', async (req, res) => {

});

module.exports = router;