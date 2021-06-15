const validateObjectId = require('../middleware/validateObjectId');
const { Type } = require('../models/type');
const { Category } = require('../models/category');
const { Product, validate, productSchema } = require('../models/product');
const express = require('express');

const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const fileUpload = require('../middleware/file-upload');

router.get('/', async (req, res) => {
    const page = req.query.page || 1;

    const products = await Product.find().sort('name').limit(4).skip(4*(page-1));

    res.send(products);
});

router.get('/:id', async (req, res) => {
    
    const product = await Product.findById(req.params.id);
    
    if(!product) return res.status(404).send('The product with this id is not found.');

    res.send(product);
});
 
router.get('/category/:id', async (req, res) => {
    const page = req.query.page || 1;

    const categoryId = req.params.id;

    let products;


    try {
        products = await Product.find({'category._id': categoryId}).sort('name').limit(4).skip(4*(page-1));
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
    const page = req.query.page || 1;
    
    const typeId = req.params.id;

    let products;

    try {
        products = await Product.find({'type._id': typeId}).sort('name').limit(4).skip(4*(page-1));
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

    console.log(req.files);

    req.files['image'].map(file => picsArray.push(file.path));
    req.files['docs'].map(file => docsArray.push(file.path));

    const { error } = validate(req.body);
    if(error)
        return res.status(400).send(error.details[0].message);
    
    const category = await Category.findById(req.body.categoryId);
    if(!category)
        return res.status(400).send('Invalid category.');

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
        },
        price:     req.body.price,
        currency:  req.body.currency
    });    

    await product.save();
    res.send(product);    
});

router.put('/:id',  [fileUpload.fields([{name: 'image', maxCount: 12}, {name: 'docs', maxCount: 12} ]), auth], async (req, res) => {
    let picsArray = [];
    let docsArray = [];

    if(req.files != undefined)
        req.files['image'].map(file => picsArray.push(file.path));
    if(req.fiels!= undefined)
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

    // const product = await Product.findByIdAndUpdate(
    //     req.params.id, 
    //     {
    //         name: req.body.name,
    //         description: req.body.description,
    //         unitsInStock: req.body.unitsInStock,
    //         sku: req.body.sku,
    //         bus_power: req.body.bus_power,
    //         width: req.body.width, 
    //         height: req.body.height,
    //         depth: req.body.depth,
    //         weight: req.body.weight,
    //         discountCategory: req.body.discountCategory,
    //         image: picsArray,
    //         docs: docsArray,
    //         category: {
    //             _id: category._id,
    //             name: category.name,
    //             description: category.description
    //         },
    //         type: {
    //             _id: type._id, 
    //             name: type.name,
    //             description: type.description,
    //             category: type.category
    //         },
    //         price: req.body.price,
    //         currency: req.body.currency
    //     }, 
    // {
    //     new: true
    // }); 

    const product = await Product.findById(req.params.id);



    product.name = req.body.name;
    product.description = req.body.description;
    product.unitsInStock = req.body.unitsInStock;
    product.sku = req.body.sku;
    product.bus_power = req.body.bus_power;
    product.width = req.body.width;
    product.height = req.body.height;
    product.depth = req.body.depth;
    product.weight = req.body.weight;
    product.discountCategory = req.body.discountCategory;

    if(picsArray.length !== 0)
        product.image = req.body.picsArray;
    
    if(docsArray.length !== 0)
        product.docs = req.body.docsArray;
    
    product.category = {
        _id: category._id,
        name: category.name,
        description: category.description
    };
    product.type = { 
        _id: type._id, 
        name: type.name,
        description: type.description,
        category: type.category
    };
    product.price = req.body.price;
    product.currency = req.body.currency;

    product.save();

    if(!product)
        return res.status(404).send('The type with this id is not found');

    res.send(product);
}); 

router.put('/unitsInStock/:id', auth, async(req, res) => {
    const product = await Product.findById(req.params.id);

    product.unitsInStock = req.body.unitsInStock;

    product.markModified("unitsInStock");

    product.save();

    res.send({'ok': 'ok'})
});

router.delete('/:id', async (req, res) => {

});

module.exports = router;