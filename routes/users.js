const _ = require('lodash');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const Joi = require('joi');
const express = require('express');
const router = express.Router();
const { User, validate } = require('../models/user');
const jwt = require('jsonwebtoken');
const config = require('config');
const auth = require('../middleware/auth');
const HttpError = require('./../models/http-errors');

router.get('/me', auth, async (req, res) => {
    const user = await User.findById(req.user._id).select('-password');
    res.send(user);
});

router.get('/admin/:id', auth, async (req, res) => {
    const adminUser = await User.find({_id: req.params.id});

    if(!adminUser[0].isAdmin) {
        res.send({'error': 'no admin here'})
    }

    const users = await User.find({isAdmin: false});

    res.send(users);
});

router.get('/:id', async (req, res) => {

    const user = await User.findById(req.params.id);

    res.send(user);
});

router.post('/', async (req, res, next) => {
    if(req.body.isAdmin === undefined) 
        req.body.isAdmin = false

    if(req.body.discount === undefined) 
        req.body.discount = 0

    const {error} = validate(req.body);

    //if(error) return res.status(400).send(error.details[0].message);
    if(error) res.status(422).send({message: error.details[0].message});


    let user = await User.findOne({ email: req.body.email });
    
    if(user) 
        return res.status(400).send({message: "User already registered!"});

    user = new User(_.pick(req.body, ['name', 'email', 'password', 'discount', 'isAdmin']));
    
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    await user.save();

    const token = user.generateAuthToken();
    //res.header('x-auth-token', token).send(_.pick(user, ['_id', 'name', 'email', 'isAdmin']));
    res.send({
        userId: user._id,
        token: token,
        isAdmin: user.isAdmin,
        discount: user.discount
    });
});

router.put('/:id', auth, async (req, res) => {
    const userId = req.params.id;

    const myuser = await User.findById(userId);

    
    if(req.body.discount) {
        myuser.discount = req.body.discount;
    } else {

        myuser.name = req.body.name;
        myuser.phone = req.body.phone;
        myuser.companyName = req.body.companyName;
        myuser.organizationID = req.body.organizationID;
        myuser.taxRegistrationID = req.body.taxRegistrationID;
        myuser.billingAddress = req.body.billingAddress;
        myuser.billingAddressLine1 = req.body.billingAddressLine1;
        myuser.billingAddressLine2 = req.body.billingAddressLine2;
        myuser.city = req.body.city;
        myuser.postalCode = req.body.postalCode;
        myuser.country = req.body.country;
    }

    const user = await User.findByIdAndUpdate(
        userId,
        myuser,
        {new: true}
    );

    res.send({
        user
    })
});

router.put('/change_password/:id', auth, async (req, res) => {
    const userId = req.params.id;
    const user = await User.findById(userId);
    
    const validPassword = await bcrypt.compare(req.body.old_password, user.password);
    if(!validPassword) 
        return res.status(400).send({message: 'Invalid password'});

    console.log(req.body.new_password);
    console.log(req.body.retype_new_password);

    if(req.body.new_password  !== req.body.retype_new_password) 
        return res.status(400).send({message: "Retyped password does not match"});


    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(req.body.new_password, salt);

    await user.save();

    res.status(200).send({message: "password changed succesfull"});
});

module.exports = router; 