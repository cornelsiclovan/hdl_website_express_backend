const Joi = require('@hapi/joi');
Joi.objectId = require('joi-objectid')(Joi);
const mongoose = require('mongoose');
const moment = require('moment');
const { categorySchema } = require('../models/category');
const { typeSchema } = require('../models/type');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 100
    },
    description: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 500
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
        type: categorySchema
    },
    type: {
        type: typeSchema,
        required: true
    },
    price: {
        type: String,
        required: true
    },
    currency: {
        type: String,
        required: true
    },
    qtyInCart: {
        type: Number
    }
});

const Product = mongoose.model('Product', productSchema);

function validateProduct(product) {
    const schema = Joi.object({
        name: Joi.string().min(2).max(100).required(),
        description: Joi.string().min(5).max(500).required(),
        unitsInStock: Joi.number().min(0).max(1000).required(),
        sku: Joi.string().min(5).max(100).required(),
        bus_power: Joi.string().min(1).max(100).required(),
        width: Joi.string().min(1).max(100).required(),
        height: Joi.string().min(1).max(100).required(),
        depth: Joi.string().min(1).max(100).required(),
        weight: Joi.string().min(1).max(100).required(),
        discountCategory: Joi.string().min(1).max(100).required(),
        categoryId: Joi.objectId(),
        typeId : Joi.objectId().required(),
        price: Joi.string().required(),
        currency: Joi.string().required()
    });

    return schema.validate(product);
}

exports.productSchema = productSchema;
exports.validate = validateProduct;
exports.Product = Product;

