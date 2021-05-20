const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const mongoose = require('mongoose');
const { categorySchema } = require('../models/category');
const { typeSchema } = require('../models/type');

const cartSchema = new mongoose.Schema({
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
        },
        numberOfItems: {
            type: Number
        }  
    }]
});

const Cart = mongoose.model('Cart', cartSchema);

exports.Cart = Cart;

