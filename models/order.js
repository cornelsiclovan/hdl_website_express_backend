const { boolean } = require('joi');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const mongoose = require('mongoose');
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
            type: categorySchema,
            
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
        }
     
    }],
    qtyArray: [{
        productId: {
            type: String
        },
        qty: {
            type: Number
        }
    }],
    inCart: {
        type: Boolean
    },
    date: {
        type: Date
    },
    status: {
        type: String
    }

});

orderSchema.static.lookup = function(userId, productId) {
    return findOne({
        'user._id': userId
    })
}
  

const Order = mongoose.model('Order', orderSchema);


function validateOrder(order) {

    const schema = Joi.object({
        userId: Joi.objectId(),
        products: Joi.array().items({
            productId: Joi.objectId()
        }),
        qtyArray: Joi.array().items({
            productId: Joi.string(),
            qty: Joi.number()
        }),
        inCart: Joi.boolean(),
        status: Joi.number()
    });

    return schema.validate(order);
} 

exports.Order = Order;
exports.validate = validateOrder