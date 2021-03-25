let http = require('http');
let fs = require('fs');
const express = require('express');

const router = require('./routes/routes');

const app = express();

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use('/', router);

app.use(express.static('public'));

app.listen(3001, () => {
    console.log('App running on port 3001')
});