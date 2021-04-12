const Joi = require('joi');
const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    },
    description: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 1000
    }
});

const Category = mongoose.model('Category', categorySchema);

function validateCategory(category) {
    
    const schema = Joi.object({
        name: Joi.string().min(5).max(50).required(),
        description: Joi.string().min(5).max(1000).required()
    });

    return schema.validate(category);
} 

exports.categorySchema = categorySchema;
exports.validate = validateCategory;
exports.Category = Category;