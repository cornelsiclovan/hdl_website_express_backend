const winston = require('winston');
const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();

app.use('/uploads/images', express.static(path.join('uploads', 'images')));
app.use('/uploads/documents', express.static(path.join('uploads', 'documents')));

app.use((error, req, res, next) => {
    if(req.file) {
        fs.unlink(req.file.path, err => {
            console.log(err);
        });
    }

    if(res.headerSent) {
        return next(error);
    }

    res.status(error.code || 500);
    res.json({message: error.message || 'An unknown error occured'});
}); 


require('./startup/logging')();
require('./startup/routes')(app);
require('./startup/db')();
require('./startup/config')();

const port = process.env.PORT || 3000;
const server = app.listen(port, () => winston.info(`Listening on port ${port}`));

module.exports = server;
