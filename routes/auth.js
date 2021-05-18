const _ = require('lodash');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const Joi = require('joi');
const express = require('express');
const router = express.Router();
const { User } = require('../models/user');

router.post('/', async (req, res) => {
    const { error } = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({ email: req.body.email });
    if(!user) return res.status(400).send({message: 'Invalid email or password.'});

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if(!validPassword) return res.status(400).send({message: "Invalid email or password"});

    const token = user.generateAuthToken();
    res.send({
        userId: user._id,
        token: token
    });
});

function validate(req) {
    const schema = Joi.object({
        email: Joi.string().min(5).max(50).required().email(),
        password: Joi.string().min(5).max(255).required()
    });

    return schema.validate(req.body);
}

module.exports = router;