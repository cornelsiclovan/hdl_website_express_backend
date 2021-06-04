const validateObjectId = require('../middleware/validateObjectId');
const { Product, productSchema } = require('../models/product');
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
    
    const orders = await Order.find({'status': req.query.status});
 
    res.send(orders);
});

router.get('/:id', async (req, res) => {

    const orderId = req.params.id;
    
    const orders = await Order.findById(orderId);

    res.send(orders);
});

router.get('/user/:id/completed', auth, async (req, res) => {
    const userId = req.params.id;
    let userWithOrders;
    let inCart = req.query.inCart;

    try {
        userWithOrders = await  User.findById(userId).populate({path: 'orders', match: {inCart: inCart}});
    }catch(error) {
        res.status(404).send('Fetching orders failed, try again later');
    }

    if(!userWithOrders || userWithOrders.orders.length === 0) {
        res.status(400).send({message: 'Could not find orders for this user'});
    }

    res.json({ orders: userWithOrders.orders.map(order => order.toObject({ getters: true }))});
}) 

router.get('/user/:id', async (req, res) => {


    const userId = req.params.id;
    let userWithOrders;

    let inCart = req.query.inCart;
    //console.log(inCart);

    try {
        userWithOrders = await User.findById(userId).populate({path: 'orders', match: {inCart: inCart}});
    } catch (error) {
        res.status(404).send('Fetching orders failed, try again later');
    }

    if(!userWithOrders || userWithOrders.orders.length === 0) {
        res.status(400).send({message: 'Could not find orders for this user'});
    }

    res.json({ orders: userWithOrders.orders.map(order => order.toObject({ getters: true }))});
});

router.post('/', async (req, res) => {
    const { error } = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const user = await User.findById(req.body.userId);

    const productIds = req.body.products.map(product => product.productId);

    // status = 0 order set
    // status = 1 order processed
    // status = 2 order rejectet

    const status = 0;

    const products = await Product.find().where('_id').in(productIds);


    if(!user) return res.status(400).send('Invalid user');

    let order = new Order({
        creator: user._id,
        products: products,
        qtyArray: req.body.qtyArray,
        inCart: req.body.inCart,
        date: new Date(),
        status: status
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

router.put('/:id', async (req, res) => {
    const { error } = validate(req.body);
    let order = null;
    if(error) return res.status(400).send(error.details[0].message);

    console.log(req.body.status);

    if(!req.body.status && !req.query.unreject) {
 
        const user = await User.findById(req.body.userId);

        const productIds = req.body.products.map(product => product.productId);

        const products = await Product.find().where('_id').in(productIds);

        if(!user) return res.status(400).send('Invalid user');

        order = await Order.findByIdAndUpdate(
            req.params.id,
            {
                creator: user._id,
                products: products,
                qtyArray: req.body.qtyArray,
                inCart: req.body.inCart,
                date: new Date()
            }
        )
    }else { 

        console.log('here');
        
        order = await Order.findById(req.params.id);
        order.status = req.body.status;
        order.save();
        
    } 

    if(!order) return res.status(404).send('The order with the give id was not found');

    res.send(order); 
});

module.exports = router;