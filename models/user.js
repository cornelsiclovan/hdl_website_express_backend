const Joi = require('joi');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('config');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    },
    email: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255,
        unique: true
    },
    discount: {
        type: String
    },
    password: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 1024
    },
    orders: [{
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'Order'
    }],
    isAdmin: Boolean
});

userSchema.methods.generateAuthToken = function() {
    const token = jwt.sign({ _id: this._id, isAdmin: this.isAdmin }, config.get('jwtPrivateKey'));
    return token;
}

const User = mongoose.model('User', userSchema);

function validateUser(user) {

    const schema = Joi.object({
        email: Joi.string().min(5).max(50).required().email(),
        name: Joi.string().min(5).max(255).required(),
        password: Joi.string().min(5).max(1024).required(),
        isAdmin: Joi.required(),
        discount : Joi.required()
    });

    return schema.validate(user);
}

exports.User = User;
exports.validate = validateUser;