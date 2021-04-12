const validateObjectId = require('../middleware/validateObjectId');
const { Type, validate } = require('../models/type');
const express = require('express');

const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

router.get('/', async(req, res) => {
    const types = await Type.find().sort('name');
    res.send(types);
});

router.post('/', auth, async (req, res) => {
   const {error} = validate(req.body);
   if(error) 
       return res.status(400).send(error.details[0].message);

   let type = new Type({
       name: req.body.name,
       description: req.body.description
   });

   await type.save();

   res.send(type);
});

router.put('/:id', validateObjectId, async (req, res) => {
   const { error } = validate(req.body);
   if(error)
       return res.status(400).send(error.details[0].message);

   const type = await Type.findByIdAndUpdate(req.params.id, { name: req.body.name, description: req.body.description }, 
   {
       new: true
   });

   if(!type)
       return res.status(404).send('The type with this id is not found');

   res.send(type);
});

router.delete('/:id', [auth, admin], validateObjectId, async (req, res) => {
   const type = await Type.findByIdAndRemove(req.params.id);

   if(!type) {
       return res.status(404).send('The category with this id is not found');
   }

   res.send(type);
});

module.exports = router;