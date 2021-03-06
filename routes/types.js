const validateObjectId = require('../middleware/validateObjectId');
const { Type, validate } = require('../models/type');
const express = require('express');
const { Category } = require('../models/category');

const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const { Product } = require('../models/product');

router.get('/', async(req, res) => {
    const types = await Type.find().sort('name');
    res.send(types);
});

router.get('/category/:id', async (req, res) => {
    const categoryId = req.params.id;

    let types;

    try {
        types = await Type.find({'category._id': categoryId});
    } catch(error) {
        return res.status(404).send(error.details[0].message);
    }

    if(!types || types.length === 0) {
        return res.status(404).send('Could not find types for this category');
    }

    res.send(types);
});  


router.post('/', auth, async (req, res) => {
   const {error} = validate(req.body);

   if(error) 
       return res.status(400).send(error.details[0].message);


    const category = await Category.findById(req.body.categoryId);
    if(!category)
        return res.status(400).send('Invalid category.');

   let type = new Type({
       name: req.body.name,
       description: req.body.description,
       category: {
        _id: category._id,
        name: category.name,
        description: category.description
    },
   });

   await type.save();

   res.send(type);
});

router.put('/:id', validateObjectId, async (req, res) => {
   const { error } = validate(req.body);
   if(error)
       return res.status(400).send(error.details[0].message);

    const category = await Category.findById(req.body.categoryId);
    if(!category)
        return res.status(400).send('Invalid category.');

   const type = await Type.findByIdAndUpdate(
       req.params.id, 
       { 
           name: req.body.name, 
           description: req.body.description,  
           category: {
                _id: category._id,
                name: category.name,
                description: category.description
            } 
        }, 
   {
       new: true
   });

   if(!type)
       return res.status(404).send('The type with this id is not found');

   res.send(type);
});

router.delete('/:id', [auth, admin], validateObjectId, async (req, res) => {
    const product = await Product.find({'type._id': req.params.id});

    if(product[0]) {
        return res.status(404).send({message: 'Cannot delete this type. Products are registered in this type.'});
    }

    const type = await Type.findByIdAndRemove(req.params.id);

   if(!type) {
       return res.status(404).send('The category with this id is not found');
   }

   res.send(type);
});

module.exports = router;