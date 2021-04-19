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
        name: {
            type: String,
            required: true,
            minlength: 5,
            maxlength: 100
        },
        description: {
            type: String,
            required: true,
            minlength: 5,
            maxlength: 255
        },
        unitsInStock: {
            type: Number,
            required: true,
            min:0,
            max:1000
        },
        sku: {
            type: String,
            required: true,
            minlength: 5,
            maxlength: 100
        },
        bus_power: {
            type: String,
            required: true,
            minlength: 1,
            maxlength: 100
        },
        width: {
            type: String,
            required: true,
            minlength: 1,
            maxlength: 100
        },
        height: {
            type: String,
            required: true,
            minlength: 1,
            maxlength: 100
        },
        depth: {
            type: String,
            required: true,
            minlength: 1,
            maxlength: 100
        },
        weight: {
            type: String,
            required: true,
            minlength: 1,
            maxlength: 100
        },
        discountCategory: {
            type: String,
            required: true,
            minlength: 1,
            maxlength: 100
        },
        image: {
            type: [String]
        },
        docs: {
            type: [String]
        },
        category: {
            type: categorySchema,
            required: true
        },
        type: {
            type: typeSchema,
            required: true
        }  
    }]
});

orderSchema.static.lookup = function(userId, productId) {
    return findOne({
        'user._id': userId
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