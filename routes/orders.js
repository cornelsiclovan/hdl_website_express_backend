const validateObjectId = require('../middleware/validateObjectId');
const { Product } = require('../models/product');
const { User } = require('../models/user');
const { Order, validate } = require('../models/order');
const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const Fawn = require('fawn');

Fawn.init(mongoose);

router.get('/', async (req, res) => {
    
    const orders = await Order.find();

    res.send(orders);
});

router.get('/user/:id', async (req, res) => {
    
    const userId = req.params.id;
    let userWithOrders;

    try {
        userWithOrders = await User.findById(userId).populate('orders');
    } catch (error) {
        res.status(404).send('Fetching orders failed, try again later');
    }

    if(!userWithOrders || userWithOrders.orders.length === 0) {
        res.status(404).send('Could not find places for this user');
    }

    res.json({ orders: userWithOrders.orders.map(order => order.toObject({ getters: true }))});
});

router.post('/', async (req, res) => {
    const { error } = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const user = await User.findById(req.body.userId);

    const productIds = req.body.products.map(product => product.productId);

    const products = await Product.find().where('_id').in(productIds);

    if(!user) return res.status(400).send('Invalid user');

    let order = new Order({
        creator: user._id,
        products: products
    });

    try {
        new Fawn.Task()
            .save('orders', order)
            .update('users', { _id: user._id}, {
                $push: { orders: order._id }
            })
            .run();
        res.send(order);
    } catch (ex) {
        res.status(500).send(ex);
    }
});


module.exports = router;