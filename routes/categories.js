const validateObjectId = require('../middleware/validateObjectId');
const { Category, validate } = require('../models/category');
const express = require('express');

const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const { Product } = require('../models/product');
const { Type } = require('../models/type');


router.get('/', async(req, res) => {
     const categories = await Category.find().sort('name');
     res.send(categories);
});


router.get('/:id', async(req, res) => {
    const category = await Category.findById(req.params.id);
    res.send(category);
});

router.post('/', auth, async (req, res) => {
    const {error} = validate(req.body);
    if(error) 
        return res.status(400).send(error.details[0].message);

    let category = new Category({
        name: req.body.name,
        description: req.body.description
    });

    await category.save();

    res.send(category);
});

router.put('/:id', validateObjectId, async (req, res) => {
    const { error } = validate(req.body);
    if(error)
        return res.status(400).send(error.details[0].message);

    const category = await Category.findByIdAndUpdate(req.params.id, { name: req.body.name, description: req.body.description }, 
    {
        new: true
    });

    if(!category)
        return res.status(404).send('The category with this id is not found');

    res.send(category);
});

router.delete('/:id', [auth, admin], validateObjectId, async (req, res) => {
    
    const product = await Product.find({'category._id': req.params.id});
    const type    = await Type.find({'category._id': req.params.id});
    
    if(product[0]) {
        return res.status(404).send({message: 'Cannot delete this category. Products are registered in this category.'});
    }

    if(type[0]) {
        return res.status(404).send({message: 'Cannot delete this category. Types are registered in this category'})
    }
    
    const category = await Category.findByIdAndRemove(req.params.id);

    if(!category) {
        return res.status(404).send('The category with this id is not found');
    }

    res.send(category);
});

module.exports = router;