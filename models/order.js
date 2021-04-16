const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const mongoose = require('mongoose');
const moment = require('moment');
const { categorySchema } = require('../models/category');
const { typeSchema } = require('../models/type');

const orderSchema = new mongoose.Schema({
    creator: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    products: [{
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'Product'  
    }]
});

orderSchema.static.lookup = function(userId, productId) {
    return findOne({
        'user._id': userId,
    })
}


const Order = mongoose.model('Order', orderSchema);


function validateOrder(order) {

    const schema = Joi.object({
        userId: Joi.objectId().required(),
        products: Joi.array().items({
            productId: Joi.objectId().required()
        })
    });

    return schema.validate(order);
}

exports.Order = Order;
exports.validate = validateOrder