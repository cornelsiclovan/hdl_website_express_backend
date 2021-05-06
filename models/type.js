const Joi = require('joi');
const mongoose = require('mongoose');
const { categorySchema } = require('../models/category')

const typeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 100
    },
    description: {
        type: String,
        require: true,
        minlength: 5,
        maxlength: 1000
    },
    category: {
        type: categorySchema,
        required: true
    },
});

const Type = mongoose.model('Type', typeSchema);

function validateType(type) {
    
    const schema = Joi.object({
        name: Joi.string().min(5).max(50).required(),
        description: Joi.string().min(5).max(1000).required(),
        categoryId: Joi.objectId().required(),
    });

    return schema.validate(type);
}

exports.typeSchema = typeSchema;
exports.validate = validateType;
exports.Type = Type;